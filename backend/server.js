require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const User = require('./models/User');
const Customer = require('./models/Customer');
const Employee = require('./models/Employee');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Invoice = require('./models/Invoice');
const Expense = require('./models/Expense');
const Template = require('./models/Template');
const Setting = require('./models/Setting');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'treeelivine-secret-2024';
const COOKIE_NAME = 'treeelivine_session';

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use('/api', limiter);

// ─── DB ────────────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/treeelivine')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ─── Helpers ───────────────────────────────────────────────────────────────────
async function getSettings() {
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});
  return settings;
}

function getEffectivePermissions(user, settings) {
  if (!settings || !settings.roles) return [];
  const roleObj = settings.roles.find(r => r.role === user.role);
  let perms = roleObj ? [...roleObj.permissions] : [];

  const override = settings.userPermissionOverrides?.find(
    o => o.userId?.toString() === user._id?.toString()
  );
  if (override) {
    perms = [...new Set([...perms, ...(override.permissions || [])])];
    perms = perms.filter(p => !(override.deniedPermissions || []).includes(p));
  }
  return perms;
}

// ─── Auth Middleware ───────────────────────────────────────────────────────────
async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).lean();
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'Account inactive' });

    const settings = await getSettings();
    user.effectivePermissions = getEffectivePermissions(user, settings);
    req.user = user;
    req.settings = settings;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid session' });
  }
}

function requirePermission(perm) {
  return (req, res, next) => {
    if (!req.user.effectivePermissions.includes(perm) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Permission denied' });
    }
    next();
  };
}

// ─── Salary Generator ──────────────────────────────────────────────────────────
async function syncRecurringSalaryExpenses() {
  try {
    const templates = await Expense.find({ isTemplate: true, expenseType: 'salary', active: true });
    const now = new Date();
    for (const tmpl of templates) {
      if (!tmpl.salaryNextDueDate || tmpl.salaryNextDueDate > now) continue;

      const monthKey = `${tmpl.salaryNextDueDate.getFullYear()}-${String(tmpl.salaryNextDueDate.getMonth() + 1).padStart(2, '0')}`;
      const exists = await Expense.findOne({ sourceExpenseId: tmpl._id, generatedMonthKey: monthKey });
      if (!exists) {
        await Expense.create({
          description: tmpl.description,
          category: tmpl.category,
          amount: tmpl.amount,
          amountOriginal: tmpl.amountOriginal || tmpl.amount,
          currency: tmpl.currency,
          currencyCode: tmpl.currencyCode,
          exchangeRateToBase: tmpl.exchangeRateToBase,
          amountBase: tmpl.amountBase || tmpl.amount,
          employeeId: tmpl.employeeId,
          expenseType: 'salary',
          isTemplate: false,
          generatedMonthKey: monthKey,
          sourceExpenseId: tmpl._id,
          active: true,
        });
      }

      const next = new Date(tmpl.salaryNextDueDate);
      next.setMonth(next.getMonth() + 1);
      tmpl.salaryNextDueDate = next;
      tmpl.salaryLastGeneratedMonthKey = monthKey;
      await tmpl.save();
    }
  } catch (err) {
    console.error('syncRecurringSalaryExpenses error:', err);
  }
}

