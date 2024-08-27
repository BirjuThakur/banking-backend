const CaseONFieldUser = require("../modals/CaseONFieldUserSchema");
const ClientName = require("../modals/ClientNameSchema");
const NewCase = require("../modals/caseEntry");
const CaseOnField = require("../modals/caseOnField");
const FeAllocationPending = require("../modals/feAllocationPendingCaseSchema");
const PendingUserCreate = require("../modals/pendingUserCreateSchema");
const PendingUser = require("../modals/pendingUserSchema");
const Register = require("../modals/registerSchema");

const singleFeCase = async (req, res) => {
    try {
        const { userid } = req.params;
        const getsingleCase = await FeAllocationPending.findById(userid).populate('clientName').populate('clientBranchName')
        .populate('oclRange');
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

const allFeCases = async (req, res) => {
    try {
        const { page = 1, limit = 10, clientName } = req.query;
        const query = {};
        if (clientName) {
            query.clientName = clientName
        };
        const skip = (page - 1) * limit;
        const getAllCases = await FeAllocationPending.find(query).skip(skip)
            .limit(parseInt(limit)).populate('clientName').populate('clientBranchName')
            .populate('oclRange');
        const totalNewCases = await FeAllocationPending.countDocuments(query);
        res.status(200).send({
            success: true,
            message: "new case got successfully",
            getAllCases,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalNewCases / limit),
                totalNewCases,
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

const updateFeCases = async (req, res) => {
    try {
        const { userid } = req.params;
        const userData = req.body;
        // Find the previous FE Case
        const prevFeCase = await FeAllocationPending.findById(userid);
        const prevClientNameId = prevFeCase.clientName;
        // Decrement the count of the previous client name
        const prevClientToUpdate = await ClientName.findById(prevClientNameId);
        if (prevClientToUpdate) {
            if (prevClientToUpdate.count > 0) {
                prevClientToUpdate.count -= 1;
                await prevClientToUpdate.save();
            }
        }
        // Update the FE Case
        const updateFeCase = await FeAllocationPending.findByIdAndUpdate(userid, userData, { new: true }).populate('clientName').populate('clientBranchName')
        .populate('oclRange');

        // Update the general case
        const updateNewCase = await NewCase.findByIdAndUpdate(userid, userData, { new: true });
        // Find the new client name
        const newClientNameId = updateFeCase.clientName;

        // Increment the count of the new client name
        const newClientToUpdate = await ClientName.findById(newClientNameId);
        if (newClientToUpdate) {
            newClientToUpdate.count += 1;
            await newClientToUpdate.save();
        }

        res.status(200).send({
            success: true,
            message: "FE case and new case updated successfully",
            updateFeCase,
            updateNewCase
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error in updating FE case or new case",
            error: error.message
        });
    }
};

const moveSelectedCases = async (req, res) => {
    try {
        const { userid,userId } = req.params;

        // Find the item by ID in the original API
        const feCases = await FeAllocationPending.findById(userid);
        if (!feCases) {
            return res.status(404).send({ message: 'Item not found in the original API' });
        }
       
        // Create a new item in the destination API
        const selectedNewCases = new CaseOnField({
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
        // Update the user if needed
        const updateUser = await Register.findByIdAndUpdate(userId, { new: true }).populate('cases');
        if (!updateUser) {
            return res.status(404).send({ message: 'User not found' });
        };
        updateUser.cases.push(userid);
        await updateUser.save();
        
        await FeAllocationPending.findByIdAndDelete(userid);

        res.status(201).send({
            success: true,
            message: 'case moved successfully',
            movesData: saveData,
            updateUser
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in new case deleting",
            error: error.message
        })
    }
};

const feTransferCase = async (req, res) => {
    try {
        const { userId, caseIds } = req.body;

        // Convert caseIds to an array if it's not already an array
        const caseIdsArray = Array.isArray(caseIds) ? caseIds : [caseIds];

        // Find the items by IDs in the original API
        const feCases = await FeAllocationPending.find({ _id: { $in: caseIdsArray } });
        if (!feCases || feCases.length === 0) {
            return res.status(404).send({ message: 'Items not found in the original API' });
        }

        // Find the user by ID in the original API
        let originalUser = await Register.findById(userId);
        if (!originalUser) {
            return res.status(404).send({ message: 'User not found in the original API' });
        }

        // Array to hold the saved data
        const savedDataArray = [];

        for (const feCase of feCases) {
            const selectedNewCase = new PendingUser({
                _id: feCase._id,
                clientName: feCase.clientName,
                clientBranchName: feCase.clientBranchName,
                activity: feCase.activity,
                verificationType: feCase.verificationType,
                product: feCase.product,
                fileNumber: feCase.fileNumber,
                oclRange: feCase.oclRange,
                specialInstructions: feCase.specialInstructions,
                propertyDetails: feCase.propertyDetails,
                initiatorBankManagerName: feCase.initiatorBankManagerName,
                mailInitiationDateTime: feCase.mailInitiationDateTime,
                initiatorEmailId: feCase.initiatorEmailId,
                applicantName: feCase.applicantName,
                borrowerCategory: feCase.borrowerCategory,
                pinCode: feCase.pinCode,
                cityTalukaDistrictState: feCase.cityTalukaDistrictState,
                address: feCase.address,
                residenceNumber: feCase.residenceNumber,
                officeNumber: feCase.officeNumber,
                mobileNumber: feCase.mobileNumber,
                company: feCase.company,
                borrowerOccupationCategory: feCase.borrowerOccupationCategory,
            });

            const savedData = await selectedNewCase.save();
            savedDataArray.push(savedData);
        }

        // Update the original user with the new cases
        originalUser.cases.push(...caseIdsArray);
        originalUser = await originalUser.save();

        // Find or create new user and new pending user
        let newUser = await CaseONFieldUser.findById(userId);
        let newPendingUser = await PendingUserCreate.findById(userId);

        if (!newUser) {
            // If the user does not exist, create a new one with the same ID
            newUser = new CaseONFieldUser(originalUser.toObject());
            await newUser.save();
        } else {
            // Concatenate the transferred case IDs to the new user's cases array
            newUser.cases.push(...caseIdsArray);
            await newUser.save();
        }

        if (!newPendingUser) {
            newPendingUser = new PendingUserCreate(originalUser.toObject());
            // Save the new cases to newPendingUser
            newPendingUser.cases = savedDataArray.map(data => data._id);
            await newPendingUser.save();
        } else {
            newPendingUser.cases.push(...savedDataArray.map(data => data._id));
            await newPendingUser.save();
        }

        // Delete the transferred cases from the original API
        await FeAllocationPending.deleteMany({ _id: { $in: caseIdsArray } });

        res.status(201).send({
            success: true,
            message: 'Cases moved successfully',
            originalUser,
            newUser,
            userCase: savedDataArray
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error in moving cases",
            error: error.message
        });
    }
};

const deleteFeCase = async (req, res) => {
    try {
        const { userid } = req.params;
        const caseToDelete = await FeAllocationPending.findById(userid);
        // Decrement the count of associated client name
        const clientNameId = caseToDelete.clientName;
        const clientToUpdate = await ClientName.findById(clientNameId);
        if (clientToUpdate) {
            // Ensure the count doesn't go below 0
            if (clientToUpdate.count > 0) {
                clientToUpdate.count -= 1;
                await clientToUpdate.save();
            }
        }
        const deleteFe = await FeAllocationPending.findByIdAndDelete(userid);
        const deleteNewCase = await NewCase.findByIdAndDelete(userid);

        res.status(201).send({
            success: true,
            message: 'case deleted successfully',
            deleteFe,
            deleteNewCase
        });

    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in new case deleting",
            error: error.message
        })
    }
};

module.exports = {
    singleFeCase,
    allFeCases,
    updateFeCases,
    moveSelectedCases,
    feTransferCase,
    deleteFeCase
}