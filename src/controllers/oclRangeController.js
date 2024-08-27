const OclRange = require("../modals/oclRangeSchema");

const createOclRange = async(req,res) =>{
    try {
        const {oclRange,oclPinCode,price} = req.body;
        const createOcl = new OclRange({oclRange,oclPinCode,price});
        const saveOclRange = await createOcl.save();
        res.status(201).send({
            success:true,
            message:"ocl range created successfully",
            saveOclRange
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in ocl range creating",
            error: error.message
        }) 
    }
};

const singleOclRange = async(req,res) =>{
    try {
        const {userid} = req.params;
        const singleOcl = await OclRange.findById(userid);
        res.status(200).send({
            success:true,
            message:"ocl range got successfully",
            singleOcl
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in ocl range getting",
            error: error.message
        }) 
    }
}

const allOclRange = async(req,res) =>{
    try {
        const {page=1, limit=10, oclRange} = req.query;
        const query = {} ;
        
        if(oclRange){
            query.oclRange = { $regex: new RegExp(oclRange, 'i') }
        };

        const skip = (page -1) * limit;

        const allOcl = await OclRange.find(query).skip(skip)
        .limit(parseInt(limit));

        const totaloclRange = await OclRange.countDocuments(query);
        
        res.status(200).send({
            success:true,
            message:"ocl range got successfully",
            allOcl,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totaloclRange / limit),
                totaloclRange,
            },
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in ocl range getting",
            error: error.message
        }) 
    }
}

const updateOclRange = async(req,res) =>{
    try {
        const {userid} = req.params;
        const {oclRange,oclPinCode,price} = req.body;
        const updateOcl = await OclRange.findByIdAndUpdate(userid,{
            oclRange,oclPinCode,price
        },{new:true});
        res.status(200).send({
            success:true,
            message:"ocl range updated successfully",
            updateOcl
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in ocl range updating",
            error: error.message
        }) 
    }
}

const deleteOclRange = async(req,res) =>{
    try {
        const {userid} = req.params;
        const deleteOcl = await OclRange.findByIdAndDelete(userid);
        res.status(200).send({
            success:true,
            message:"ocl range deleted successfully",
            deleteOcl
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in ocl range deleting",
            error: error.message
        }) 
    }
}

module.exports = {
    createOclRange,
    singleOclRange,
    allOclRange,
    updateOclRange,
    deleteOclRange
}