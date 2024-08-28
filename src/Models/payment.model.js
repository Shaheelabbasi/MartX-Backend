const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Credit Card', 'PayPal', 'Stripe'], required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  transactionId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
