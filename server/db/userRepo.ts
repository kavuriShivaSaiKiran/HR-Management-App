import { getDb, saveDatabase } from './database';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'HR_MANAGER' | 'EMPLOYEE' | string;
  is_active: number;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export type SafeUser = Omit<User, 'password_hash'>;

export class UserRepository {
  static async findByEmail(email: string): Promise<User | null> {
    const db = await getDb();
    const query = `
      SELECT id, email, password_hash, full_name, role, is_active, created_at, updated_at, last_login_at
      FROM users
      WHERE LOWER(email) = LOWER(?)
      LIMIT 1
    `;
    const stmt = db.prepare(query);
    stmt.bind([email.trim()]);
    if (stmt.step()) {
      const row = stmt.getAsObject() as any;
      stmt.free();
      return {
        id: Number(row.id),
        email: String(row.email),
        password_hash: String(row.password_hash),
        full_name: String(row.full_name),
        role: String(row.role),
        is_active: Number(row.is_active),
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
        last_login_at: row.last_login_at ? String(row.last_login_at) : null
      };
    }
    stmt.free();
    return null;
  }

  static async findById(id: number): Promise<User | null> {
    const db = await getDb();
    const query = `
      SELECT id, email, password_hash, full_name, role, is_active, created_at, updated_at, last_login_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `;
    const stmt = db.prepare(query);
    stmt.bind([id]);
    if (stmt.step()) {
      const row = stmt.getAsObject() as any;
      stmt.free();
      return {
        id: Number(row.id),
        email: String(row.email),
        password_hash: String(row.password_hash),
        full_name: String(row.full_name),
        role: String(row.role),
        is_active: Number(row.is_active),
        created_at: String(row.created_at),
        updated_at: String(row.updated_at),
        last_login_at: row.last_login_at ? String(row.last_login_at) : null
      };
    }
    stmt.free();
    return null;
  }

  static async updateLastLogin(id: number): Promise<void> {
    const db = await getDb();
    const now = new Date().toISOString();
    db.run(`UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?`, [now, now, id]);
    saveDatabase(db);
  }

  static toSafeUser(user: User): SafeUser {
    const { password_hash, ...safe } = user;
    return safe;
  }

  static verifyPassword(plain: string, hash: string): boolean {
    try {
      return bcrypt.compareSync(plain, hash);
    } catch {
      return false;
    }
  }

  static hashPassword(plain: string): string {
    return bcrypt.hashSync(plain, 10);
  }
}
