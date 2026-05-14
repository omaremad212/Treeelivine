import mongoose, { Model } from 'mongoose'

const settingSchema = new mongoose.Schema({
  companyName: { type: String, default: 'Treeelivine' },
  companyLogo: String, companyDescription: String, companyAddress: String,
  language: { type: String, default: 'ar' }, defaultLanguage: { type: String, default: 'ar' },
  enabledLanguages: { type: [String], default: ['ar','en'] },
  theme: { type: String, default: 'dark' }, customColorsEnabled: Boolean,
  primaryColor: { type: String, default: '#c8a96e' },
  defaultCurrency: { type: String, default: 'SAR' },
  defaultTaxRate: { type: Number, default: 15 },
  baseCurrency: { type: String, default: 'SAR' },
  currencies: {
    type: [{ code: String, name: String, rate: Number }],
    default: [{ code: 'SAR', name: 'Saudi Riyal', rate: 1 }, { code: 'USD', name: 'US Dollar', rate: 3.75 }],
  },
  enabledCurrencies: { type: [{ code: String, name: String, symbol: String }], default: [{ code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س' }] },
  exchangeRates: { type: Map, of: Number, default: { SAR: 1 } },
  demoMode: { type: Boolean, default: false },
  customSpecializations: [String],
  permissions: {
    type: [{ key: String, label: String, description: String }],
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
    type: [{ role: String, label: String, permissions: [String] }],
    default: [
      { role: 'admin', label: 'Admin', permissions: ['crm.read','crm.write','projects.read','projects.write','tasks.read','tasks.write','tasks.handover','finance.read','finance.write','team.read','team.write','settings.read','settings.write','templates.read','templates.write','brief.read','brief.write'] },
      { role: 'manager', label: 'Manager', permissions: ['crm.read','crm.write','projects.read','projects.write','tasks.read','tasks.write','tasks.handover','team.read','templates.read','brief.read','brief.write'] },
      { role: 'team', label: 'Team', permissions: ['projects.read','tasks.read','tasks.write','tasks.handover','brief.read','brief.write'] },
      { role: 'finance', label: 'Finance', permissions: ['finance.read','finance.write','projects.read','tasks.read'] },
      { role: 'viewer', label: 'Viewer', permissions: ['crm.read','projects.read','tasks.read'] },
      { role: 'client', label: 'Client', permissions: ['brief.read','brief.write'] },
    ],
  },
  userPermissionOverrides: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, permissions: [String], deniedPermissions: [String] }],
  auditTrail: [{ action: String, performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, details: mongoose.Schema.Types.Mixed, timestamp: { type: Date, default: Date.now } }],
  isDemo: Boolean,
}, { timestamps: true })

settingSchema.statics.getOrCreate = async function() {
  let doc = await this.findOne({})
  if (!doc) doc = await this.create({})
  return doc
}

interface SettingModel extends Model<any> {
  getOrCreate(): Promise<any>
}

const Setting = (mongoose.models.Setting as SettingModel) || mongoose.model<any, SettingModel>('Setting', settingSchema)
export default Setting
