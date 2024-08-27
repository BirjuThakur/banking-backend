const VerificationCompleted = require("../modals/verificationCompletedSchema");

const getSingleverificationcompletedUser = async (req, res) => {
    try {
        const { userid } = req.params;
        const singleUser = await VerificationCompleted.findById(userid).populate('pincodes').populate({
            path: 'cases',
            populate:[
                { path: 'clientName' }, 
                { path: 'clientBranchName' },
                { path: 'oclRange' }
            ]  
        });

        res.status(200).send({
            success: true,
            message: 'user verification complete successfull',
            singleUser
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'error getting in registration',
            error: error.message
        })
    }
};

const allVerificationCompltetedUser = async (req, res) => {
    try {
        const allUser = await VerificationCompleted.find().populate('pincodes').populate({
            path: 'cases',
            populate:[
                { path: 'clientName' }, 
                { path: 'clientBranchName' },
                { path: 'oclRange' }
            ]  
        });
        
        let totalCasesCount = 0;
        // Iterate over each user to get total cases count
        allUser.forEach(user => {
            totalCasesCount += user.cases.length;
        })
        // Iterate over each user to get cases count
        const usersWithCasesCount = await Promise.all(allUser.map(async user => {
            const casesCount = user.cases.length;
            return {
                ...user.toObject(), // Convert Mongoose document to plain JavaScript object
                casesCount
            };
        }));

        res.status(200).send({
            success: true,
            message: 'user registered successfull',
            users: usersWithCasesCount,
            totalCasesCount,
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'error getting in registration',
            error: error.message
        })
    }
};

const updateVerificationCompletedUser = async (req, res) => {
    try {
        const registerUser = req.body;
        const { userid } = req.params;
        const updateRegisteredUser = await VerificationCompleted.findByIdAndUpdate(userid, registerUser, {
            new: true
        }).populate('pincodes').populate('cases');
        res.status(200).send({
            success: true,
            message: 'user registered successfull',
            updateRegisteredUser
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'error getting in registration',
            error: error.message
        })
    }
};

const deleteVerificationCompletedUser = async (req, res) => {
    try {
        const { userid } = req.params;
        const deleteRegisteredUser = await VerificationCompleted.findByIdAndDelete(userid).populate('pincodes');
        res.status(200).send({
            success: true,
            message: 'user registered successfull',
            deleteRegisteredUser
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'error getting in registration',
            error: error.message
        })
    }
};

module.exports = {
    getSingleverificationcompletedUser,
    allVerificationCompltetedUser,
    updateVerificationCompletedUser,
    deleteVerificationCompletedUser
}