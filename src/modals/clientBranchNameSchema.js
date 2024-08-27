const mongoose = require("mongoose");

const ClientBranchNameSchema = new mongoose.Schema({
    clientBranchName:{type:String}
},{timestamps:true});

const ClientBranchName = mongoose.model("ClientBranchName",ClientBranchNameSchema);

module.exports = ClientBranchName;