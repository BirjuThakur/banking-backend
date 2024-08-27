const Register = require("../modals/registerSchema");
const bcrypt = require("bcrypt");

//signin route
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await Register.findOne({ email });

        if (!userData) {
            return res.status(404).send({
                success: false,
                message: "user not found"
            })
        };
        if (userData.isVerified === false) {
            return res.status(401).send({
                success: false,
                message: "user not verified with mail"
            })
        }
        const IsMatch = await bcrypt.compare(password, userData.password);

        if (IsMatch) {
            if (userData.isAdmin === true) {
                const token = await userData.generateToken();
                //for cookie storing
                res.cookie("jwt", token, {
                    expires:new Date(Date.now() + 9000000),
                    httpOnly: true,
                })
                
                return res.status(200).send({
                    success: true,
                    message: "admin login successfully",
                    userData,
                    token: token
                })
            } else {
                const token = await userData.generateToken();
                //for cookie storing
                res.cookie("jwt", token, {
                    expires:new Date(Date.now() + 9000000),
                    httpOnly: true,
                })
                
                return res.status(200).send({
                    success: true,
                    message: "user login successfully",
                    userData,
                    token: token
                })
            }
        } else {
            return res.status(400).send({
                success: false,
                message: "enter correct details"
            })
        }
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "user login failed",
            error: error.message
        })
    }
}

module.exports = signin;