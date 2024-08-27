const Register = require("../modals/registerSchema");

const resetPass = async (req, res) => {
    try {
        const {userid} = req.params;
        const {otp,newpass,confirmPassword} = req.body;
        
        if (!otp || !newpass || !confirmPassword) {
            return res.status(400).send({
                success: false,
                message: "OTP, new password, and confirm password are required"
            });
        }
        
        const user = await Register.findOne({_id: userid});
        
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        // Check if the provided OTP matches the OTP stored in the user document
        if(user.otp && user.otp.toString() !== otp.toString()){
            return res.status(401).send({
                success:false,
                message:"invalid otp"
            })
        }
        //reset otp
        user.otp = null ;
        user.password = newpass;
        if(confirmPassword !== newpass){
            return res.status(400).send({
                success:false,
                message:"password not matching"
            })
        }
        await user.save();
        res.status(201).send({
            success:true,
            message:"user password change successfully",
            otp,
            newpass,
            confirmPassword
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "user not registered",
            error
        })
    }
}

module.exports = resetPass;