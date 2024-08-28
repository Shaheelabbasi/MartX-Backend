const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shippingSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String }
  },
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered'], default: 'Processing' },
  trackingNumber: { type: String },

},{timestamps:true});

const Shipping = mongoose.model('Shipping', shippingSchema);
module.exports = Shipping;
