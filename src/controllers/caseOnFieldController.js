const CaseONFieldUser = require("../modals/CaseONFieldUserSchema");
const CaseOnField = require("../modals/caseOnField");
const Register = require("../modals/registerSchema");
const VerificationComplete = require("../modals/verificationCompleteSchema");
const VerificationCompleted = require("../modals/verificationCompletedSchema");

const singleCaseOnFieldCase = async(req,res) =>{
    try {
        const {userid} = req.params;
        const getsingleCase = await CaseOnField.findById(userid);
        res.status(200).send({
            success:true,
            message:"new case got successfully",
            getsingleCase
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in new case getting",
            error: error.message
        }) 
    }
}

const allCaseOnFiledCases = async(req,res) =>{
    try {
        const {page=1, limit=10,clientName} = req.query;
        const query = {} ;
        if(clientName){
         query.clientName = clientName
        };
        const skip = (page - 1) * limit;
        const getAllCases = await CaseOnField.find(query).skip(skip)
        .limit(parseInt(limit));
        const getusers = await Register.find().populate('cases');
        const totalNewCases = await CaseOnField.countDocuments(query);
        res.status(200).send({
            success:true,
            message:"new case got successfully",
            getAllCases,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalNewCases / limit),
                totalNewCases,
                getusers
            },
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in new case getting",
            error: error.message
        })
    }
};

const moveSelectedCaseOnFieldCases = async (req,res) =>{
    try {
        const {userid} = req.params;
        // Find the item by ID in the original API
      const feCases = await CaseOnField.findById(userid);
      if (!feCases) {
        return res.status(404).send({ message: 'Item not found in the original API' });
      }
      // Create a new item in the destination API
      const selectedNewCases = new VerificationComplete({
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
      await CaseOnField.findByIdAndDelete(userid);

      res.status(201).send({
        success:true,
        message:'case moved successfully',
        movesData: saveData
      })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in new case deleting",
            error: error.message
        })  
    }
};

const moveCaseOnFieldCases = async (req, res) => {
    try {
        const { userId, caseIds } = req.body;
        
        // Convert caseIds to an array if it's not already an array
        const caseIdsArray = Array.isArray(caseIds) ? caseIds : [caseIds];
    
        //Find the cases to be transferred
        const feCases = await CaseONFieldUser.find({ 'cases': { $in: caseIdsArray } });
        
        if (!feCases || feCases.length === 0) {
            return res.status(404).send({ message: 'Items not found in the original API' });
        }

        // Find the user by ID
        let originalUser = await CaseONFieldUser.findById(userId);
        if (!originalUser) {
            return res.status(404).send({ message: 'User not found in the original API' });
        }

        // Remove transferred cases from their original location
        await CaseONFieldUser.updateMany({ 'cases': { $in: caseIdsArray } }, { $pull: { 'cases': { $in: caseIdsArray } } });

        // Create new user with the same data
        let newUser = await VerificationCompleted.findById(userId);
        if (!newUser) {
            // If the user does not exist, create a new one with the same ID
             newUser = new VerificationCompleted(originalUser.toObject());
            await newUser.save();
        } else {
            // Concatenate the transferred case IDs to the new user's cases array
            newUser.cases.push(...caseIdsArray);
            newUser = await newUser.save();
        }

        res.status(201).send({
            success: true,
            message: 'Cases transferred successfully',
            newUser
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
    singleCaseOnFieldCase,
    allCaseOnFiledCases,
    moveSelectedCaseOnFieldCases,
    moveCaseOnFieldCases
}