const Register = require("../../modals/registerSchema");
const jwt = require("jsonwebtoken");

const jwtAuth = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "JWT token is missing",
            });
        }
        
        const jwtToken = token.replace("Bearer","").trim();
        //verify user
        const verifyUser = jwt.verify(jwtToken, process.env.JWT_SECRET);
        
        const user = await Register.findOne({ _id: verifyUser._id });
        
        if (!user) {
            return res.status(500).send({
                success: false,
                message: "user not found",
            });
        }
        
        req.token = token;
        req.user = user;
        req.userid = user._id;
        
        next();
    } catch (error) {
        // Handle the error and send an appropriate response
        res.status(400).send({
            success: false,
            message: "user not authenticate, please login",
            error: error.message,
        });
    }
};

module.exports = jwtAuth;