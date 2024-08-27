const ClientName = require('../modals/ClientNameSchema');
const CaseClosed = require('../modals/caseClosed');
const CaseClosedCases = require('../modals/caseClosedCases');
const NewCase = require('../modals/caseEntry');
const ReadyToTransferData = require("../modals/readyToTransferDataSchema");
const Register = require('../modals/registerSchema');

const singleCaseClosedCase = async (req, res) => {
    try {
        const { userid } = req.params;
        const getsingleCase = await CaseClosed.findById(userid);
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

const getSingleCaseClosedUser = async (req, res) => {
    try {
        const { userid } = req.params;
        const singleUser = await CaseClosed.findById(userid).populate('pincodes').populate({
            path: 'cases',
            populate: [
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

const allCaseClosedUser = async (req, res) => {
    try {
        const allUser = await CaseClosed.find().populate('pincodes').populate({
            path: 'cases',
            populate: [
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

const allCaseClosedCases = async (req, res) => {
    try {
        const { page = 1, limit = 10, clientName } = req.query;
        const query = {};
        if (clientName) {
            query.clientName = clientName
        };
        const skip = (page - 1) * limit;
        const getAllCases = await CaseClosed.find(query).skip(skip)
            .limit(parseInt(limit));
        const users = await Register.find().populate('cases');

        const totalNewCases = await CaseClosed.countDocuments(query);
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

const moveSelectedCaseClosedCases = async (req, res) => {
    try {
        const { userid } = req.params;

        // Find the item by ID in the original API
        const feCases = await CaseClosed.findById(userid);
        if (!feCases) {
            return res.status(404).send({ message: 'Item not found in the original API' });
        }
        // Create a new item in the destination API
        const selectedNewCases = new ReadyToTransferData({
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
        });

        const saveData = await selectedNewCases.save();
        await NewCase.findByIdAndDelete(userid);

        await CaseClosed.findByIdAndDelete(userid);

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

const casesMoveAndClosed = async (req, res) => {
    try {
        const { userId, caseIds } = req.body; // Assuming you pass the user ID and an array of case IDs in the request body

        // Find the user by ID
        const user = await CaseClosed.findById(userId);
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        // Delete each selected case associated with the user
        await Promise.all(caseIds.map(async (caseId) => {
            const caseToDelete = await NewCase.findById(caseId);

            if (!caseToDelete) {
                return res.status(404).send({ success: false, message: 'Case not found' });
            }
            // Find the associated client name
            const clientNameId = caseToDelete.clientName;
            const clientToUpdate = await ClientName.findById(clientNameId);

            if (!clientToUpdate) {
                return res.status(404).send({ success: false, message: 'Client not found' });
            }

            // Ensure the count doesn't go below 0
            if (clientToUpdate.count > 0) {
                clientToUpdate.count -= 1;
                await clientToUpdate.save();
            }
            
            // Delete the case from the user's cases array
            const index = user.cases.indexOf(caseId);
            if (index !== -1) {
                user.cases.splice(index, 1);
            }

            // Delete the case from NewCase collection if it exists
            await NewCase.findByIdAndDelete(caseId);

            // Delete the case from CaseClosed collection
            await CaseClosed.findByIdAndDelete(caseId);

            // Delete the case from CaseClosedcases collection
            await CaseClosedCases.findByIdAndDelete(caseId);
            
            // Delete the case from Register collection
            await Register.updateMany({}, { $pull: { cases: caseId } });
        }));

        // Save the user after removing the cases
        await user.save();
        
        res.status(200).send({
            success: true,
            message: 'Cases associated with the user deleted successfully',
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Error deleting cases associated with the user',
            error: error.message
        });
    }
};

module.exports = {
    singleCaseClosedCase,
    getSingleCaseClosedUser,
    allCaseClosedUser,
    allCaseClosedCases,
    moveSelectedCaseClosedCases,
    casesMoveAndClosed
}

