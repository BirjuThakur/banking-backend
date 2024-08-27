const PinCode = require("../modals/pinCode");

const createPincode = async(req,res) =>{
    try {
        const pincodeData = req.body;
        const newPincode = new PinCode(pincodeData);
        const savepincode = await newPincode.save();
        res.status(201).send({
            success:true,
            message:'pincode create successfully',
            savepincode
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:'error in pincode',
            error
        })
    }
}

const singlePincode = async(req,res) =>{
    try {
        const {userid} = req.params;
        const singlepincodeData = await PinCode.findById(userid);
        res.status(200).send({
            success:true,
            message:'pincode got successfully',
            singlepincodeData
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:'error in pincode',
            error
        })
    }
};

const allPinCodeData = async(req,res) =>{
    try {
        const allpincodes = await PinCode.find();
        res.status(200).send({
            success:true,
            message:'pincode got successfully',
            allpincodes
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:'error in pincode',
            error
        })
    }
};

const updatePincodeData = async(req,res) =>{
    try {
        const {userid} = req.params;
        const pincodeData = req.body;
        const updatepincode = await PinCode.findByIdAndUpdate(userid,pincodeData,{
            new:true
        });
        res.status(200).send({
            success:true,
            message:'pincode updated successfully',
            updatepincode
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:'error in pincode',
            error
        })
    }
};

const deletePincodeData = async(req,res) =>{
    try {
        const {userid} = req.params;
        const deletepincode = await PinCode.findByIdAndDelete(userid);
        res.status(200).send({
            success:true,
            message:'pincode deleted successfully',
            deletepincode
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:'error in pincode',
            error
        }) 
    }
};

module.exports = {
    createPincode,
    singlePincode,
    allPinCodeData,
    updatePincodeData,
    deletePincodeData
}