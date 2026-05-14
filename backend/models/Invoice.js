const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    subtotalOriginal: { type: Number, default: 0 },
    subtotalBase: { type: Number, default: 0 },
    currency: { type: String, default: 'SAR' },
    currencyCode: { type: String, default: 'SAR' },
    exchangeRateToBase: { type: Number, default: 1 },
    amountBase: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    taxAmountOriginal: { type: Number, default: 0 },
    taxAmountBase: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'issued', 'paid', 'overdue', 'cancelled', 'unpaid', 'partially_paid'],
      default: 'draft',
    },
    paidAmountBase: { type: Number, default: 0 },
    remainingAmountBase: { type: Number, default: 0 },
    issueDate: { type: Date },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

invoiceSchema.pre('save', function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = 'INV-' + Date.now();
  }
  this.taxAmountOriginal = (this.subtotalOriginal || 0) * ((this.taxRate || 0) / 100);
  this.taxAmountBase = (this.subtotalBase || 0) * ((this.taxRate || 0) / 100);
  this.amountBase = (this.subtotalBase || 0) + this.taxAmountBase;
  this.remainingAmountBase = this.amountBase - (this.paidAmountBase || 0);
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
