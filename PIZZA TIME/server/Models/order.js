const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
 
  method: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  crust: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    required: true,
  },
  toppings: [
    {
      name: String,
      size: String,
      price: Number,
    },
  ],
  basePrice: {
    type: Number,
    
  },
  fee: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default:false,
  },
  
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
