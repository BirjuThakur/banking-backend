const ClientName = require("../modals/ClientNameSchema");
const NewCase = require("../modals/caseEntry");
const FeAllocationPending = require("../modals/feAllocationPendingCaseSchema");
const HoldNotTraceableRejected = require("../modals/holdNotTraceableRejectedCasesSchema");
const PendingUserCreate = require("../modals/pendingUserCreateSchema");
const PendingUser = require("../modals/pendingUserSchema");
const Register = require("../modals/registerSchema");
const UserSuccessCreate = require("../modals/userSuccessCreateSchema");
const VerificationCompleted = require("../modals/verificationCompletedSchema");

const singleUserCase = async (req, res) => {
    try {
        const { userid } = req.params;
        const getsingleCase = await PendingUser.findById(userid).populate('clientName').populate('clientBranchName')
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

const allUserCase = async (req, res) => {
    try {
        const { page = 1, limit = 10, clientName } = req.query;
        const query = {};
        if (clientName) {
            query.clientName = clientName
        };
        const skip = (page - 1) * limit;
        const getAllCases = await PendingUser.find(query).skip(skip)
            .limit(parseInt(limit)).populate('clientName').populate('clientBranchName')
            .populate('oclRange');
        const totalNewCases = await PendingUser.countDocuments(query);
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

const updateUserCase = async (req, res) => {
    try {
        const { userid } = req.params;
        const userData = req.body;
    
        // Update the FE Case
        const updateFeCase = await PendingUser.findByIdAndUpdate(userid, userData, { new: true }).populate('clientName').populate('clientBranchName')
        .populate('oclRange');

        // Update the general case
        const updateNewCase = await NewCase.findByIdAndUpdate(userid, userData, { new: true });
      
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


const userTransferCaseOnSuccess = async (req, res) => {
    try {
        const { userId, caseIds } = req.body;

        // Ensure caseIds is an array
        const caseIdArray = Array.isArray(caseIds) ? caseIds : [caseIds];

        // Find the user by ID in the PendingUserCreate schema
        let originalUser = await PendingUserCreate.findById(userId);
        if (!originalUser) {
            return res.status(404).send({ message: 'User not found in the original API' });
        }

        // Check if the user already exists in the UserSuccessCreate schema
        let newUser = await UserSuccessCreate.findById(userId);
        if (!newUser) {
            // If the user does not exist, create a new user with the same ID
            newUser = new UserSuccessCreate({
                _id: originalUser._id,
                name: originalUser.name,
                email: originalUser.email,
                phoneNumber: originalUser.phoneNumber,
                pincodes: originalUser.pincodes,
                address: originalUser.address,
                contactInformation: originalUser.contactInformation,
                dateOfBirth: originalUser.dateOfBirth,
                addharNumber: originalUser.addharNumber,
                panNumber: originalUser.panNumber,
                drivingLicense: originalUser.drivingLicense,
                isAdmin: originalUser.isAdmin,
                password: originalUser.password,
                otp: originalUser.otp,
                token: originalUser.token,
                cases: []
            });

            await newUser.save();
        }

         // Check if the user already exists in the UserSuccessCreate schema
         let verificationCompletedUser = await VerificationCompleted.findById(userId);
         if (!verificationCompletedUser) {
             // If the user does not exist, create a new user with the same ID
             verificationCompletedUser = new VerificationCompleted({
                 _id: originalUser._id,
                 name: originalUser.name,
                 email: originalUser.email,
                 phoneNumber: originalUser.phoneNumber,
                 pincodes: originalUser.pincodes,
                 address: originalUser.address,
                 contactInformation: originalUser.contactInformation,
                 dateOfBirth: originalUser.dateOfBirth,
                 addharNumber: originalUser.addharNumber,
                 panNumber: originalUser.panNumber,
                 drivingLicense: originalUser.drivingLicense,
                 isAdmin: originalUser.isAdmin,
                 password: originalUser.password,
                 otp: originalUser.otp,
                 token: originalUser.token,
                 cases: []
             });
 
             await verificationCompletedUser.save();
         }

        // Loop through each case ID and transfer it
        for (const caseId of caseIdArray) {
            // Find the case in the original user's cases array
            const feCase = originalUser.cases.find(c => c.toString() === caseId);
            if (!feCase) {
                return res.status(404).send({ message: `Case with ID ${caseId} not found in the user's cases` });
            }

            // Check if the case already exists in the UserSuccessCreate schema
            let caseExists = newUser.cases.some(caseItem => caseItem._id.toString() === caseId);
            if (!caseExists) {
                // Create new case entry if it does not exist
                newUser.cases.push(feCase);
            } else {
                // Update existing case
                newUser.cases = newUser.cases.map(caseItem =>
                    caseItem._id.toString() === caseId
                        ? { ...caseItem, ...feCase }
                        : caseItem
                );
            }

            // Check if the case already exists in the UserSuccessCreate schema
            let verificationCaseExists = verificationCompletedUser.cases.some(caseItem => caseItem._id.toString() === caseId);
            if (!verificationCaseExists) {
                // Create new case entry if it does not exist
                verificationCompletedUser.cases.push(feCase);
            } else {
                // Update existing case
                verificationCompletedUser.cases = verificationCompletedUser.cases.map(caseItem =>
                    caseItem._id.toString() === caseId
                        ? { ...caseItem, ...feCase }
                        : caseItem
                );
            }
            // Remove the case from the original user's cases array
            originalUser.cases = originalUser.cases.filter(c => c.toString() !== caseId);
        }

        // Save the updated users
        await originalUser.save();
        await newUser.save();
        await verificationCompletedUser.save();
        
        res.status(201).send({
            success: true,
            message: 'Case(s) moved successfully',
            newUser
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in moving case(s)",
            error: error.message
        });
    }
};

const userTransferCaseOnHoldNotTracableRejected = async (req, res) => {
    try {
        const { userId, caseIds } = req.body;

        // Ensure caseIds is an array
        const caseIdArray = Array.isArray(caseIds) ? caseIds : [caseIds];

        // Find the user by ID in the PendingUserCreate schema
        let originalUser = await PendingUserCreate.findById(userId);
        if (!originalUser) {
            return res.status(404).send({ message: 'User not found in the original API' });
        }

        // Check if the user already exists in the UserSuccessCreate schema
        let newUser = await HoldNotTraceableRejected.findById(userId);
        if (!newUser) {
            // If the user does not exist, create a new user with the same ID
            newUser = new HoldNotTraceableRejected({
                _id: originalUser._id,
                name: originalUser.name,
                email: originalUser.email,
                phoneNumber: originalUser.phoneNumber,
                pincodes: originalUser.pincodes,
                address: originalUser.address,
                contactInformation: originalUser.contactInformation,
                dateOfBirth: originalUser.dateOfBirth,
                addharNumber: originalUser.addharNumber,
                panNumber: originalUser.panNumber,
                drivingLicense: originalUser.drivingLicense,
                isAdmin: originalUser.isAdmin,
                password: originalUser.password,
                otp: originalUser.otp,
                token: originalUser.token,
                cases: []
            });

            await newUser.save();
        }

        // Loop through each case ID and transfer it
        for (const caseId of caseIdArray) {
            // Find the case in the original user's cases array
            const feCase = originalUser.cases.find(c => c.toString() === caseId);
            if (!feCase) {
                return res.status(404).send({ message: `Case with ID ${caseId} not found in the user's cases` });
            }

            // Check if the case already exists in the UserSuccessCreate schema
            let caseExists = newUser.cases.some(caseItem => caseItem._id.toString() === caseId);
            if (!caseExists) {
                // Create new case entry if it does not exist
                newUser.cases.push(feCase);
            } else {
                // Update existing case
                newUser.cases = newUser.cases.map(caseItem =>
                    caseItem._id.toString() === caseId
                        ? { ...caseItem, ...feCase }
                        : caseItem
                );
            }

            // Remove the case from the original user's cases array
            originalUser.cases = originalUser.cases.filter(c => c.toString() !== caseId);
        }

        // Save the updated users
        await originalUser.save();
        await newUser.save();

        res.status(201).send({
            success: true,
            message: 'Case(s) moved successfully',
            newUser
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in moving case(s)",
            error: error.message
        });
    }
};

const deleteUserCase = async (req, res) => {
    try {
        const { userid } = req.params;
        
        const deleteFe = await PendingUser.findByIdAndDelete(userid);
        const deleteNewCase = await PendingUser.findByIdAndDelete(userid);

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
    singleUserCase,
    allUserCase,
    updateUserCase,
    deleteUserCase,
    userTransferCaseOnSuccess,
    userTransferCaseOnHoldNotTracableRejected
}