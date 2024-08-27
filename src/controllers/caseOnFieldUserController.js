const CaseONFieldUser = require("../modals/CaseONFieldUserSchema");

const getSingleCaseOnFieldUser = async (req, res) => {
    try {
        const { userid } = req.params;
        const singleUser = await CaseONFieldUser.findById(userid).populate('pincodes').populate({
            path: 'cases',
            populate:[
                { path: 'clientName' }, 
                { path: 'clientBranchName' },
                { path: 'oclRange' }
            ]  
        });

        res.status(200).send({
            success: true,
            message: 'user registered successfull',
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

const allCaseOnFieldUser = async (req, res) => {
    try {
        const allUser = await CaseONFieldUser.find().populate('pincodes').populate({
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

const updateCaseOnFieldUser = async (req, res) => {
    try {
        const registerUser = req.body;
        const { userid } = req.params;
        const updateRegisteredUser = await CaseONFieldUser.findByIdAndUpdate(userid, registerUser, {
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

const deleteCaseOnFieldUser = async (req, res) => {
    try {
        const { userid } = req.params;
        const deleteRegisteredUser = await CaseONFieldUser.findByIdAndDelete(userid).populate('pincodes');
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
    getSingleCaseOnFieldUser,
    allCaseOnFieldUser,
    updateCaseOnFieldUser,
    deleteCaseOnFieldUser
}