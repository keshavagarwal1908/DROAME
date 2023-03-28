const mongoose = require("mongoose"); //IMPORTING THE MONGOOSE ODM SO THAT WE CAN INTERACT WITH OUR DATABASE USING JAVASCRIPT OBJECT
const Schema = mongoose.Schema;
const DroneSchema = new Schema({
  //defining the schema for customer
  name: String,
  type: String,
  location: String,
  date: String,
  image: String,
  price: Number,
  customers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
  ],
});
const Drone = mongoose.model("Drone", DroneSchema);
module.exports = Drone;
