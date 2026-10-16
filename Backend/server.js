// ================= SERVER START MESSAGE =================
require("dotenv").config();
console.log("SERVER FILE LOADED");


// ================= IMPORT PACKAGES =================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PDFDocument = require("pdfkit");

// ================= CREATE APP =================

const app = express();


// ================= MIDDLEWARE =================

// Allow frontend to connect to backend
app.use(cors());

// Allow JSON data in requests
app.use(express.json());


// ================= MONGODB CONNECTION =================

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

 
// mongoose.connect("mongodb+srv://Ome26:YGtrend@cluster0.46k16u0.mongodb.net/ygtrends")

// .then(() => console.log("MongoDB Connected"))

// .catch(err => console.log(err));

// mongoose.connect("mongodb+srv://Ome26:light26@cluster0.46k16u0.mongodb.net/ygtrends")
//     .then(() => console.log("MongoDB Connected"))
//     .catch(err => console.log("MongoDB connection error:", err));


// ================= TEST ROUTES =================

// Test if backend server is running
app.get("/", (req,res)=>{
res.send("YG Trends Backend Running");
});

// Extra test route
app.get("/test",(req,res)=>{
res.send("Test route working");
});


// ========================================================
// ================= READYM ADE ORDER SCHEMA ==============
// ========================================================

const OrderSchema = new mongoose.Schema({
userId:String, 
name:String,
mobile:String,
product:String,
price:String,
size:String,
image:String,
address:String,
rating: Number,
feedback: String,
status:{ type:String, default:"Pending" },
stock: { type: Number, default: 10 },
replaceStatus: { type: String, default: "None" },
replaceReason: String
});


// Create MongoDB collection
const Order = mongoose.model("Order", OrderSchema);

// ================= MY ORDERS (USER) =================

app.get("/my-orders/:userId", async(req,res)=>{

const orders = await Order.find({
userId: req.params.userId
});

res.json(orders);

});



// ================= SAVE ORDER =================

app.post("/order", async(req,res)=>{

const order = new Order(req.body);

await order.save();

res.send("Order saved");

});


// ================= GET ALL ORDERS =================

// app.get("/orders", async(req,res)=>{

// const orders = await Order.find();

// res.json(orders);

// });
app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        console.error("Orders API Error:", err);
        res.status(500).json({ error: err.message });
    }
});
// ================= CANCEL ORDER =================



app.delete("/cancel-order/:id", async (req,res)=>{

try{

console.log("Deleting from DB:", req.params.id);

const id = new mongoose.Types.ObjectId(req.params.id);

const deleted = await Order.findByIdAndDelete(id);

console.log("Deleted:", deleted);

res.json({success:true});

}catch(err){

console.log(err);
res.json({success:false});

}

});


// ================= UPDATE ORDER STATUS =================
app.put("/update-order-status/:id", async (req, res) => {

try {

const { status } = req.body;

// find order first
const order = await Order.findById(req.params.id);

if(!order){
return res.status(404).json({ error: "Order not found" });
}

// 🟢 If Delivered → reduce stock
if(status === "Delivered"){

let newStock = (order.stock || 0) - 1;

if(newStock < 0) newStock = 0;

// update all same products
await Order.updateMany(
{ product: order.product },
{ stock: newStock }
);

}

// update status
const updated = await Order.findByIdAndUpdate(
req.params.id,
{ status: status },
{ new: true }
);

res.json(updated);

} catch (err) {
console.log("ERROR:", err);
res.status(500).json({ error: "Update failed" });
}

});

// ================= UPDATE STOCK =================

app.put("/update-stock/:id", async (req,res)=>{

try{

// find clicked order first
const order = await Order.findById(req.params.id);

if(!order){
return res.status(404).json({ error: "Order not found" });
}

// update ALL same products
await Order.updateMany(
{ product: order.product },
{ stock: req.body.stock }
);

res.json({ message: "Stock updated for all same products" });

}catch(err){
console.log(err);
res.status(500).json({ error: "Update failed" });
}

});
// ========================================================
// ================= STITCHING BOOKING SCHEMA =============
// ========================================================

