// Demo seed data - used for "Try Demo" mode
export const DEMO_EMAIL = 'demo@treeelivine.com'
export const DEMO_PASSWORD = 'demo1234'

export const demoCustomers = [
  { name: 'شركة النجوم للتقنية', company: 'النجوم للتقنية', email: 'info@stars-tech.sa', phone: '0501234567', status: 'active', priority: 'high', source: 'LinkedIn', service: 'إدارة وسائل التواصل', budget: 15000, score: 85 },
  { name: 'مؤسسة الريادة', company: 'الريادة', email: 'contact@riyadah.sa', phone: '0509876543', status: 'prospect', priority: 'medium', source: 'Referral', service: 'تصميم هوية', budget: 8000, score: 60 },
  { name: 'شركة المستقبل الرقمي', company: 'المستقبل الرقمي', email: 'hello@future-digital.sa', phone: '0551234567', status: 'active', priority: 'high', source: 'Website', service: 'إنتاج محتوى', budget: 22000, score: 90 },
  { name: 'مجموعة الإبداع', company: 'الإبداع', email: 'info@ibdaa.sa', phone: '0561234567', status: 'negotiation', priority: 'urgent', source: 'Cold Call', service: 'تسويق رقمي', budget: 30000, score: 70 },
  { name: 'شركة الأفق', company: 'الأفق للتجارة', email: 'contact@ufq.sa', phone: '0571234567', status: 'inactive', priority: 'low', source: 'Exhibition', service: 'صور منتجات', budget: 5000, score: 40 },
]

export const demoEmployees = [
  { name: 'أحمد المالكي', email: 'ahmed@treeelivine.com', phone: '0501111111', internalRole: 'account_manager', skills: ['إدارة حسابات', 'تواصل عملاء'], specializations: ['التقنية', 'العقارات'], availabilityStatus: 'available', isActive: true },
  { name: 'سارة الشهري', email: 'sara@treeelivine.com', phone: '0502222222', internalRole: 'task_member', skills: ['تصميم جرافيك', 'موشن جرافيك'], specializations: ['الأزياء', 'التجميل'], availabilityStatus: 'busy', isActive: true },
  { name: 'محمد العتيبي', email: 'mohammed@treeelivine.com', phone: '0503333333', internalRole: 'task_member', skills: ['كتابة محتوى', 'SEO'], specializations: ['التقنية', 'التعليم'], availabilityStatus: 'available', isActive: true },
  { name: 'نورة القحطاني', email: 'noura@treeelivine.com', phone: '0504444444', internalRole: 'account_manager', skills: ['إدارة مشاريع', 'استراتيجية'], specializations: ['الأغذية', 'التجزئة'], availabilityStatus: 'available', isActive: true },
]

export const demoProjects = [
  { name: 'حملة التواصل الاجتماعي - النجوم', projectType: 'subscription', status: 'active', workflowMode: 'manual', estimatedCost: 15000, taxRate: 15, billable: true },
  { name: 'هوية الريادة البصرية', projectType: 'onetime', status: 'active', workflowMode: 'sequential', estimatedCost: 8000, taxRate: 15, billable: true },
  { name: 'استراتيجية المستقبل الرقمي 2025', projectType: 'subscription', status: 'active', workflowMode: 'manual', estimatedCost: 22000, taxRate: 15, billable: true },
  { name: 'حملة رمضان - مجموعة الإبداع', projectType: 'onetime', status: 'on_hold', workflowMode: 'manual', estimatedCost: 12000, taxRate: 15, billable: true },
]

export const demoDashboard = {
  activeCustomers: 3,
  activeProjects: 3,
  openTasks: 12,
  overdueTasks: 2,
  collected: 87500,
  unpaidAmt: 34750,
  totalExpenses: 42000,
  net: 45500,
  unpaidInvoices: 3,
}
