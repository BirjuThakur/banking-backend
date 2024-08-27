const ClientName = require("../modals/ClientNameSchema");
const NewCase = require("../modals/caseEntry");
const FeAllocationPending = require("../modals/feAllocationPendingCaseSchema");
const mongoose = require('mongoose');

const createNewCase = async (req, res) => {
    try {
        const caseData = {
            ...req.body,
            dealer_image_one: null,
            dealer_image_two: null,
            dealer_image_three: null,
            dealer_image_four: null
        }

        const { clientName } = caseData;

        // Generate a new unique identifier for the case
        const userid = new mongoose.Types.ObjectId();

        // Check if the client name already exists
        const existingClient = await ClientName.findOne({ _id: clientName });
        if (existingClient) {
            // If it exists, increment the count
            existingClient.count += 1;
            await existingClient.save();
        };

        const createCase = new NewCase({ ...caseData, _id: userid });
        const saveNewCase = await createCase.save();
        // Also create an entry in FeAllocationPending
        const createFeCase = new FeAllocationPending({ ...caseData, _id: userid });
        const saveFeCaseData = await createFeCase.save();

        res.status(201).send({
            success: true,
            message: "new case created successfully",
            newCaseData: saveNewCase,
            feCaseData: saveFeCaseData
        });

    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in new case creation",
            error: error.message
        })
    }
};

