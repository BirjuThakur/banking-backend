const mongoose = require("mongoose");

const ClientNameSchema = new mongoose.Schema({
clientName:{type:String},
count: { type: Number, default: 0 },
},{timestamps:true});

const ClientName = mongoose.model("ClientName",ClientNameSchema);

module.exports = ClientName;