const mongoose = require("mongoose");

const oclRangeSchema = new mongoose.Schema({
    oclRange:{type:String},
    oclPinCode:{type:Number},
    price:{type:Number}
},{timestamps:true});

const OclRange = mongoose.model("OclRange",oclRangeSchema);

module.exports = OclRange;