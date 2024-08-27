const mongoose = require("mongoose");
require('dotenv').config(); 

const uri = process.env.MONGOURI;

const dbConnection = () =>{
    mongoose.connect(uri).then(()=>{console.log("database connection successful")})
    .catch(()=>{console.log("databse connection dismiss")});
}

module.exports = dbConnection;