const StitchSchema = new mongoose.Schema({

userId:String,   // ⭐ ADD THIS

name:String,
mobile:String,
address:String,
clothType:String,
measurementDate:String,
time:String,
visitType:String,

status:{ type:String, default:"Pending" },  // ⭐ ADD
tailor:String,   // ⭐ ADD

chest:String,
waist:String,
length:String,
sleeve:String,
shoulder:String,
thigh:String

});

const Stitch = mongoose.model("stitch", StitchSchema);


// ================= SAVE STITCH BOOKING =================

app.post("/stitch", async(req,res)=>{

const booking = new Stitch(req.body);

await booking.save();

res.send("Stitch booking saved");

});

// ================= USER SCHEMA =================

const UserSchema = new mongoose.Schema({
name:String,
email:String,
password:String
});

const User = mongoose.model("User", UserSchema);

// ================= REGISTER USER =================

app.post("/register", async (req,res)=>{

const user = new User(req.body);

await user.save();

res.json({message:"User registered"});

});

// ================= LOGIN USER =================

app.post("/login", async (req,res)=>{

const user = await User.findOne({
email: req.body.email,
password: req.body.password
});

if(user){
res.json({success:true, user:user});
}else{
res.json({success:false});
}

});

// ================= ADMIN LOGIN =================

app.post("/admin-login", (req, res) => {

const { username, password } = req.body;

if(username === "admin" && password === "1234"){
  res.json({ success: true });
}else{
  res.json({ success: false });
}

});

// ========================================================
// ================= START SERVER =========================
// ========================================================
// ================= GET ALL STITCH (ADMIN) =================

app.get("/all-stitch", async(req,res)=>{

try{

const data = await Stitch.find();

res.json(data);

}catch(err){
console.log(err);
res.json([]);
}

});
//ASSIGN TAILOR
app.put("/assign-tailor/:id", async (req,res)=>{

console.log("ID:", req.params.id);
console.log("TAILOR:", req.body.tailor);

const updated = await Stitch.findByIdAndUpdate(
req.params.id,
{
tailor: req.body.tailor,
status: "Assigned"
},
{ new:true }
);

console.log("UPDATED:", updated);

res.json(updated);

});

// ================= ADD MEASUREMENT =================

app.put("/add-measurement/:id", async (req,res)=>{

console.log("BODY RECEIVED:", req.body);

let updateData = {
  status: "Measured"
};

// ✅ Only add fields that exist
if(req.body.chest) updateData.chest = req.body.chest;
if(req.body.waist) updateData.waist = req.body.waist;
if(req.body.length) updateData.length = req.body.length;
if(req.body.sleeve) updateData.sleeve = req.body.sleeve;
if(req.body.shoulder) updateData.shoulder = req.body.shoulder;
if(req.body.thigh) updateData.thigh = req.body.thigh;

const updated = await Stitch.findByIdAndUpdate(
  req.params.id,
  updateData,
  { new:true }
);

res.json(updated);

});

//stitch in my order
app.get("/my-stitch/:userId", async(req,res)=>{

try{

const data = await Stitch.find({
userId: req.params.userId
});

res.json(data);

}catch(err){
console.log(err);
res.json([]);
}

});

// REQUEST REPLACEMENT
app.put("/request-replace/:id", async (req,res)=>{

const updated = await Order.findByIdAndUpdate(
req.params.id,
{
replaceStatus: "Requested",
replaceReason: req.body.reason
},
{ new:true }
);

res.json(updated);

});

// APPROVE REPLACEMENT
app.put("/approve-replace/:id", async (req,res)=>{

const updated = await Order.findByIdAndUpdate(
req.params.id,
{
replaceStatus: "Approved"
},
{ new:true }
);

res.json(updated);

});

