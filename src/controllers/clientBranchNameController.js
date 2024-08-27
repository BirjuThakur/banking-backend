const ClientBranchName = require("../modals/clientBranchNameSchema");

const createClientBranchName = async(req,res) =>{
    try {
        const {clientBranchName} = req.body;
        const createBranchName = new ClientBranchName({clientBranchName});
        const saveBranchName = await createBranchName.save();
        res.status(201).send({
            success:true,
            message:"client branch name created successfully",
            saveBranchName
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in client branch name creating",
            error: error.message
        }) 
    }
};

const singleClientBranchName = async(req,res) =>{
    try {
        const {userid} = req.params;
        const singleBranchName = await ClientBranchName.findById(userid);
        res.status(200).send({
            success:true,
            message:"client branch name got successfully",
            singleBranchName
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in client branch name getting",
            error: error.message
        }) 
    }
};

const allClientBranchName = async(req,res) =>{
    try {
        const {page=1, limit=10, clientBranchName} = req.query;
        const query = {} ;
        if(clientBranchName){
            query.clientBranchName = { $regex: new RegExp(clientBranchName, 'i') }
        };
        const skip = (page -1) * limit;

        const allBranchName = await ClientBranchName.find(query).skip(skip)
        .limit(parseInt(limit));
        const totalClientBranch = await ClientBranchName.countDocuments(query);

        res.status(200).send({
            success:true,
            message:"client branch name got successfully",
            allBranchName,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalClientBranch / limit),
                totalClientBranch,
            },
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in client branch name getting",
            error: error.message
        }) 
    }
};

const updateClientBranchName = async(req,res) =>{
    try {
        const {userid} = req.params;
        const {clientBranchName} = req.body;
        const updateBrachName = await ClientBranchName.findByIdAndUpdate(userid,{
            clientBranchName
        },{new:true})
        res.status(200).send({
            success:true,
            message:"client branch name updated successfully",
            updateBrachName
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in client branch name updating",
            error: error.message
        }) 
    }
};

const deleteClientBranchName = async(req,res) =>{
    try {
        const {userid} = req.params;
        const deleteBranchName = await ClientBranchName.findByIdAndDelete(userid);
        res.status(200).send({
            success:true,
            message:"client branch name deleted successfully",
            deleteBranchName
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in client branch name deleting",
            error: error.message
        }) 
    }
};

module.exports = {
    createClientBranchName,
    singleClientBranchName,
    allClientBranchName,
    updateClientBranchName,
    deleteClientBranchName
}
