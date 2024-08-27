const express = require("express");
const { createClientName, singleClientName, allClientsName, updateClientName, deleteClientName } = require("../../controllers/clientNameController");
const { createClientBranchName, singleClientBranchName, allClientBranchName, updateClientBranchName, deleteClientBranchName } = require("../../controllers/clientBranchNameController");
const { createOclRange, singleOclRange, allOclRange, updateOclRange, deleteOclRange } = require("../../controllers/oclRangeController");
const { createNewCase, singleCase, allCases, updateCase, deleteCase } = require("../../controllers/caseEntryController");
const { singleFeCase, allFeCases, updateFeCase, deleteFeCase, moveSelectedCases, updateFeCases, feTransferCase } = require("../../controllers/FeAllocationPendingController");
const { allCaseOnFiledCases, moveSelectedCaseOnFieldCases, singleCaseOnFieldCase, moveCaseOnFieldCases } = require("../../controllers/caseOnFieldController");
const { singleVerificationCompleteCase, allVerificationCompleteCases, moveSelectedVerificationCompleteCases, moveVerificationCompleteCases, moveCaseClosedCases } = require("../../controllers/verificationCompleteController");
const { singleCaseClosedCase, allCaseClosedCases, moveSelectedCaseClosedCases, getSingleCaseClosedUser, allCaseClosedUser, casesMoveAndClosed } = require("../../controllers/caseClosed");
const { createPincode, singlePincode, allPinCodeData, updatePincodeData, deletePincodeData } = require("../../controllers/pincodeController");
const { singleFinalData, allFinalCases } = require("../../controllers/ReadyToTransferDataController");
const { getSingleCaseOnFieldUser, allCaseOnFieldUser } = require("../../controllers/caseOnFieldUserController");
const { getSingleverificationcompletedUser, allVerificationCompltetedUser, updateVerificationCompletedUser, deleteVerificationCompletedUser } = require("../../controllers/verificationCompletedController");
const { singleUserCase, allUserCase, updateUserCase, deleteUserCase, userTransferCaseOnHoldNotTracableRejected, userTransferCaseOnSuccess } = require("../../controllers/userPendingCases");
const { getSingleUserPending, allUserPending, updateUserPending, deleteUserPending } = require("../../controllers/userPending");
const { getUserSuccessCreate, allUserSuccessCreate, updateUserSuccessCreate, deleteUserSuccessCreate } = require("../../controllers/UserSuccess");
const { getHoldNotTraceableRejected, allHoldNotTraceableRejected, updateHoldNotTraceableRejected, deleteHoldNotTraceableRejected } = require("../../controllers/onHoldRejectedNotTracableUser");
const upload = require("../multer/multer");
const pdfGenerator = require("../nodemailer/pdfGenerator");
const adminRoutes = express.Router();

adminRoutes.get("/", (req, res) => {
  res.send("hello admin")
});

// client name
adminRoutes.post("/createClientName", createClientName);
adminRoutes.get("/singleClinetName/:userid", singleClientName);
adminRoutes.get("/allClientName", allClientsName);
adminRoutes.put("/updateClientName/:userid", updateClientName);
adminRoutes.delete("/deleteClientName/:userid", deleteClientName);

// client branch name 
adminRoutes.post("/createBranchName", createClientBranchName);
adminRoutes.get("/singleBranchName/:userid", singleClientBranchName);
adminRoutes.get("/allBranchName", allClientBranchName);
adminRoutes.put("/updateBranchName/:userid", updateClientBranchName);
adminRoutes.delete("/deleteBranchName/:userid", deleteClientBranchName);

// ocl name
adminRoutes.post("/createocl", createOclRange);
adminRoutes.get("/singleocl/:userid", singleOclRange);
adminRoutes.get("/allocl", allOclRange);
adminRoutes.put("/updateicl/:userid", updateOclRange);
adminRoutes.delete("/deleteocl/:userid", deleteOclRange);

// cases
adminRoutes.post("/createNewCase", createNewCase);
adminRoutes.get("/singleCase/:userid", singleCase);
adminRoutes.get("/allCases", allCases);
adminRoutes.put("/updateCase/:userid", upload.fields([
  { name: 'dealer_image_one', maxCount: 1 },
  { name: 'dealer_image_two', maxCount: 1 },
  { name: 'dealer_image_three', maxCount: 1 },
  { name: 'dealer_image_four', maxCount: 1 },

  { name: 'residence_image_first', maxCount: 1 },
  { name: 'residence_image_second', maxCount: 1 },
  { name: 'residence_image_third', maxCount: 1 },
  { name: 'residence_image_forth', maxCount: 1 },

  { name: 'asset_image_first', maxCount: 1 },
  { name: 'asset_image_second', maxCount: 1 },
  { name: 'asset_image_third', maxCount: 1 },
  { name: 'asset_image_forth', maxCount: 1 },

  { name: 'builder_image_first', maxCount: 1 },
  { name: 'builder_image_second', maxCount: 1 },
  { name: 'builder_image_third', maxCount: 1 },
  { name: 'builder_image_forth', maxCount: 1 },

  { name: 'business_image_first', maxCount: 1 },
  { name: 'business_image_second', maxCount: 1 },
  { name: 'business_image_third', maxCount: 1 },
  { name: 'business_image_forth', maxCount: 1 },

  { name: 'carSubDealerVerification_image_first', maxCount: 1 },
  { name: 'carSubDealerVerification_image_second', maxCount: 1 },
  { name: 'carSubDealerVerification_image_third', maxCount: 1 },
  { name: 'carSubDealerVerification_image_forth', maxCount: 1 },

  { name: 'employment_image_one', maxCount: 1 },
  { name: 'employment_image_two', maxCount: 1 },
  { name: 'employment_image_three', maxCount: 1 },
  { name: 'employment_image_four', maxCount: 1 },
  { name: 'employment_image_five', maxCount: 1 },

  { name: 'property_image_one', maxCount: 1 },
  { name: 'property_image_two', maxCount: 1 },
  { name: 'property_image_three', maxCount: 1 },
  { name: 'property_image_four', maxCount: 1 },
  { name: 'property_image_five', maxCount: 1 },

  { name: 'college_image_one', maxCount: 1 },
  { name: 'college_image_two', maxCount: 1 },
  { name: 'college_image_three', maxCount: 1 },
  { name: 'college_image_four', maxCount: 1 },
  { name: 'college_image_five', maxCount: 1 },
]), updateCase);
adminRoutes.delete("/deleteCase/:userid", deleteCase);

