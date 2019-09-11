var db = require('../db');
var Product = db.model('Product', {
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: false
  },
  rarity: {
    type: Number,
    required: false
  },
  expiry: {
    type: Date,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  available: {
    type: Boolean,
    required: true,
    default: true
  },
});

module.exports = Product;