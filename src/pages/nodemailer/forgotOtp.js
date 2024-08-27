const nodemailer = require("nodemailer");

const forgotOtp = async (email,emailText)=>{
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_SECRET
            }
        });

        let details = {
            from: process.env.EMAIL,
            to: email,
            subject: " otp for password-reset ",
            html: `<h1>your otp is for reset password : <span style="color: black;"> ${emailText} </span> </h1>`
        }

        await transporter.sendMail(details, (err) => {
            if (err) {
                console.log("error in " + err)
            } else {
                console.log("mail send successfully")
            }
        })
        
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = forgotOtp;