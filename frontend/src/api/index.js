import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)
export const getSession = () => api.get('/auth/session')
export const logout = () => api.post('/auth/logout')

// Dashboard
export const getDashboard = (params) => api.get('/dashboard', { params })

// Customers
export const getCustomers = (params) => api.get('/customers', { params })
export const getCustomer = (id) => api.get(`/customers/${id}`)
export const createCustomer = (data) => api.post('/customers', data)
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data)
export const deleteCustomer = (id) => api.delete(`/customers/${id}`)
export const bulkCustomers = (data) => api.post('/customers/bulk', data)

// Employees
export const getEmployees = (params) => api.get('/employees', { params })
export const getEmployee = (id) => api.get(`/employees/${id}`)
export const createEmployee = (data) => api.post('/employees', data)
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data)
export const deleteEmployee = (id) => api.delete(`/employees/${id}`)

// Projects
export const getProjects = (params) => api.get('/projects', { params })
export const getProject = (id) => api.get(`/projects/${id}`)
export const createProject = (data) => api.post('/projects', data)
export const updateProject = (id, data) => api.put(`/projects/${id}`, data)
export const deleteProject = (id) => api.delete(`/projects/${id}`)
export const getBrief = (projectId) => api.get(`/projects/${projectId}/brief`)
export const updateBrief = (projectId, data) => api.put(`/projects/${projectId}/brief`, data)
export const addBriefComment = (projectId, data) => api.post(`/projects/${projectId}/brief/comment`, data)

// Tasks
export const getTasks = (params) => api.get('/tasks', { params })
export const getTask = (id) => api.get(`/tasks/${id}`)
export const createTask = (data) => api.post('/tasks', data)
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data)
export const deleteTask = (id) => api.delete(`/tasks/${id}`)
export const handoverTask = (id, data) => api.post(`/tasks/${id}/handover`, data)
export const updateTaskStatus = (id, data) => api.post(`/tasks/${id}/status`, data)

// Invoices
export const getInvoices = (params) => api.get('/invoices', { params })
export const getInvoice = (id) => api.get(`/invoices/${id}`)
export const createInvoice = (data) => api.post('/invoices', data)
export const updateInvoice = (id, data) => api.put(`/invoices/${id}`, data)
export const deleteInvoice = (id) => api.delete(`/invoices/${id}`)

// Expenses
export const getExpenses = (params) => api.get('/expenses', { params })
export const getSalaryTemplates = () => api.get('/expenses/salary-templates')
export const createExpense = (data) => api.post('/expenses', data)
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data)
export const deleteExpense = (id) => api.delete(`/expenses/${id}`)

// Templates
export const getTemplates = (params) => api.get('/templates', { params })
export const getTemplate = (id) => api.get(`/templates/${id}`)
export const createTemplate = (data) => api.post('/templates', data)
export const updateTemplate = (id, data) => api.put(`/templates/${id}`, data)
export const deleteTemplate = (id) => api.delete(`/templates/${id}`)
export const recommendAssignment = (id) => api.post(`/templates/${id}/recommend`)

// Settings
export const getSettings = () => api.get('/settings')
export const updateSettings = (data) => api.put('/settings', data)
export const updateCurrencies = (data) => api.put('/settings/currencies', data)

// Users
export const getUsers = () => api.get('/users')
export const createUser = (data) => api.post('/users', data)
export const updateUser = (id, data) => api.put(`/users/${id}`, data)
export const deleteUser = (id) => api.delete(`/users/${id}`)

export default api
