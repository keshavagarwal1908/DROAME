const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const customerSchema = new Schema({
  name: String,
  location: String,
  email: String,
  phone: String,
  bookingdate: String,
});
module.exports = mongoose.model("Customer", customerSchema);