// fe cases
adminRoutes.get("/singlefeCase/:userid", singleFeCase);
adminRoutes.get("/allfeCases", allFeCases);
adminRoutes.put("/updatefecase/:userid", updateFeCases);
adminRoutes.post('/moveselectedfecases/:userid/:userId', moveSelectedCases);
adminRoutes.post('/fetransfercases', feTransferCase);
adminRoutes.delete('/deletefecase/:userid', deleteFeCase);

// case onfield
adminRoutes.get("/singlecaseonfieldCase/:userid", singleCaseOnFieldCase);
adminRoutes.get('/allcaseonfieldcases', allCaseOnFiledCases);
adminRoutes.post('/movecaseonfieldcases/:userid', moveSelectedCaseOnFieldCases);
adminRoutes.post('/movecaseonfield', moveCaseOnFieldCases);

// case on field users 
adminRoutes.get('/singlecaseonfielduser/:userid', getSingleCaseOnFieldUser);
adminRoutes.get("/allcaseonfieldusers", allCaseOnFieldUser);

// verification complete 
adminRoutes.get('/singleverificationcompletecase/:userid', singleVerificationCompleteCase);
adminRoutes.get('/allverificationcompletecases', allVerificationCompleteCases);
adminRoutes.post('/moveverificationcompletecases/:userid', moveSelectedVerificationCompleteCases);
adminRoutes.post('/movecaseclosed', moveCaseClosedCases);

// verification completed users
adminRoutes.get("/singleverificationcomplteduser/:userid", getSingleverificationcompletedUser);
adminRoutes.get("/allverificationcompletedusers", allVerificationCompltetedUser);

// case closed 
adminRoutes.get('/singlecaseClosedcase/:userid', singleCaseClosedCase);
adminRoutes.get('/allcaseClosedtecases', allCaseClosedCases);
adminRoutes.post('/movecaseClosedcases/:userid', moveSelectedCaseClosedCases);

// caseclosed uses
adminRoutes.get('/singlecasecloseduser/:userid', getSingleCaseClosedUser);
adminRoutes.get('/allcasecloedusers', allCaseClosedUser);
adminRoutes.post('/casesclosed', casesMoveAndClosed);

// pincode mapped data
adminRoutes.post('/createpincode', createPincode);
adminRoutes.get('/singlepincode/:userid', singlePincode);
adminRoutes.get('/allpincodes', allPinCodeData);
adminRoutes.put('/updatepincode/:userid', updatePincodeData);
adminRoutes.delete('/deletepincode/:userid', deletePincodeData);

// ready to transfer data
adminRoutes.get("/singledata/:userid", singleFinalData);
adminRoutes.get("/allfinaldata", allFinalCases);

// user cases pending 
adminRoutes.get("/singleUserCase/:userid", singleUserCase);
adminRoutes.get("/allUserCases", allUserCase);
adminRoutes.put("/updateusercase/:userid", updateUserCase);
adminRoutes.post('/usertransfercases', userTransferCaseOnSuccess);
adminRoutes.post('/usertransfercasesonholdnottracablerejected', userTransferCaseOnHoldNotTracableRejected);
adminRoutes.delete('/deleteusercase/:userid', deleteUserCase);

// user pending 
adminRoutes.get("/singleUser/:userid", getSingleUserPending);
adminRoutes.get("/allUsers", allUserPending);
adminRoutes.put("/updateuser/:userid", updateUserPending);
adminRoutes.delete('/deleteuser/:userid', deleteUserPending);

// user onhold rejected 
adminRoutes.get("/singleonholdrejectednottraceable/:userid", getHoldNotTraceableRejected);
adminRoutes.get("/onholdrejectednottraceable", allHoldNotTraceableRejected);
adminRoutes.put("/updateonholdrejectednottraceable/:userid", updateHoldNotTraceableRejected);
adminRoutes.delete('/deleteonholdrejectednottraceable/:userid', deleteHoldNotTraceableRejected);

// user success 
adminRoutes.get("/singleUsersuccess/:userid", getUserSuccessCreate);
adminRoutes.get("/allUserssuccess", allUserSuccessCreate);
adminRoutes.put("/updateusersuccess/:userid", updateUserSuccessCreate);
adminRoutes.delete('/deleteusersuccess/:userid', deleteUserSuccessCreate);

// pdf generator 
adminRoutes.post("/sendpdf",pdfGenerator);

module.exports = adminRoutes;