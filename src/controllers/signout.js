const Register = require("../modals/registerSchema");

//signout
const signout = async (req, res) => {
    try {
        
            req.user.token = req.token;
            req.user.token = null;
            // Clear the cookie
            res.clearCookie("jwt",{path:"/"});
            
            // Save the updated user
            await req.user.save();
            
            return res.status(200).send({
                success: true,
                message: "User logout successfully",
                usertoken: req.user.token,
            });
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "User not logout",
            error: error.message,
        });
    }
};

module.exports = signout;