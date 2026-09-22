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

// GET /api/dashboard - main dashboard route with analysis period filter
apiRouter.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const countryCode = req.query.country_code as string;
    const departmentId = req.query.department_id as string;
    const startDate = req.query.start_date as string;
    const endDate = req.query.end_date as string;
    const asOfDate = req.query.as_of_date as string;

    const summary = await EmployeeRepository.getDashboardSummary(
      countryCode,
      departmentId,
      startDate,
      endDate,
      asOfDate
    );
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/summary - dynamic aggregated summary with country, department, & period filtering
apiRouter.get('/dashboard/summary', async (req: Request, res: Response) => {
  try {
    const countryCode = req.query.country_code as string;
    const departmentId = req.query.department_id as string;
    const startDate = req.query.start_date as string;
    const endDate = req.query.end_date as string;
    const asOfDate = req.query.as_of_date as string;

    const summary = await EmployeeRepository.getDashboardSummary(
      countryCode,
      departmentId,
      startDate,
      endDate,
      asOfDate
    );
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/recent-changes - recent auditable salary modifications
apiRouter.get('/dashboard/recent-changes', async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const countryCode = req.query.country_code as string;
    const departmentId = req.query.department_id as string;
    const startDate = req.query.start_date as string;
    const endDate = req.query.end_date as string;

    const changes = await EmployeeRepository.getRecentSalaryChanges(
      limit,
      countryCode,
      departmentId,
      startDate,
      endDate
    );
    res.json(changes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/employees/:id/history - full chronological salary history
apiRouter.get('/employees/:id/history', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }
    const history = await EmployeeRepository.getEmployeeSalaryHistory(id);
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/insights - compensation insights overview, department, country, salary bands, levels with period filter
apiRouter.get('/insights', async (req: Request, res: Response) => {
  try {
    const countryCode = req.query.country_code as string;
    const departmentId = req.query.department_id as string;
    const startDate = req.query.start_date as string;
    const endDate = req.query.end_date as string;
    const asOfDate = req.query.as_of_date as string;

    const insights = await EmployeeRepository.getCompensationInsights(
      countryCode,
      departmentId,
      startDate,
      endDate,
      asOfDate
    );
    res.json(insights);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/insights/question - deterministic compensation query execution
apiRouter.get('/insights/question', async (req: Request, res: Response) => {
  try {
    const questionId = (req.query.id as string) || '1';
    const threshold = Number(req.query.threshold) || 100000;
    const answer = await EmployeeRepository.answerCompensationQuestion(questionId, threshold);
    res.json(answer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/employees/:id/salary - update current salary directly in SQLite with complete audit trail
apiRouter.put('/employees/:id/salary', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const newSalary = req.body.new_salary !== undefined
      ? Number(req.body.new_salary)
      : (req.body.current_salary !== undefined 
          ? Number(req.body.current_salary) 
          : (req.body.base_salary !== undefined ? Number(req.body.base_salary) : NaN));

    if (isNaN(newSalary) || newSalary <= 0) {
      return res.status(400).json({ error: 'Valid positive new_salary is required' });
    }

    const employee = await EmployeeRepository.updateEmployeeSalary(id, {
      new_salary: newSalary,
      currency_code: req.body.currency_code,
      effective_date: req.body.effective_date,
      reason: req.body.reason,
      comment: req.body.comment,
      changed_by: req.body.changed_by
    });
    res.json(employee);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/employees/:id/salary-change - alternative endpoint for salary change
apiRouter.post('/employees/:id/salary-change', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const newSalary = Number(req.body.new_salary || req.body.base_salary);
    if (isNaN(newSalary) || newSalary <= 0) {
      return res.status(400).json({ error: 'Valid positive new_salary is required' });
    }

    const employee = await EmployeeRepository.updateEmployeeSalary(id, {
      new_salary: newSalary,
      currency_code: req.body.currency_code,
      effective_date: req.body.effective_date,
      reason: req.body.reason,
      comment: req.body.comment,
      changed_by: req.body.changed_by
    });
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

    const salary = req.body.current_salary !== undefined 
      ? Number(req.body.current_salary) 
      : Number(req.body.base_salary);

    const employee = await EmployeeRepository.recordSalaryChange(id, {
      ...req.body,
      base_salary: salary
    });
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
