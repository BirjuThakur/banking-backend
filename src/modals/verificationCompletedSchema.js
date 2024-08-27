const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const verificationCompletedSchema = new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    phoneNmuber:{type:Number},
    pincodes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PinCode'
    },
    address:{
        mainAddress:{type:String},
        landmark:{type:String},
        pincode:{type:Number},
        area:{type:String},
        districtorstate:{type:String}
    },
    contactInformation:{
        officeContact:{type:Number},
        personalContact:{type:Number},
        officeEmail:{type:String},
        personalEmail:{type:String}
    },
    dateOfBirth:{type:String},
    addharNumber:{type:Number},
    panNumber:{type:String},
    drivingLicense:{type:String},
    isAdmin: {
        type: Boolean,
        default: false
    },
    password: {type: String},
    otp: {type: Number},
    token: {type: String},
    cases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewCase'
    }]
});

//password hashing 
verificationCompletedSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next();
})

//creating jasonwebtoken
verificationCompletedSchema.methods.generateToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        this.token = token;
        await this.save();
        return token;
    } catch (error) {
        console.error('Error in token creation:', error);
        return undefined;
    }
}

const VerificationCompleted = mongoose.model("VerificationCompleted",verificationCompletedSchema);

module.exports = VerificationCompleted;
