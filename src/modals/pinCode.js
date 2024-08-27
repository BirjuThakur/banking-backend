const mongoose = require('mongoose');

const pinCodeSchema = new mongoose.Schema({
    pincode:{
        type:Number
    }
},{timestamps:true});

const PinCode = mongoose.model("PinCode",pinCodeSchema);

module.exports = PinCode;