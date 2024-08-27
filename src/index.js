const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000 ;
const cors = require("cors");
const adminRoutes = require("./pages/routes/adminRoutes");
const dbConnection = require("./db/dbConnection");
const registerRoutes = require("./pages/routes/registerRoutes");
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//for multer file 
app.use("/uploads/images",express.static(path.join(__dirname,"../uploads/images")));

// routes
app.use("/admin",adminRoutes);
app.use("/register",registerRoutes);

app.get("/",(req,res) =>{
    res.send("welcome to bancking software")
})

app.listen(port,()=>{
    dbConnection();
    console.log(`app is running on port ${port}`)
})