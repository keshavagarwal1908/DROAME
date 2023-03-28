if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express"); //IMPORTING THE EXPRESS LIBRARAY FRAMEWORK THAT WE INSTALLED USING NPM.
const mongoose = require("mongoose"); //IMPORTING THE MONGOOSE ODM LIBRARY SO THAT WE CAN CONNECT OUR DATABASE USING JAVASCRIPT
const app = express(); //executing the express library that we imported.
const path = require("path"); //requiring the path of this project in this computer
const Drone = require("./models/droneschema");
const Customer = require("./models/customerSchema");
const methodOverride = require("method-override"); //TO ENABLE PUT OR PATCH REQUEST THROUGH FORMS
const ejsMate = require("ejs-mate");
const dbUrl = process.env.DB_URL;
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/DROAME", {
    //useNewUrlParser: true,
    // useCreateIndex: true,
    ////// useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR!!!!");
    console.log(err);
  });
app.engine("ejs", ejsMate);
app.set("view engine", "ejs"); //SETTING UP THE VIEWS ENGINE TO EJS SO THAT IN THE VIEWS DIRECTORY WE CAN RENDER EJS FILE IN THE RESPONSE TO A PARTICULAR REQUEST
app.set("views", path.join(__dirname, "views")); //now the views can be accessed outside the folder
app.get("/", (req, res) => {
  res.render("home");
});
app.use(express.urlencoded({ extended: true })); //parsing the req.body
app.use(methodOverride("_method")); //MIDDLEWARE TO ENABLE METHODOVERIDE SO THAT PUT AND PATCH REQUEST CAN BE ENABLED..
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
//CRUD FUNCTIONALITY FOR CUSTOMERS AND BOOKING OF DRONES...............
app.get("/drones", async (req, res) => {
  //CREATING A GET ROUTE FOR MAKING HTTP GET REQUEST FOR RENDERING INDEX PAGE..
  const drones = await Drone.find({}); //FINDING IN DATABASE
  res.render("drone/index", { drones }); //RENDERING A INDEX PAGE FOR DISPLAYING ALL BOOKING
});
app.get("/drones/new", (req, res) => {
  res.render("drone/new");
});
app.post("/drones", async (req, res) => {
  const drone = new Drone(req.body.drone);
  await drone.save();
  res.redirect(`/drones/${drone._id}`);
});
app.get("/drones/:id", async (req, res) => {
  const drone = await Drone.findById(req.params.id).populate("customers");
  res.render("drone/show", { drone });
});
app.get("/drones/:id/edit", async (req, res) => {
  const drone = await Drone.findById(req.params.id);
  res.render("drone/edit", { drone });
});
app.put("/drones/:id", async (req, res) => {
  const { id } = req.params;
  const drone = await Drone.findByIdAndUpdate(id, {
    ...req.body.drone,
  });
  res.redirect(`/drones/${drone._id}`);
});
app.delete("/drones/:id", async (req, res) => {
  const { id } = req.params;
  await Drone.findByIdAndDelete(id);
  res.redirect("/drones");
});

// CRUD FUNCTIONALITY FOR CUSTOMERS AND BOOKINGS
app.get("/drones/:id/customers/new", async (req, res) => {
  const drone = await Drone.findById(req.params.id);
  res.render("customer/new", { drone });
});
app.post("/drones/:id/customers", async (req, res) => {
  const drone = await Drone.findById(req.params.id);
  const customer = new Customer(req.body.customer);
  drone.customers.push(customer);
  await drone.save();
  await customer.save();
  res.redirect(`/drones/${drone._id}`);
});
app.get("/drones/:id/customers/:customerid/edit", async (req, res) => {
  const { id, customerid } = req.params;
  const drone = await Drone.findById(id);
  const customer = await Customer.findById(customerid);
  res.render("customer/edit", { customer, drone });
});
app.put("/drones/:id/customers/:customerid", async (req, res) => {
  const { id, customerid } = req.params;
  await Drone.findByIdAndUpdate(id, {
    $pull: { customers: customerid },
  });
  await Customer.findByIdAndUpdate({
    id,
    ...req.body.customer,
  });
  const customer = await Customer.findById(customerid);
  const drone = await Drone.findById(id);

  drone.customers.push(customer);
  await drone.save();
  await customer.save();
  res.redirect(`/drones/${drone._id}`);
});
app.delete("/drones/:id/customers/:customer_id", async (req, res) => {
  const { id, customer_id } = req.params;
  await Drone.findByIdAndUpdate(id, { $pull: { customers: customer_id } });
  await Customer.findByIdAndDelete(customer_id);
  res.redirect(`/drones/${id}`);
});
app.listen(3000, () => {
  console.log("SERVING ON PORT 3000"); //SETTING UP A SERVER ON OUR LOCAL MACHINE
});
