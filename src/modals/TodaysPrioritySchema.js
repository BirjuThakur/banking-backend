const mongoose = require("mongoose");

const ClientName = require("./ClientNameSchema");
const clientBranchName = require("./clientBranchNameSchema");
const OclRange = require("./oclRangeSchema");

// creating schema for new case entry
const TodaysPrioritySchema = new mongoose.Schema({
clientName:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'ClientName'
},
clientBranchName:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'ClientBranchName'
},
activity:{type:String},
verificationType:{type:String},
product:{type:String},
fileNumber:{type:String},
oclRange:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'OclRange'
},
specialInstructions:{type:String},
propertyDetails:{type:String},
initiatorBankManagerName:{type:String},
mailInitiationDateTime:{type:String},
initiatorEmailId:{type:String},
applicantName:{type:String},
borrowerCategory:{type:String},
pinCode:{type:Number},
cityTalukaDistrictState:{type:String},
address:{type:String},
residenceNumber:{type:String},
officeNumber:{type:String},
mobileNumber:{type:String},
company:{type:String},
borrowerOccupationCategory:{type:String},
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Register',
},
},{timestamps:true});

const TodaysPriority = mongoose.model("TodaysPriority",TodaysPrioritySchema);

module.exports = TodaysPriority;