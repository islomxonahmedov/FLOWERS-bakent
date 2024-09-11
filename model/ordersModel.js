const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'auth',
    required: true,
  },
  items: [
    {
      flower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'flowers',
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
    },
  ],
  phoneNumber: {
    type: String,
    required: true,
    set: (value) => {
      // Automatically prepend +998 if not present
      return value.startsWith('+998') ? value : `+998${value}`;
    },
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  orderNumber: {
    type: Number,
    unique: true,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