app.get("/sales-report", async (req, res) => {

const orders = await Order.find();

let totalOrders = orders.length;

let processing = orders.filter(o => o.status === "Processing").length;
let shipped = orders.filter(o => o.status === "Shipped").length;
let outForDelivery = orders.filter(o => o.status === "Out For Delivery").length;
let delivered = orders.filter(o => o.status === "Delivered").length;

let revenue = 0;

orders.forEach(order => {

let price = parseInt(
String(order.price).replace(/[^\d]/g, "")
);

if(!isNaN(price)){
revenue += price;
}

});

const doc = new PDFDocument();

res.setHeader(
"Content-Disposition",
'attachment; filename="YG-Trends-Sales-Report.pdf"'
);

res.setHeader(
"Content-Type",
"application/pdf"
);

doc.pipe(res);

doc.fontSize(24)
.text("YG TRENDS", {
align: "center"
});

doc.fontSize(18)
.text("SALES REPORT", {
align: "center"
});

doc.moveDown();

doc.text("=================================", {
align: "center"
});

doc.moveDown();

doc.fontSize(12);

doc.text(
"Generated On: " +
new Date().toLocaleDateString("en-GB")
);

doc.moveDown();

doc.fontSize(16)
.text("SUMMARY");

doc.moveDown(0.5);

doc.fontSize(12);

doc.text("Total Orders           : " + totalOrders);
doc.text("Delivered Orders       : " + delivered);
doc.text("Processing Orders      : " + processing);
doc.text("Shipped Orders         : " + shipped);
doc.text("Out For Delivery       : " + outForDelivery);

doc.moveDown();

doc.text("---------------------------------");

doc.moveDown();

doc.fontSize(16)
.text("TOTAL REVENUE");

doc.moveDown(0.5);

doc.fontSize(18)
.text("Rs. " + revenue.toLocaleString());

doc.moveDown();

doc.text("---------------------------------");

doc.moveDown();


// TOP SELLING PRODUCTS
let productCount = {};

orders.forEach(order => {

if(!productCount[order.product]){
productCount[order.product] = 0;
}

productCount[order.product]++;

});

let topProducts = Object.entries(productCount)
.sort((a,b) => b[1] - a[1])
.slice(0,3);

doc.fontSize(16)
.text("TOP SELLING PRODUCTS");

doc.moveDown(0.5);

topProducts.forEach((item,index)=>{

doc.fontSize(12)
.text(
(index + 1) + ". " + item[0]
);

});

doc.moveDown();

doc.text("---------------------------------");

doc.moveDown();

doc.fontSize(12)
.text("Prepared By:");

doc.text("YG Trends Admin");

doc.moveDown();

doc.text("=================================", {
align: "center"
});

doc.end();

});


app.get("/invoice/:id", async (req, res) => {

const order = await Order.findById(req.params.id);

if(!order){
return res.status(404).send("Order not found");
}

const doc = new PDFDocument();

res.setHeader(
"Content-Disposition",
`attachment; filename=Invoice-${order._id}.pdf`
);

res.setHeader(
"Content-Type",
"application/pdf"
);

doc.pipe(res);

// COMPANY NAME
doc.fontSize(24)
.text("YG TRENDS", {
align: "center"
});

doc.fontSize(12)
.text("Clothing & Stitching System", {
align: "center"
});

doc.moveDown();

doc.text("==================================", {
align: "center"
});

doc.moveDown();

// INVOICE INFO
doc.fontSize(12);

doc.text("Invoice No: INV-" + order._id.toString().slice(-4));

doc.text(
"Date: " +
new Date().toLocaleDateString("en-GB")
);

doc.moveDown();

// CUSTOMER DETAILS
doc.fontSize(14)
.text("CUSTOMER DETAILS");

doc.moveDown(0.5);

doc.fontSize(12);
doc.text("Name      : " + order.name);
doc.text("Mobile    : " + order.mobile);
doc.text("Address   : " + order.address);

doc.moveDown();

doc.text("----------------------------------");

doc.moveDown();

// PRODUCT DETAILS
doc.fontSize(14)
.text("PRODUCT DETAILS");

doc.moveDown(0.5);

doc.fontSize(12);
doc.text("Product   : " + order.product);
doc.text("Size      : " + order.size);
doc.text("Status    : " + order.status);
let amount = String(order.price).replace(/[^\d]/g, "");

doc.text("Price     : Rs. " + amount);

doc.moveDown();

doc.text("----------------------------------");

doc.moveDown();

// TOTAL
doc.fontSize(16)
.text(
"TOTAL AMOUNT : Rs. " + amount
);

doc.moveDown();

doc.text("----------------------------------");

doc.moveDown(2);

// FOOTER
doc.fontSize(12)
.text(
"Thank You For Shopping With Us",
{
align: "center"
}
);

doc.moveDown();

doc.text(
"Visit Again!",
{
align: "center"
}
);

doc.end();

});

