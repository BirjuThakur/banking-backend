const ReadyToTransferData = require('../modals/readyToTransferDataSchema');

const singleFinalData = async(req,res) =>{
    try {
        const {userid} = req.params;
        const getsingleCase = await ReadyToTransferData.findById(userid);
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

const allFinalCases = async(req,res) =>{
    try {
        const {page=1, limit=10,clientName} = req.query;
        const query = {} ;
        if(clientName){
         query.clientName = clientName
        };
        const skip = (page - 1) * limit;
        const getAllCases = await ReadyToTransferData.find(query).skip(skip)
        .limit(parseInt(limit));
        const totalNewCases = await ReadyToTransferData.countDocuments(query);
        res.status(200).send({
            success:true,
            message:"new case got successfully",
            getAllCases,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalNewCases / limit),
                totalNewCases,
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

// const moveSelectedCaseClosedCases = async (req,res) =>{
//     try {
//         const {userid} = req.params;
        
//         // Find the item by ID in the original API
//       const feCases = await ReadyToTransferData.findById(userid);
//       if (!feCases) {
//         return res.status(404).send({ message: 'Item not found in the original API' });
//       }
//       // Create a new item in the destination API
//       const selectedNewCases = new CaseClosed({
//         _id: feCases._id,
//         clientName: feCases.clientName,
//         clientBranchName: feCases.clientBranchName,
//         activity: feCases.activity,
//         verificationType: feCases.verificationType,
//         product: feCases.product,
//         fileNumber: feCases.fileNumber,
//         oclRange: feCases.oclRange,
//         specialInstructions: feCases.specialInstructions,
//         propertyDetails: feCases.propertyDetails,
//         initiatorBankManagerName: feCases.initiatorBankManagerName,
//         mailInitiationDateTime: feCases.mailInitiationDateTime,
//         initiatorEmailId: feCases.initiatorEmailId,
//         applicantName: feCases.applicantName,
//         borrowerCategory: feCases.borrowerCategory,
//         pinCode: feCases.pinCode,
//         cityTalukaDistrictState: feCases.cityTalukaDistrictState,
//         address: feCases.address,
//         residenceNumber: feCases.residenceNumber,
//         officeNumber: feCases.officeNumber,
//         mobileNumber: feCases.mobileNumber,
//         company: feCases.company,
//         borrowerOccupationCategory: feCases.borrowerOccupationCategory,
//       });

//       const saveData = await selectedNewCases.save();
//       await ReadyToTransferData.findByIdAndDelete(userid);
      
//       res.status(201).send({
//         success:true,
//         message:'case moved successfully',
//         movesData: saveData
//       })
//     } catch (error) {
//         res.status(400).send({
//             success:false,
//             message:"error in new case deleting",
//             error: error.message
//         })  
//     }
// };

module.exports = {
    singleFinalData,
    allFinalCases
}