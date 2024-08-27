const ClientName = require("../modals/ClientNameSchema");
const NewCase = require("../modals/caseEntry");

const createClientName = async(req,res) =>{
    try {
        const { clientName } = req.body;

        // Check if the client name already exists
        const existingClient = await ClientName.findOne({ clientName });

        if (existingClient) {
            res.status(400).send({
                success: true,
                message: "you have already client name",
            });
        } else {
            // If it doesn't exist, create a new client
            const createClient = new ClientName({ clientName });
            const saveClient = await createClient.save();

            res.status(201).send({
                success: true,
                message: "Client name created successfully",
                saveClient,
            });
        }
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in client name creation",
            error: error.message
        })
    }
};

const singleClientName = async(req,res) =>{
    try {
        const {userid} = req.params;
        const singleName = await ClientName.findById(userid);
        res.status(200).send({
            success:true,
            message:"client name got successfully",
            singleName
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in client name getting",
            error: error.message
        })
    }
};

const allClientsName = async(req,res) =>{
    try {
        const {page=1, limit=10, clientName} = req.query;
        const query = {} ;
        
        if(clientName){
            query.clientName = { $regex: new RegExp(clientName, 'i') }
        };

        const skip = (page -1) * limit;

        const getAllClients = await ClientName.find(query).skip(skip)
        .limit(parseInt(limit));

        const totalClientNames = await ClientName.countDocuments(query);

        res.status(200).send({
            success:true,
            message:"client name got successfully",
            getAllClients,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalClientNames / limit),
                totalClientNames,
            },
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in client name getting",
            error: error.message
        })  
    }
};

const updateClientName = async(req,res) =>{
    try {
        const {userid} = req.params;
        const {clientName} = req.body;
        const updateClient = await ClientName.findByIdAndUpdate(userid,{clientName},{new:true});
        res.status(200).send({
            success:true,
            message:"client name updated successfully",
            updateClient
        })
    } catch (error) {
        res.status(400).send({
            success:false,
            message:"error in client name updating",
            error: error.message
        })
    }
};

const deleteClientName = async (req, res) => {
    try {
        const { userid } = req.params;

        // Find the client by ID
        const clientToDelete = await ClientName.findByIdAndDelete(userid);

        if (!clientToDelete) {
            // If the client doesn't exist, return a not found response
            return res.status(404).send({
                success: false,
                message: "Client not found",
            });
        }
            res.status(200).send({
                success: true,
                message: "Client name deleted successfully",
                deleteClient: clientToDelete,
            });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error in client name deleting",
            error: error.message,
        });
    }
};

module.exports = {
    createClientName,
    singleClientName,
    allClientsName,
    updateClientName,
    deleteClientName
}