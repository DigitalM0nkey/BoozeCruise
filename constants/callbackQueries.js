const Product = require("../models/product")
var moment = require("moment");


module.exports = (ship, data) => {
  if (data.action === "BUY") {
    Product.findOne({ _id: data.product })
      .then(product => {
        ship.products.push({
          product: product._id,
          expiry: moment().add(product.expiry, "days")
        })
        ship.save();
        product.quantity--;
        product.save();
      })
    // } else if (something) {
  }
};