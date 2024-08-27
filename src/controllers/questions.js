const CasaOfficeQuestion = require("../modals/casa-office-question");
const OfficeQuestions = require("../modals/office-questions");

const createQuestionsData = async(req,res) =>{
    const { type, data } = req.body;
    try {
        let form;
        if (type === 'Casa') {
            form = new Casa(data);
        } else if (type === 'Office') {
            form = new Office(data);
        }
        await form.save();
        res.status(201).send(form);
    } catch (error) {
        res.status(400).send(error);
    }
}

const getQuestionsData = async(req,res) =>{
    try {
        const casaData = await CasaOfficeQuestion.find();
        const officeData= await OfficeQuestions.find();
        res.status(201).send({
            officeData:officeData,
            casaData: casaData
        });
    } catch (error) {
        res.status(400).send(error); 
    }
}

module.exports = {
    createQuestionsData,
    getQuestionsData
}