const PendingUserCreate = require("../modals/pendingUserCreateSchema");

const getSingleUserPending = async (req, res) => {
    try {
        const { userid } = req.params;
        const singleUser = await PendingUserCreate.findById(userid).populate('pincodes').populate({
            path: 'cases',
            populate:[
                { path: 'clientName' }, 
                { path: 'clientBranchName' },
                { path: 'oclRange' }
            ]  
        });
// Calculate cases count for the single user
const casesCount = singleUser.cases.length;

        res.status(200).send({
            success: true,
            message: 'user registered successfull',
            singleUser,
            casesCount
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'error getting in registration',
            error: error.message
        })
    }
};

const allUserPending = async (req, res) => {
    try {
        const allUser = await PendingUserCreate.find().populate('pincodes').populate({
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
                ...user.toObject(),
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

const updateUserPending = async (req, res) => {
    try {
        const registerUser = req.body;
        const { userid } = req.params;
        
        const updateRegisteredUser = await PendingUserCreate.findByIdAndUpdate(userid, registerUser, {
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

const deleteUserPending = async (req, res) => {
    try {
        const { userid } = req.params;
        const deleteRegisteredUser = await PendingUserCreate.findByIdAndDelete(userid).populate('pincodes');
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
    getSingleUserPending,
    allUserPending,
    updateUserPending,
    deleteUserPending
}