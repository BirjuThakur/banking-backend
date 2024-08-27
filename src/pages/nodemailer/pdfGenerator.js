const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const axios = require("axios");
const path = require('path');
const fs = require('fs');

const pdfGenerator = async (req, res) => {
    try {
        const { caseId, initiatorEmailId } = req.body;

        // Fetch case details from your database or service
        const response = await axios.get(`http://127.0.0.1:5000/admin/singleCase/${caseId}`);
        const caseDetails = response.data;
        
        if (!caseDetails) {
            return res.status(404).send('Case not found');
        }

        // Destructure case details with checks
        const {
            clientName = {},
            clientBranchName = {},
            product = 'N/A',
            verificationType = 'N/A',
            applicantName = 'N/A',
            address = 'N/A',
            dealerVerification = null,
            dealer_image_one = null,
            dealer_image_two = null,
            dealer_image_three = null,
            dealer_image_four = null
        } = caseDetails.getsingleCase;

        // Generate the PDF
        const doc = new PDFDocument({
            size: 'A4',
            margin: 0
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfBuffer = Buffer.concat(buffers);

            // Configure the email transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_SECRET
                }
            });

            // Send the email with the PDF attachment
            let mailOptions = {
                from: process.env.EMAIL,
                to: initiatorEmailId,
                subject: 'Case PDF',
                text: 'Please find the attached PDF for the case.',
                attachments: [
                    {
                        filename: 'case.pdf',
                        content: pdfBuffer
                    }
                ]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).send(error.toString());
                }
                res.status(200).send('Email sent: ' + info.response);
            });
        });

         // Add a rounded rectangle border with a margin of 20px
         const pageWidth = doc.page.width;
         const pageHeight = doc.page.height;
         const borderMargin = 20;

         const drawBorderWithRadius = () => {
            doc.roundedRect(
                borderMargin,
                borderMargin,
                pageWidth - 2 * borderMargin,
                pageHeight - 2 * borderMargin,
                10 // Adjust this value for more or less border radius
            ).stroke();
            doc.moveDown();
        };

        // Draw border on the first page
        drawBorderWithRadius();

        // Adjust content to fit within the border
        let contentX = borderMargin + 10;
        let contentY = borderMargin + 10;

        // Add content to the PDF
        doc.fontSize(20).text(`Case ID: ${caseId}`, contentX, contentY, { align: 'center' });
        contentY += 40;
        doc.fontSize(16).text('Client Details:', contentX, contentY, { underline: true });
        contentY += 20;
        doc.fontSize(14).text(`Client Name: ${clientName.clientName || 'N/A'}`, contentX, contentY,);
        contentY += 20;
        doc.text(`Client Branch: ${clientBranchName.clientBranchName || 'N/A'}`, contentX, contentY,);
        contentY += 20;
        doc.text(`Product: ${product}`, contentX, contentY,);
        contentY += 20;
        doc.moveDown();

        doc.fontSize(16).text('Applicant Details:', contentX, contentY, { underline: true });
        contentY += 20;
        doc.fontSize(14).text(`Applicant Name: ${applicantName}`, contentX, contentY,);
        contentY += 20;
        doc.text(`Address: ${address}`, contentX, contentY,);
        contentY += 20;

        doc.fontSize(16).text('Verification Details:', contentX, contentY, { underline: true },);
        contentY += 20;
        doc.fontSize(14).text(`Verification Type: ${verificationType}`, contentX, contentY,);
        contentY += 20;

        if (dealerVerification) {
    try {
        const dealerInfo = JSON.parse(dealerVerification);
        doc.text(`Dealer Name and Address: ${dealerInfo.name_and_address_of_car_dealer || 'N/A'}`);
        doc.text(`Duration in Business: ${dealerInfo.duration_in_the_business || 'N/A'}`);
        contentY += 40;
    } catch (parseError) {
        console.log('Failed to parse dealerVerification:', parseError);
        return res.status(400).send('Invalid dealer verification data');
    }
}

        // Add images to the PDF, 4 images per page
        const addImagesToPage = (images) => {
            let x = 30, y = contentY, width = 250, height = 180;
            for (let i = 0; i < images.length; i++) {
                if (fs.existsSync(images[i])) {
                    doc.image(images[i], x, y, { width, height });
                    if ((i + 1) % 2 === 0) {
                        x = 30;
                        y += height + 20;
                    } else {
                        x += width + 20;
                    }
                }
                if ((i + 1) % 4 === 0 && i !== images.length - 1) {
                    doc.addPage();
                    x = 30;
                    y = 30;
                }
            }
            return y;
        };

        const imagePaths = [dealer_image_one, dealer_image_two, dealer_image_three, dealer_image_four].filter(Boolean);
        contentY = addImagesToPage(imagePaths);
        doc.moveDown();

        doc.fontSize(16).text('Verification Details:', contentX, contentY, { underline: true },);
        contentY += 20;
        doc.fontSize(14).text(`Verification Type: ${verificationType}`, contentX, contentY,);
        contentY += 20;

        // // Add images to the PDF
        // const addImageToPDF = (imagePath) => {
        //     if (fs.existsSync(imagePath)) {
        //         doc.addPage().image(imagePath, {
        //             fit: [500, 400],
        //             align: 'center',
        //             valign: 'center'
        //         });
        //     }
        // };

        // if (dealer_image_one) addImageToPDF(dealer_image_one);
        // if (dealer_image_two) addImageToPDF(dealer_image_two);
        // if (dealer_image_three) addImageToPDF(dealer_image_three);
        // if (dealer_image_four) addImageToPDF(dealer_image_four);
        
        doc.end();

    } catch (error) {
        console.log(error);
        res.status(500).send(error.toString());
    }
}

module.exports = pdfGenerator;