app.get("/stitch-receipt/:id", async (req,res)=>{

const stitch = await Stitch.findById(req.params.id);

if(!stitch){
return res.status(404).send("Booking not found");
}

const doc = new PDFDocument();

res.setHeader(
"Content-Disposition",
`attachment; filename=Stitch-Receipt-${stitch._id}.pdf`
);

res.setHeader(
"Content-Type",
"application/pdf"
);

doc.pipe(res);

doc.fontSize(24)
.text("YG TRENDS", {
align:"center"
});

doc.fontSize(18)
.text("STITCHING RECEIPT", {
align:"center"
});

doc.moveDown();

doc.text("=================================",{
align:"center"
});

doc.moveDown();

doc.fontSize(12);

doc.text(
"Receipt No: STR-" +
stitch._id.toString().slice(-4)
);

doc.text(
"Date: " +
new Date().toLocaleDateString("en-GB")
);

doc.moveDown();

doc.fontSize(16)
.text("CUSTOMER DETAILS");

doc.moveDown(0.5);

doc.fontSize(12);

doc.text("Name      : " + stitch.name);
doc.text("Mobile    : " + stitch.mobile);
doc.text("Address   : " + stitch.address);

doc.moveDown();

doc.text("---------------------------------");

doc.moveDown();

doc.fontSize(16)
.text("STITCH DETAILS");

doc.moveDown(0.5);

doc.fontSize(12);

doc.text("Cloth Type : " + stitch.clothType);
doc.text("Status     : " + stitch.status);
doc.text("Tailor     : " + (stitch.tailor || "Not Assigned"));
doc.text("Date       : " + stitch.measurementDate);

doc.moveDown();

doc.text("---------------------------------");

doc.moveDown();

doc.fontSize(16)
.text("MEASUREMENTS");

doc.moveDown(0.5);

if(stitch.chest) doc.text("Chest      : " + stitch.chest);
if(stitch.waist) doc.text("Waist      : " + stitch.waist);
if(stitch.length) doc.text("Length     : " + stitch.length);
if(stitch.sleeve) doc.text("Sleeve     : " + stitch.sleeve);
if(stitch.shoulder) doc.text("Shoulder   : " + stitch.shoulder);
if(stitch.thigh) doc.text("Thigh      : " + stitch.thigh);

doc.moveDown();

doc.text("---------------------------------");

doc.moveDown();

doc.text(
"Thank You For Choosing YG Trends",
{
align:"center"
}
);

doc.end();

});

app.get("/dashboard-stats", async (req,res)=>{

const totalUsers = await User.countDocuments();

const totalOrders = await Order.countDocuments();

const totalStitch = await Stitch.countDocuments();

const orders = await Order.find();

let revenue = 0;

orders.forEach(order => {

let price = parseInt(
String(order.price).replace(/[^\d]/g,"")
);

if(!isNaN(price)){
revenue += price;
}

});

const replacementRequests =
await Order.countDocuments({
replaceStatus:"Requested"
});

res.json({
users: totalUsers,
orders: totalOrders,
stitch: totalStitch,
revenue: revenue,
replacement: replacementRequests
});

});

app.put("/update-stitch-status/:id", async(req,res)=>{

console.log("UPDATE STITCH STATUS HIT");
console.log("ID:", req.params.id);
console.log("BODY:", req.body);

const updated = await Stitch.findByIdAndUpdate(
req.params.id,
{
status: req.body.status
},
{ new:true }
);

console.log("UPDATED:", updated);

res.json(updated);

});


app.put("/add-feedback/:id", async (req,res)=>{

const updated = await Order.findByIdAndUpdate(
req.params.id,
{
rating: req.body.rating,
feedback: req.body.feedback
},
{ new:true }
);

res.json(updated);

});

app.get("/test-delivered", (req,res)=>{
res.send("Delivered Route Working");
});

app.listen(5000,()=>{

console.log("Server running on port 5000");

});
