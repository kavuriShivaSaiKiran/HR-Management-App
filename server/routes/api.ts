import { Router, Request, Response } from 'express';
import { EmployeeRepository } from '../db/orm';

export const apiRouter = Router();

// Metadata: departments, pay bands, fx rates
apiRouter.get('/meta', async (req: Request, res: Response) => {
  try {
    const [departments, payBands, fxRates] = await Promise.all([
      EmployeeRepository.getDepartments(),
      EmployeeRepository.getPayBands(),
      EmployeeRepository.getFxRates()
    ]);
    res.json({ departments, payBands, fxRates });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/employees - paginated, filterable
apiRouter.get('/employees', async (req: Request, res: Response) => {
  try {
    const {
      search,
      department_id,
      country_code,
      pay_band_id,
      status,
      page,
      limit,
      sort_by,
      sort_order
    } = req.query;

    const result = await EmployeeRepository.listEmployees({
      search: search as string,
      department_id: department_id ? String(department_id) : undefined,
      country_code: country_code as string,
      pay_band_id: pay_band_id ? String(pay_band_id) : undefined,
      status: status as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      sort_by: sort_by as string,
      sort_order: sort_order as 'asc' | 'desc'
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/employees/:id - detail with current + historical salary
apiRouter.get('/employees/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const employee = await EmployeeRepository.getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/employees - create employee + initial salary record
apiRouter.post('/employees', async (req: Request, res: Response) => {
  try {
    const employee = await EmployeeRepository.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/employees/:id - update employee details
apiRouter.put('/employees/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const employee = await EmployeeRepository.updateEmployee(id, req.body);
    res.json(employee);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/employees/:id/salary - record a salary change
apiRouter.patch('/employees/:id/salary', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const employee = await EmployeeRepository.recordSalaryChange(id, req.body);
    res.json(employee);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/employees/:id - soft delete (set status inactive)
apiRouter.delete('/employees/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const result = await EmployeeRepository.softDeleteEmployee(id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/analytics/payroll-cost?group_by=department|country
apiRouter.get('/analytics/payroll-cost', async (req: Request, res: Response) => {
  try {
    const groupBy = (req.query.group_by as 'department' | 'country') || 'department';
    const data = await EmployeeRepository.getPayrollCost(groupBy);
    res.json({ group_by: groupBy, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/salary-distribution?group_by=pay_band
apiRouter.get('/analytics/salary-distribution', async (req: Request, res: Response) => {
  try {
    const data = await EmployeeRepository.getSalaryDistribution();
    res.json({ group_by: 'pay_band', data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/comparison?dimension=role&group_by=department
apiRouter.get('/analytics/comparison', async (req: Request, res: Response) => {
  try {
    const dimension = (req.query.dimension as string) || 'role';
    const groupBy = (req.query.group_by as string) || 'department';
    const data = await EmployeeRepository.getComparison(dimension, groupBy);
    res.json({ dimension, group_by: groupBy, data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/stats (filterable by country_code and period)
apiRouter.get('/dashboard/stats', async (req: Request, res: Response) => {
  try {
    const countryCode = req.query.country_code as string;
    const period = req.query.period as string;
    const stats = await EmployeeRepository.getDashboardStats(countryCode, period);
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/payroll-trend?country_code=...&period=...
apiRouter.get('/dashboard/payroll-trend', async (req: Request, res: Response) => {
  try {
    const countryCode = (req.query.country_code as string) || 'all';
    const period = (req.query.period as string) || '6m';
    const trendData = await EmployeeRepository.getPayrollTrend(countryCode, period);
    res.json(trendData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/activities
apiRouter.get('/activities', async (req: Request, res: Response) => {
  try {
    const activities = await EmployeeRepository.getActivityLogs();
    res.json(activities);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payroll/run
apiRouter.post('/payroll/run', async (req: Request, res: Response) => {
  try {
    const stats = await EmployeeRepository.getDashboardStats();
    res.json({
      success: true,
      message: `Payroll run completed for ${stats.employees_paid_count} employees. Total: $${stats.total_payroll_month.toLocaleString()}`,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/seed
apiRouter.post('/seed', async (req: Request, res: Response) => {
  try {
    const count = Math.min(15000, Math.max(50, Number(req.body?.count) || 10000));
    const result = await EmployeeRepository.reseedDatabase(count);
    res.json({
      success: true,
      message: `Successfully generated ${result.count} employees with organizational distribution and salary histories`,
      count: result.count
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
