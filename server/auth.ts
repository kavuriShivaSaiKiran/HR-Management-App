import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository, SafeUser } from './db/userRepo';

// Environment-backed security configuration (default to deterministic dev secret if not set)
const JWT_SECRET = process.env.JWT_SECRET || 'acme-compensation-insecure-dev-secret-key-32chars';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';
const COOKIE_SAME_SITE = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';
export const AUTH_COOKIE_NAME = 'access_token';

export interface TokenPayload {
  sub: number;
  email: string;
  role: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: SafeUser;
}

export function signAccessToken(user: SafeUser): string {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.full_name
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return (jwt.verify(token, JWT_SECRET) as unknown) as TokenPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    path: '/',
    maxAge: 7 * 24 * 3600 * 1000 // 7 days in ms
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    path: '/'
  });
}

/**
 * Reusable dependency: get_current_user
 * Validates JWT access token from HTTP-only cookie or Bearer authorization header.
 * Verifies user in database and asserts is_active === 1.
 * Returns 401 for missing, invalid, expired, or inactive tokens.
 */
export async function get_current_user(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  let token: string | undefined = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required. No valid session or token provided.'
    });
    return;
  }

  const payload = verifyAccessToken(token);
  if (!payload || !payload.sub) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired authentication token.'
    });
    return;
  }

  const user = await UserRepository.findById(payload.sub);
  if (!user) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'User account associated with this token does not exist.'
    });
    return;
  }

  if (user.is_active !== 1) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'User account has been deactivated.'
    });
    return;
  }

  req.user = UserRepository.toSafeUser(user);
  next();
}

/**
 * Reusable dependency: require_hr_manager
 * Verifies that the authenticated user possesses the 'HR_MANAGER' role.
 * Returns 401 if unauthenticated, 403 if unauthorized.
 */
export async function require_hr_manager(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  // If get_current_user hasn't run yet, run it
  if (!req.user) {
    return get_current_user(req, res, () => {
      if (!req.user) {
        return; // get_current_user already sent 401
      }
      if (req.user.role !== 'HR_MANAGER') {
        res.status(403).json({
          error: 'Forbidden',
          message: 'Access denied: HR_MANAGER role is required for this operation.'
        });
        return;
      }
      next();
    });
  }

  if (req.user.role !== 'HR_MANAGER') {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Access denied: HR_MANAGER role is required for this operation.'
    });
    return;
  }

  next();
}