const singleCase = async (req, res) => {
    try {
        const { userid } = req.params;
        const getsingleCase = await NewCase.findById(userid).populate('clientName').
            populate('clientBranchName').populate('oclRange');
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

const allCases = async (req, res) => {
    try {
        const { page = 1, limit = 10, clientName } = req.query;
        const query = {};
        if (clientName) {
            query.clientName = clientName
        };
        const skip = (page - 1) * limit;
        const getAllCases = await NewCase.find(query).skip(skip)
            .limit(parseInt(limit)).populate('clientName').populate('clientBranchName')
            .populate('oclRange');
        const totalNewCases = await NewCase.countDocuments(query);
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

const updateCase = async (req, res) => {
    try {
        const { userid } = req.params;
        const userData = req.body;

        // Check if files are received and construct the update object accordingly
        const update = { ...userData };
        if (req.files['dealer_image_one']) {
            update.dealer_image_one = req.files['dealer_image_one'][0].path;
        }
        if (req.files['dealer_image_two']) {
            update.dealer_image_two = req.files['dealer_image_two'][0].path;
        }
        if (req.files['dealer_image_three']) {
            update.dealer_image_three = req.files['dealer_image_three'][0].path;
        }
        if (req.files['dealer_image_four']) {
            update.dealer_image_four = req.files['dealer_image_four'][0].path;
        }
        if (req.files['residence_image_first']) {
            update.residence_image_first = req.files['residence_image_first'][0].path;
        }
        if (req.files['residence_image_second']) {
            update.residence_image_second = req.files['residence_image_second'][0].path;
        }
        if (req.files['residence_image_third']) {
            update.residence_image_third = req.files['residence_image_third'][0].path;
        }
        if (req.files['residence_image_forth']) {
            update.residence_image_forth = req.files['residence_image_forth'][0].path;
        }
        if (req.files['asset_image_first']) {
            update.asset_image_first = req.files['asset_image_first'][0].path;
        }
        if (req.files['asset_image_second']) {
            update.asset_image_second = req.files['asset_image_second'][0].path;
        }
        if (req.files['asset_image_third']) {
            update.asset_image_third = req.files['asset_image_third'][0].path;
        }
        if (req.files['asset_image_forth']) {
            update.asset_image_forth = req.files['asset_image_forth'][0].path;
        }
        if (req.files['builder_image_first']) {
            update.builder_image_first = req.files['builder_image_first'][0].path;
        }
        if (req.files['builder_image_second']) {
            update.builder_image_second = req.files['builder_image_second'][0].path;
        }
        if (req.files['builder_image_third']) {
            update.builder_image_third = req.files['builder_image_third'][0].path;
        }
        if (req.files['builder_image_forth']) {
            update.builder_image_forth = req.files['builder_image_forth'][0].path;
        }
        if (req.files['business_image_first']) {
            update.business_image_first = req.files['business_image_first'][0].path;
        }
        if (req.files['business_image_second']) {
            update.business_image_second = req.files['business_image_second'][0].path;
        }
        if (req.files['business_image_third']) {
            update.business_image_third = req.files['business_image_third'][0].path;
        }
        if (req.files['business_image_forth']) {
            update.business_image_forth = req.files['business_image_forth'][0].path;
        }
        if (req.files['carSubDealerVerification_image_first']) {
            update.carSubDealerVerification_image_first = req.files['carSubDealerVerification_image_first'][0].path;
        }
        if (req.files['carSubDealerVerification_image_second']) {
            update.carSubDealerVerification_image_second = req.files['carSubDealerVerification_image_second'][0].path;
        }
        if (req.files['carSubDealerVerification_image_third']) {
            update.carSubDealerVerification_image_third = req.files['carSubDealerVerification_image_third'][0].path;
        }
        if (req.files['carSubDealerVerification_image_forth']) {
            update.carSubDealerVerification_image_forth = req.files['carSubDealerVerification_image_forth'][0].path;
        }
        if (req.files['employment_image_one']) {
            update.employment_image_one = req.files['employment_image_one'][0].path;
        }
        if (req.files['employment_image_two']) {
            update.employment_image_two = req.files['employment_image_two'][0].path;
        }
        if (req.files['employment_image_three']) {
            update.employment_image_three = req.files['employment_image_three'][0].path;
        }
        if (req.files['employment_image_four']) {
            update.employment_image_four = req.files['employment_image_four'][0].path;
        }
        if (req.files['employment_image_five']) {
            update.employment_image_five = req.files['employment_image_five'][0].path;
        }
        if (req.files['property_image_one']) {
            update.property_image_one = req.files['property_image_one'][0].path;
        }
        if (req.files['property_image_two']) {
            update.property_image_two = req.files['property_image_two'][0].path;
        }
        if (req.files['property_image_three']) {
            update.property_image_three = req.files['property_image_three'][0].path;
        }
        if (req.files['property_image_four']) {
            update.property_image_four = req.files['property_image_four'][0].path;
        }
        if (req.files['property_image_five']) {
            update.property_image_five = req.files['property_image_five'][0].path;
        }
        if (req.files['college_image_one']) {
            update.college_image_one = req.files['college_image_one'][0].path;
        }
        if (req.files['college_image_two']) {
            update.college_image_two = req.files['college_image_two'][0].path;
        }
        if (req.files['college_image_three']) {
            update.college_image_three = req.files['college_image_three'][0].path;
        }
        if (req.files['college_image_four']) {
            update.college_image_four = req.files['college_image_four'][0].path;
        }
        if (req.files['college_image_five']) {
            update.college_image_five = req.files['college_image_five'][0].path;
        }
        // Perform the update operation
        const updateNewCase = await NewCase.findByIdAndUpdate(
            userid,
            { ...userData, ...update },
            { new: true }
        ).populate('clientName').populate('clientBranchName').populate('oclRange');

        res.status(200).send({
            success: true,
            message: "Case updated successfully",
            updateNewCase
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error in updating case",
            error: error.message
        });
    }
};

const deleteCase = async (req, res) => {
    try {
        const { userid } = req.params;
        // Find the case to be deleted
        const caseToDelete = await NewCase.findById(userid);
        // Decrement the count of associated client name
        const clientNameId = caseToDelete.clientName;
        const clientToUpdate = await ClientName.findById(clientNameId).populate('clientName').populate('clientBranchName')
            .populate('oclRange');
        if (clientToUpdate) {
            // Ensure the count doesn't go below 0
            if (clientToUpdate.count > 0) {
                clientToUpdate.count -= 1;
                await clientToUpdate.save();
            }
        }
        const deleteNeCase = await NewCase.findByIdAndDelete(userid);
        // Delete the corresponding entry from FeAllocationPending
        const deleteFeCase = await FeAllocationPending.findOneAndDelete({ _id: userid });

        res.status(200).send({
            success: true,
            message: "new case deleted successfully",
            deleteNeCase,
            deleteFeCase
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in new case deleting",
            error: error.message
        })
    }
};


module.exports = {
    createNewCase,
    singleCase,
    allCases,
    updateCase,
    deleteCase
}