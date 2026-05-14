const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  { key: String, label: String, description: String },
  { _id: false }
);

const roleSchema = new mongoose.Schema(
  { role: String, label: String, permissions: [String] },
  { _id: false }
);

const overrideSchema = new mongoose.Schema(
  { userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, permissions: [String], deniedPermissions: [String] },
  { _id: false }
);

const auditSchema = new mongoose.Schema(
  { action: String, performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, details: mongoose.Schema.Types.Mixed, timestamp: { type: Date, default: Date.now } },
  { _id: false }
);

const currencySchema = new mongoose.Schema(
  { code: String, name: String, symbol: String },
  { _id: false }
);

const settingSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: 'Treeelivine' },
    companyLogo: { type: String },
    companyDescription: { type: String },
    language: { type: String, default: 'ar' },
    defaultLanguage: { type: String, default: 'ar' },
    enabledLanguages: { type: [String], default: ['ar', 'en'] },
    theme: { type: String, default: 'light' },
    customColorsEnabled: { type: Boolean, default: false },
    primaryColor: { type: String, default: '#2563eb' },
    baseCurrency: { type: String, default: 'SAR' },
    enabledCurrencies: { type: [currencySchema], default: [{ code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س' }] },
    exchangeRates: { type: Map, of: Number, default: { SAR: 1 } },
    lastCurrencyUpdate: { type: Date },
    exchangeRatesLastUpdatedAt: { type: Date },
    exchangeRatesUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customSpecializations: [String],
    permissions: {
      type: [permissionSchema],
      default: [
        { key: 'dashboard.read', label: 'Dashboard Read', description: 'View dashboard' },
        { key: 'crm.read', label: 'CRM Read', description: 'View CRM' },
        { key: 'crm.write', label: 'CRM Write', description: 'Edit CRM' },
        { key: 'projects.read', label: 'Projects Read', description: 'View projects' },
        { key: 'projects.write', label: 'Projects Write', description: 'Edit projects' },
        { key: 'tasks.read', label: 'Tasks Read', description: 'View tasks' },
        { key: 'tasks.write', label: 'Tasks Write', description: 'Edit tasks' },
        { key: 'tasks.handover', label: 'Tasks Handover', description: 'Handover tasks' },
        { key: 'finance.read', label: 'Finance Read', description: 'View finance' },
        { key: 'finance.write', label: 'Finance Write', description: 'Edit finance' },
        { key: 'team.read', label: 'Team Read', description: 'View team' },
        { key: 'team.write', label: 'Team Write', description: 'Edit team' },
        { key: 'settings.read', label: 'Settings Read', description: 'View settings' },
        { key: 'settings.write', label: 'Settings Write', description: 'Edit settings' },
        { key: 'templates.read', label: 'Templates Read', description: 'View templates' },
        { key: 'templates.write', label: 'Templates Write', description: 'Edit templates' },
        { key: 'brief.read', label: 'Brief Read', description: 'View briefs' },
        { key: 'brief.write', label: 'Brief Write', description: 'Edit briefs' },
      ],
    },
    roles: {
      type: [roleSchema],
      default: [
        { role: 'admin', label: 'Admin', permissions: ['dashboard.read','crm.read','crm.write','projects.read','projects.write','tasks.read','tasks.write','tasks.handover','finance.read','finance.write','team.read','team.write','settings.read','settings.write','templates.read','templates.write','brief.read','brief.write'] },
        { role: 'manager', label: 'Manager', permissions: ['dashboard.read','crm.read','crm.write','projects.read','projects.write','tasks.read','tasks.write','tasks.handover','team.read','templates.read','brief.read','brief.write'] },
        { role: 'team', label: 'Team', permissions: ['dashboard.read','projects.read','tasks.read','tasks.write','tasks.handover','brief.read','brief.write'] },
        { role: 'finance', label: 'Finance', permissions: ['dashboard.read','finance.read','finance.write','projects.read','tasks.read'] },
        { role: 'viewer', label: 'Viewer', permissions: ['dashboard.read','crm.read','projects.read','tasks.read'] },
        { role: 'client', label: 'Client', permissions: ['brief.read','brief.write'] },
      ],
    },
    userPermissionOverrides: [overrideSchema],
    auditTrail: [auditSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
