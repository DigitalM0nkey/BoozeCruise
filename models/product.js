var db = require('../db');
var Product = db.model('Product', {
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
    default: "This is a description"
  },
  price: {
    type: Number,
    required: true,
    default: 25
  },
  quantity: {
    type: Number,
    required: false,
    default: 5
  },
  rarity: {
    type: Number,
    required: false,
    default: 0
  },
  expiry: {
    type: Number,
    required: false,
    default: 10
  },
  type: {
    type: String,
    required: false,
    default: "Booze"
  },
  image: {
    type: String,
    required: false,
    default: "https://www.nextlevelfairs.com/assets/images/image-not-available.png"
  },
  available: {
    type: Boolean,
    required: true,
    default: true
  },
  perk: {
    name: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    operator: {
      type: String,
      required: false
    },
    amount: {
      type: Number,
      required: false
    },
  }
});

module.exports = Product;