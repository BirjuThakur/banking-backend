const Register = require("../modals/registerSchema");
const forgotOtp = require("../pages/nodemailer/forgotOtp");


//generate otp 
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000)
}

const forgotPass = async(req,res) =>{
try {
    const {email} = req.body;
    const user = await Register.findOne({email});
    const otp = generateOTP();
    // save otp
    user.otp = otp;
    await user.save();
    // send otp via mail 
    const emailText = `${otp}`;
    await forgotOtp(email, emailText);

    res.status(200).send({
        success: true,
        message: "otp send on your mail, please check your mail",
        userid: user._id
    });

} catch (error) {
     res.status(500).send({
        success: false,
        message: "user not registered",
        error:error.message
    })
}
}

module.exports = forgotPass;