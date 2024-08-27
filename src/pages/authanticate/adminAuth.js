const Register = require("../../modals/registerSchema");
const jwt = require("jsonwebtoken");

const adminAuth = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).send({
                success:false,
                message:"user not authanticate,token not provided"
            })
        };

        const verifyUser = jwt.verify(token,process.env.JWT_SECRET);
        if(!verifyUser || !verifyUser._id){
            return res.status(401).send({
                success:false,
                message:"invalid token,user not found"
            })
        };
        const user = await Register.findById(verifyUser._id);
        if(!user){
            return res.status(500).send({
                success:false,
                message:"user not found"
            })
        };
        if(!user.isAdmin){
            return res.status(500).send({
                success:false,
                message:"User does not have admin privileges!"
            })
        };
        next();
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"User does not have admin privileges!"
        })
    }
}

module.exports = adminAuth;