// ─── Invoice number generator ──────────────────────────────────────────────────
async function generateInvoiceNumber() {
  const count = await Invoice.countDocuments();
  return `INV-${String(count + 1).padStart(4, '0')}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Account is inactive' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const settings = await getSettings();
    const effectivePermissions = getEffectivePermissions(user, settings);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: { ...safeUser, effectivePermissions } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password required' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const customer = await Customer.create({ name, phone, email, status: 'active' });
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashed,
      role: 'client',
      isActive: true,
      referenceId: customer._id,
      roleRef: 'Customer',
    });
    customer.user = user._id;
    await customer.save();

    res.status(201).json({ success: true, message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/auth/session', async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ success: false, message: 'No session' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).lean();
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'Session invalid' });

    const settings = await getSettings();
    const effectivePermissions = getEffectivePermissions(user, settings);
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: { ...safeUser, effectivePermissions } });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid session' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    await syncRecurringSalaryExpenses();
    const { period, startDate, endDate } = req.query;
    const now = new Date();
    let dateFilter = {};

    if (period === 'today') {
      const start = new Date(now); start.setHours(0,0,0,0);
      dateFilter = { $gte: start };
    } else if (period === '7d') {
      const start = new Date(now); start.setDate(start.getDate() - 7);
      dateFilter = { $gte: start };
    } else if (period === '30d') {
      const start = new Date(now); start.setDate(start.getDate() - 30);
      dateFilter = { $gte: start };
    } else if (period === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { $gte: start };
    } else if (period === 'quarter') {
      const q = Math.floor(now.getMonth() / 3);
      const start = new Date(now.getFullYear(), q * 3, 1);
      dateFilter = { $gte: start };
    } else if (period === 'custom' && startDate && endDate) {
      dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const dateQ = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};

    const isClient = req.user.role === 'client';
    const clientCustomerId = isClient ? req.user.referenceId : null;

    const customerFilter = isClient ? { _id: clientCustomerId } : {};
    const projectFilter = isClient ? { customerId: clientCustomerId } : {};
    const taskFilter = isClient ? { customerId: clientCustomerId } : {};
    const invoiceFilter = isClient ? { customerId: clientCustomerId } : {};

    const [
      activeCustomers,
      activeProjects,
      openTasks,
      overdueTasks,
      invoices,
      expenses,
    ] = await Promise.all([
      Customer.countDocuments({ ...customerFilter, status: 'active' }),
      Project.countDocuments({ ...projectFilter, status: 'active' }),
      Task.countDocuments({ ...taskFilter, status: { $in: ['new','assigned','in_progress','reopened'] } }),
      Task.countDocuments({ ...taskFilter, dueDate: { $lt: now }, status: { $nin: ['completed','cancelled'] } }),
      Invoice.find({ ...invoiceFilter, ...dateQ }),
      Expense.find({ isTemplate: false, ...dateQ }),
    ]);

    const collected = invoices.filter(i => ['paid'].includes(i.status)).reduce((a, i) => a + (i.amountBase || 0), 0);
    const unpaidAmt = invoices.filter(i => ['unpaid','issued','partially_paid','overdue'].includes(i.status)).reduce((a, i) => a + (i.remainingAmountBase || 0), 0);
    const totalExpenses = expenses.reduce((a, e) => a + (e.amountBase || 0), 0);
    const net = collected - totalExpenses;

    res.json({
      success: true,
      data: {
        activeCustomers,
        activeProjects,
        openTasks,
        overdueTasks,
        collected,
        unpaidAmt,
        totalExpenses,
        net,
        unpaidInvoices: invoices.filter(i => ['unpaid','issued','partially_paid','overdue'].includes(i.status)).length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/customers', authMiddleware, requirePermission('crm.read'), async (req, res) => {
  try {
    const { search, status, priority, source, assignedTo } = req.query;
    const query = {};
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { company: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { phone: new RegExp(search, 'i') },
    ];
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (source) query.source = source;
    if (assignedTo) query.assignedTo = assignedTo;

    // account_manager scoping
    if (req.user.role === 'team') {
      const emp = await Employee.findOne({ user: req.user._id });
      if (emp) query.assignedTo = emp._id;
    }

    const customers = await Customer.find(query)
      .populate('assignedTo', 'name email internalRole')
      .populate('user', 'email isActive')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/customers/:id', authMiddleware, requirePermission('crm.read'), async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('assignedTo', 'name email internalRole')
      .populate('user', 'email isActive role');
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/customers', authMiddleware, requirePermission('crm.write'), async (req, res) => {
  try {
    const { force, ...data } = req.body;
    if (!data.name) return res.status(400).json({ success: false, message: 'Name is required' });
    if (data.status === 'active' && !data.company) return res.status(400).json({ success: false, message: 'Company is required for active customers' });
    if (!data.phone && !data.email) return res.status(400).json({ success: false, message: 'Phone or email is required' });

    if (!force) {
      const dupQuery = [];
      if (data.email) dupQuery.push({ email: data.email });
      if (data.phone) dupQuery.push({ phone: data.phone });
      if (data.company) dupQuery.push({ company: data.company });
      if (dupQuery.length) {
        const dups = await Customer.find({ $or: dupQuery });
        if (dups.length) return res.status(409).json({ success: false, message: 'Possible duplicate', duplicates: dups });
      }
    }

    const customer = await Customer.create(data);
    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/customers/:id', authMiddleware, requirePermission('crm.write'), async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/customers/:id', authMiddleware, requirePermission('crm.write'), async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/customers/bulk', authMiddleware, requirePermission('crm.write'), async (req, res) => {
  try {
    const { ids, action, value } = req.body;
    if (!ids || !ids.length) return res.status(400).json({ success: false, message: 'No IDs provided' });
    let update = {};
    if (action === 'status') update = { status: value };
    else if (action === 'assignedTo') update = { assignedTo: value };
    else if (action === 'archive') update = { archivedAt: new Date(), archivedBy: req.user._id };
    await Customer.updateMany({ _id: { $in: ids } }, update);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// EMPLOYEES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/employees', authMiddleware, requirePermission('team.read'), async (req, res) => {
  try {
    const { search, internalRole, isActive } = req.query;
    const query = {};
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    if (internalRole) query.internalRole = internalRole;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    const employees = await Employee.find(query).populate('user', 'email isActive role').sort({ name: 1 });
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/employees/:id', authMiddleware, requirePermission('team.read'), async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id).populate('user', 'email isActive role');
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });

    const [taskCount, projectCount, overdueTasks] = await Promise.all([
      Task.countDocuments({ currentAssigneeId: emp._id, status: { $nin: ['completed','cancelled'] } }),
      Project.countDocuments({ assignedEmployeeIds: emp._id, status: 'active' }),
      Task.countDocuments({ currentAssigneeId: emp._id, dueDate: { $lt: new Date() }, status: { $nin: ['completed','cancelled'] } }),
    ]);

    res.json({ success: true, data: emp, stats: { taskCount, projectCount, overdueTasks } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/employees', authMiddleware, requirePermission('team.write'), async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    res.status(201).json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/employees/:id', authMiddleware, requirePermission('team.write'), async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/employees/:id', authMiddleware, requirePermission('team.write'), async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/projects', authMiddleware, requirePermission('projects.read'), async (req, res) => {
  try {
    const { search, status, customerId, accountManagerId } = req.query;
    const query = {};
    if (search) query.name = new RegExp(search, 'i');
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;
    if (accountManagerId) query.accountManagerId = accountManagerId;

    if (req.user.role === 'client') {
      query.customerId = req.user.referenceId;
    } else if (req.user.role === 'team') {
      const emp = await Employee.findOne({ user: req.user._id });
      if (emp) query.assignedEmployeeIds = emp._id;
    }

    const projects = await Project.find(query)
      .populate('customerId', 'name company')
      .populate('accountManagerId', 'name email')
      .populate('assignedEmployeeIds', 'name email')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/projects/:id', authMiddleware, requirePermission('projects.read'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('customerId', 'name company email phone')
      .populate('accountManagerId', 'name email')
      .populate('assignedEmployeeIds', 'name email internalRole')
      .populate('ownerId', 'name email');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/projects', authMiddleware, requirePermission('projects.write'), async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.briefTemplateId) {
      const tmpl = await Template.findById(data.briefTemplateId);
      if (tmpl && tmpl.briefQuestions && tmpl.briefQuestions.length) {
        data.briefQuestionsSnapshot = tmpl.briefQuestions;
        data.briefStatus = 'not_started';
        data.briefAnswers = {};
        data.briefComments = [];
      }
    }

    // compute assignmentStatus
    let assignCount = 0;
    if (data.customerId) assignCount++;
    if (data.accountManagerId) assignCount++;
    if (data.assignedEmployeeIds && data.assignedEmployeeIds.length) assignCount++;
    if (assignCount === 0) data.assignmentStatus = 'unassigned';
    else if (assignCount === 3) data.assignmentStatus = 'ready';
    else data.assignmentStatus = 'partial';

    const project = await Project.create(data);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/projects/:id', authMiddleware, requirePermission('projects.write'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.briefTemplateId) {
      const existing = await Project.findById(req.params.id);
      if (existing && existing.briefTemplateId?.toString() !== data.briefTemplateId) {
        const tmpl = await Template.findById(data.briefTemplateId);
        if (tmpl && tmpl.briefQuestions?.length) {
          data.briefQuestionsSnapshot = tmpl.briefQuestions;
          data.briefStatus = 'not_started';
          data.briefAnswers = {};
          data.briefComments = [];
        }
      }
    }
    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/projects/:id', authMiddleware, requirePermission('projects.write'), async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Brief
async function checkBriefAccess(req, res, project) {
  const user = req.user;
  if (user.role === 'admin' || user.role === 'manager') return true;
  if (user.role === 'client') {
    return project.customerId?.toString() === user.referenceId?.toString();
  }
  const emp = await Employee.findOne({ user: user._id });
  if (!emp) return false;
  if (project.accountManagerId?.toString() === emp._id.toString()) return true;
  if (project.assignedEmployeeIds?.some(id => id.toString() === emp._id.toString())) return true;
  const taskExists = await Task.findOne({ projectId: project._id, currentAssigneeId: emp._id });
  return !!taskExists;
}

app.get('/api/projects/:id/brief', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('customerId', 'name company');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    const hasAccess = await checkBriefAccess(req, res, project);
    if (!hasAccess) return res.status(403).json({ success: false, message: 'Access denied' });
    res.json({ success: true, data: { briefStatus: project.briefStatus, briefQuestionsSnapshot: project.briefQuestionsSnapshot, briefAnswers: project.briefAnswers, briefComments: project.briefComments, briefSubmittedAt: project.briefSubmittedAt, briefUpdatedAt: project.briefUpdatedAt } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/projects/:id/brief', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    const hasAccess = await checkBriefAccess(req, res, project);
    if (!hasAccess) return res.status(403).json({ success: false, message: 'Access denied' });

    const { briefAnswers, briefStatus } = req.body;
    const adminStatuses = ['reviewing', 'changes_requested', 'approved'];
    if (req.user.role === 'client' && adminStatuses.includes(briefStatus)) {
      return res.status(403).json({ success: false, message: 'Cannot set this status' });
    }

    if (briefAnswers !== undefined) project.briefAnswers = briefAnswers;
    if (briefStatus) {
      project.briefStatus = briefStatus;
      if (briefStatus === 'submitted' && !project.briefSubmittedAt) {
        project.briefSubmittedAt = new Date();
      }
    }
    project.briefUpdatedAt = new Date();
    await project.save();
    res.json({ success: true, data: { briefStatus: project.briefStatus, briefAnswers: project.briefAnswers, briefSubmittedAt: project.briefSubmittedAt, briefUpdatedAt: project.briefUpdatedAt } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/projects/:id/brief/comment', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    const hasAccess = await checkBriefAccess(req, res, project);
    if (!hasAccess) return res.status(403).json({ success: false, message: 'Access denied' });

    const comment = { userId: req.user._id, userName: req.user.email, text: req.body.text, timestamp: new Date() };
    project.briefComments.push(comment);
    project.briefUpdatedAt = new Date();
    await project.save();
    res.json({ success: true, data: comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/tasks', authMiddleware, requirePermission('tasks.read'), async (req, res) => {
  try {
    const { search, status, priority, projectId, customerId, assigneeId } = req.query;
    const query = {};
    if (search) query.title = new RegExp(search, 'i');
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (projectId) query.projectId = projectId;
    if (customerId) query.customerId = customerId;
    if (assigneeId) query.currentAssigneeId = assigneeId;

    if (req.user.role === 'client') {
      query.customerId = req.user.referenceId;
    } else if (req.user.role === 'team') {
      const emp = await Employee.findOne({ user: req.user._id });
      if (emp) {
        query.currentAssigneeId = emp._id;
        query.employeeVisible = { $ne: false };
      }
    }

    const tasks = await Task.find(query)
      .populate('currentAssigneeId', 'name email')
      .populate('projectId', 'name status')
      .populate('customerId', 'name company')
      .sort({ updatedAt: -1 });

    // hide pricing for task_member
    const canSeePricing = req.user.role === 'admin' || req.user.role === 'finance';
    const emp = await Employee.findOne({ user: req.user._id });
    const result = tasks.map(t => {
      const obj = t.toObject();
      const isOwner = emp && t.currentAssigneeId?._id?.toString() === emp._id.toString();
      if (!canSeePricing && !isOwner) {
        delete obj.amountOriginal; delete obj.amountBase; delete obj.teamDueOriginal; delete obj.teamDueBase;
      }
      return obj;
    });

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/tasks/:id', authMiddleware, requirePermission('tasks.read'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('currentAssigneeId', 'name email internalRole')
      .populate('projectId', 'name status workflowMode')
      .populate('customerId', 'name company');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/tasks', authMiddleware, requirePermission('tasks.write'), async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/tasks/:id', authMiddleware, requirePermission('tasks.write'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const isAdmin = req.user.role === 'admin';
    const emp = await Employee.findOne({ user: req.user._id });
    const isTaskMember = req.user.role === 'team' && emp?.internalRole === 'task_member';

    if (isTaskMember && task.employeeVisible === false) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // protect pricing fields
    const data = { ...req.body };
    if (!isAdmin) {
      delete data.amountOriginal; delete data.amountBase;
      delete data.teamDueOriginal; delete data.teamDueBase;
      delete data.teamDueCurrency; delete data.currencyOriginal;
    }

    // compute efficiency on complete
    if (data.status === 'completed' && task.status !== 'completed') {
      data.completedAt = new Date();
      data.actualDeliveryDate = data.actualDeliveryDate || new Date();
      if (task.dueDate) {
        const diff = (new Date(data.actualDeliveryDate) - new Date(task.dueDate)) / (1000 * 60 * 60 * 24);
        data.efficiencyScore = diff <= 0 ? 100 : Math.max(0, 100 - diff * 5);
      }
    }

    Object.assign(task, data);
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/tasks/:id', authMiddleware, requirePermission('tasks.write'), async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/tasks/:id/handover', authMiddleware, requirePermission('tasks.handover'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    const { toEmployeeId, note } = req.body;
    task.handoverHistory.push({ fromEmployeeId: task.currentAssigneeId, toEmployeeId, note, timestamp: new Date() });
    task.currentAssigneeId = toEmployeeId;
    task.status = 'handed_over';
    task.handedOverAt = new Date();
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/tasks/:id/status', authMiddleware, requirePermission('tasks.write'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    const { status } = req.body;
    task.status = status;
    if (status === 'in_progress' && !task.startedAt) task.startedAt = new Date();
    if (status === 'completed') { task.completedAt = new Date(); task.actualDeliveryDate = new Date(); }
    if (status === 'under_review') { task.reviewStatus = 'under_review'; task.reviewedAt = new Date(); }
    if (status === 'reopened') { task.reopenedCount = (task.reopenedCount || 0) + 1; task.reviewStatus = 'reopened'; }
    await task.save();
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// INVOICES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/invoices', authMiddleware, requirePermission('finance.read'), async (req, res) => {
  try {
    const { customerId, projectId, status } = req.query;
    const query = {};
    if (customerId) query.customerId = customerId;
    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    if (req.user.role === 'client') query.customerId = req.user.referenceId;

    const invoices = await Invoice.find(query)
      .populate('customerId', 'name company')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/invoices/:id', authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customerId', 'name company email phone')
      .populate('projectId', 'name taxRate');
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    if (req.user.role === 'client' && invoice.customerId?._id?.toString() !== req.user.referenceId?.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const settings = await getSettings();
    res.json({ success: true, data: invoice, settings: { companyName: settings.companyName, companyLogo: settings.companyLogo, baseCurrency: settings.baseCurrency } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/invoices', authMiddleware, requirePermission('finance.write'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.customerId || !data.subtotalOriginal) {
      return res.status(400).json({ success: false, message: 'Customer and amount are required' });
    }
    if (!data.invoiceNumber) data.invoiceNumber = await generateInvoiceNumber();
    if (!data.taxRate && data.projectId) {
      const proj = await Project.findById(data.projectId);
      if (proj) data.taxRate = proj.taxRate || 0;
    }
    data.subtotalBase = (data.subtotalOriginal || 0) * (data.exchangeRateToBase || 1);
    data.taxAmountOriginal = data.subtotalOriginal * ((data.taxRate || 0) / 100);
    data.taxAmountBase = data.subtotalBase * ((data.taxRate || 0) / 100);
    data.amountBase = data.subtotalBase + data.taxAmountBase;
    data.remainingAmountBase = data.amountBase - (data.paidAmountBase || 0);

    const invoice = await Invoice.create(data);
    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/invoices/:id', authMiddleware, requirePermission('finance.write'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.subtotalOriginal !== undefined) {
      data.subtotalBase = (data.subtotalOriginal || 0) * (data.exchangeRateToBase || 1);
      data.taxAmountOriginal = data.subtotalOriginal * ((data.taxRate || 0) / 100);
      data.taxAmountBase = data.subtotalBase * ((data.taxRate || 0) / 100);
      data.amountBase = data.subtotalBase + data.taxAmountBase;
      data.remainingAmountBase = data.amountBase - (data.paidAmountBase || 0);
    }
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/invoices/:id', authMiddleware, requirePermission('finance.write'), async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// EXPENSES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/expenses', authMiddleware, requirePermission('finance.read'), async (req, res) => {
  try {
    await syncRecurringSalaryExpenses();
    const { expenseType, isTemplate, employeeId, projectId } = req.query;
    const query = {};
    if (expenseType) query.expenseType = expenseType;
    if (isTemplate !== undefined) query.isTemplate = isTemplate === 'true';
    if (employeeId) query.employeeId = employeeId;
    if (projectId) query.projectId = projectId;

    const expenses = await Expense.find(query)
      .populate('employeeId', 'name email')
      .populate('projectId', 'name')
      .populate('customerId', 'name company')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/expenses/salary-templates', authMiddleware, requirePermission('finance.read'), async (req, res) => {
  try {
    const templates = await Expense.find({ isTemplate: true, expenseType: 'salary' })
      .populate('employeeId', 'name email');
    res.json({ success: true, data: templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/expenses', authMiddleware, requirePermission('finance.write'), async (req, res) => {
  try {
    const data = { ...req.body };
    data.amountBase = (data.amountOriginal || data.amount || 0) * (data.exchangeRateToBase || 1);

    if (data.expenseType === 'distributed' && data.distributionMode) {
      let customers = [];
      if (data.distributionMode === 'active_customers') {
        customers = await Customer.find({ status: 'active' }, '_id');
      } else if (data.distributionMode === 'selected_customers') {
        customers = (data.distributionCustomerIds || []).map(id => ({ _id: id }));
      }
      const count = customers.length || 1;
      const perCost = data.amountBase / count;
      data.distributedCustomerCount = count;
      data.perCustomerCost = perCost;
      data.allocations = customers.map(c => ({ customerId: c._id, amount: perCost }));
    }

    const expense = await Expense.create(data);
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/expenses/:id', authMiddleware, requirePermission('finance.write'), async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/expenses/:id', authMiddleware, requirePermission('finance.write'), async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/templates', authMiddleware, requirePermission('templates.read'), async (req, res) => {
  try {
    const { kind, status } = req.query;
    const query = {};
    if (kind) query.kind = kind;
    if (status) query.status = status;
    const templates = await Template.find(query).sort({ name: 1 });
    res.json({ success: true, data: templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/templates/:id', authMiddleware, requirePermission('templates.read'), async (req, res) => {
  try {
    const tmpl = await Template.findById(req.params.id);
    if (!tmpl) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, data: tmpl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/templates', authMiddleware, requirePermission('templates.write'), async (req, res) => {
  try {
    const tmpl = await Template.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: tmpl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/templates/:id', authMiddleware, requirePermission('templates.write'), async (req, res) => {
  try {
    const tmpl = await Template.findByIdAndUpdate(req.params.id, { ...req.body, updatedBy: req.user._id }, { new: true });
    if (!tmpl) return res.status(404).json({ success: false, message: 'Template not found' });
    res.json({ success: true, data: tmpl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/templates/:id', authMiddleware, requirePermission('templates.write'), async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/templates/:id/recommend', authMiddleware, async (req, res) => {
  try {
    const tmpl = await Template.findById(req.params.id);
    if (!tmpl) return res.status(404).json({ success: false, message: 'Template not found' });

    const rule = tmpl.assignmentRule || {};
    const specW = rule.specialtyWeight || 1;
    const indW = rule.industryWeight || 1;
    const avaW = rule.availabilityWeight || 1;
    const loadW = rule.workloadWeight || 1;
    const maxLoad = rule.maxWorkloadTasks || 10;

    const filter = { isActive: true };
    if (rule.excludeOnLeave) filter.onLeave = false;

    const employees = await Employee.find(filter);
    const taskCounts = await Task.aggregate([
      { $match: { status: { $nin: ['completed','cancelled'] } } },
      { $group: { _id: '$currentAssigneeId', count: { $sum: 1 } } },
    ]);
    const loadMap = {};
    taskCounts.forEach(t => { loadMap[t._id.toString()] = t.count; });

    const scored = employees.map(emp => {
      const load = loadMap[emp._id.toString()] || 0;
      if (rule.maxWorkloadTasks && load >= maxLoad) return null;

      let score = 0;
      const specMatch = (tmpl.requiredSpecializations || []).filter(s => (emp.specializations || []).includes(s)).length;
      const indMatch = (tmpl.industryPreferences || []).filter(i => (emp.industryPreferences || []).includes(i)).length;
      score += specMatch * specW;
      score += indMatch * indW;
      score += (emp.availabilityStatus === 'available' ? 1 : 0) * avaW;
      score += Math.max(0, (maxLoad - load) / maxLoad) * loadW;

      return { employee: emp, score, load };
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 5);

    res.json({ success: true, data: scored });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/settings', authMiddleware, async (req, res) => {
  try {
    const settings = await getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/settings', authMiddleware, requirePermission('settings.write'), async (req, res) => {
  try {
    const settings = await getSettings();
    const allowed = ['companyName','companyLogo','companyDescription','language','defaultLanguage','enabledLanguages','theme','customColorsEnabled','primaryColor','baseCurrency','enabledCurrencies','exchangeRates','customSpecializations','permissions','roles','userPermissionOverrides'];
    allowed.forEach(key => { if (req.body[key] !== undefined) settings[key] = req.body[key]; });

    settings.auditTrail.push({ action: 'settings.updated', performedBy: req.user._id, details: Object.keys(req.body), timestamp: new Date() });
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/settings/currencies', authMiddleware, requirePermission('settings.write'), async (req, res) => {
  try {
    const settings = await getSettings();
    const { exchangeRates, enabledCurrencies, baseCurrency } = req.body;
    if (exchangeRates) settings.exchangeRates = exchangeRates;
    if (enabledCurrencies) settings.enabledCurrencies = enabledCurrencies;
    if (baseCurrency) settings.baseCurrency = baseCurrency;
    settings.exchangeRatesLastUpdatedAt = new Date();
    settings.exchangeRatesUpdatedBy = req.user._id;
    settings.auditTrail.push({ action: 'currencies.updated', performedBy: req.user._id, timestamp: new Date() });
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/users', authMiddleware, requirePermission('team.read'), async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/users', authMiddleware, requirePermission('team.write'), async (req, res) => {
  try {
    const { email, password, role, referenceId, roleRef } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase(), password: hashed, role, isActive: true, referenceId, roleRef });
    if (referenceId && roleRef === 'Employee') {
      await Employee.findByIdAndUpdate(referenceId, { user: user._id });
    }
    const { password: _, ...safe } = user.toObject();
    res.status(201).json({ success: true, data: safe });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/users/:id', authMiddleware, requirePermission('team.write'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, data, { new: true, select: '-password' });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/users/:id', authMiddleware, requirePermission('team.write'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Error Handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

app.listen(PORT, () => console.log(`Treeelivine backend running on port ${PORT}`));
