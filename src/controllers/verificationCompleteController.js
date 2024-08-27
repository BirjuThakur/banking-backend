const CaseONFieldUser = require('../modals/CaseONFieldUserSchema');
const CaseClosed = require('../modals/caseClosed');
const CaseClosedCases = require('../modals/caseClosedCases');
const NewCase = require('../modals/caseEntry');
const Register = require('../modals/registerSchema');
const UserSuccessCreate = require('../modals/userSuccessCreateSchema');
const VerificationComplete = require('../modals/verificationCompleteSchema');
const VerificationCompleted = require('../modals/verificationCompletedSchema');

const singleVerificationCompleteCase = async (req, res) => {
    try {
        const { userid } = req.params;
        const getsingleCase = await VerificationComplete.findById(userid);
        res.status(200).send({
            success: true,
            message: "new case got successfully",
            getsingleCase
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in new case getting",
            error: error.message
        })
    }
}

const allVerificationCompleteCases = async (req, res) => {
    try {
        const { page = 1, limit = 10, clientName } = req.query;
        const query = {};
        if (clientName) {
            query.clientName = clientName
        };
        const skip = (page - 1) * limit;
        const getAllCases = await VerificationComplete.find(query).skip(skip)
            .limit(parseInt(limit));
        const users = await Register.find().populate('cases');

        const totalNewCases = await VerificationComplete.countDocuments(query);
        res.status(200).send({
            success: true,
            message: "new case got successfully",
            getAllCases,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalNewCases / limit),
                totalNewCases,
                users
            },
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in new case getting",
            error: error.message
        })
    }
};

const moveSelectedVerificationCompleteCases = async (req, res) => {
    try {
        const { userId, caseIds } = req.body;

        // Convert caseIds to an array if it's not already an array
        const caseIdsArray = Array.isArray(caseIds) ? caseIds : [caseIds];

        // Find the items by IDs in the original API
        const feCases = await VerificationComplete.find({ _id: { $in: caseIdsArray } });
        if (!feCases || feCases.length === 0) {
            return res.status(404).send({ message: 'Items not found in the original API' });
        }

        // Find the user by ID in the original API
        const originalUser = await CaseONFieldUser.findById(userId);
        if (!originalUser) {
            return res.status(404).send({ message: 'User not found in the original API' });
        }

        // Create a new item in the destination API
        const selectedNewCases = await CaseClosed.insertMany(feCases.map(feCases => ({
            _id: feCases._id,
            clientName: feCases.clientName,
            clientBranchName: feCases.clientBranchName,
            activity: feCases.activity,
            verificationType: feCases.verificationType,
            product: feCases.product,
            fileNumber: feCases.fileNumber,
            oclRange: feCases.oclRange,
            specialInstructions: feCases.specialInstructions,
            propertyDetails: feCases.propertyDetails,
            initiatorBankManagerName: feCases.initiatorBankManagerName,
            mailInitiationDateTime: feCases.mailInitiationDateTime,
            initiatorEmailId: feCases.initiatorEmailId,
            applicantName: feCases.applicantName,
            borrowerCategory: feCases.borrowerCategory,
            pinCode: feCases.pinCode,
            cityTalukaDistrictState: feCases.cityTalukaDistrictState,
            address: feCases.address,
            residenceNumber: feCases.residenceNumber,
            officeNumber: feCases.officeNumber,
            mobileNumber: feCases.mobileNumber,
            company: feCases.company,
            borrowerOccupationCategory: feCases.borrowerOccupationCategory,
        })));

        // Create new user with the same data
        const newUser = new VerificationCompleted(originalUser.toObject());
        await newUser.save();

        // Update the new user's cases if needed
        newUser.cases = caseIdsArray;
        await newUser.save();

        await VerificationComplete.deleteMany({ _id: { $in: caseIdsArray } });

        res.status(201).send({
            success: true,
            message: 'case moved successfully',
            movesData: saveData
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in new case deleting",
            error: error.message
        })
    }
};

const moveCaseClosedCases = async (req, res) => {
    try {
        const { userId, caseIds } = req.body;

        // Convert caseIds to an array if it's not already an array
        const caseIdsArray = Array.isArray(caseIds) ? caseIds : [caseIds];

        // Find the items by IDs in the original API
        const finalCases = await NewCase.find({ _id: { $in: caseIdsArray } });
        if (!finalCases || finalCases.length === 0) {
            return res.status(404).send({ message: 'Items not found in the original API' });
        }
        // Create a new item in the destination API
        const selectedNewCases = await CaseClosedCases.insertMany(finalCases.map(feCase => ({
            ...feCase.toObject(), 
            _id: feCase._id, 
        })));

        //Find the cases to be transferred
        const feCases = await UserSuccessCreate.find({ 'cases': { $in: caseIdsArray } });

        if (!feCases || feCases.length === 0) {
            return res.status(404).send({ message: 'Items not found in the original API' });
        }

        // Find the user by ID
        let originalUser = await UserSuccessCreate.findById(userId);
        if (!originalUser) {
            return res.status(404).send({ message: 'User not found in the original API' });
        }

        // Remove transferred cases from their original location
        await UserSuccessCreate.updateMany({ 'cases': { $in: caseIdsArray } }, { $pull: { 'cases': { $in: caseIdsArray } } });

        // Create new user with the same data
        let newUser = await CaseClosed.findById(userId);
        if (!newUser) {
            // If the user does not exist, create a new one with the same ID
            newUser = new CaseClosed(originalUser.toObject());
            await newUser.save();
        } else {
            // Concatenate the transferred case IDs to the new user's cases array
            newUser.cases.push(...caseIdsArray);
            newUser = await newUser.save();
        }

        res.status(201).send({
            success: true,
            message: 'Cases transferred successfully',
            newUser,
            selectedNewCases
        });
        
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Error transferring cases',
            error: error.message
        });
    }
};

module.exports = {
    singleVerificationCompleteCase,
    allVerificationCompleteCases,
    moveSelectedVerificationCompleteCases,
    moveCaseClosedCases
}