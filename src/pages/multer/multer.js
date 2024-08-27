const multer = require("multer");
const path = require("path");

//storage engine
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images'); 
},
filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
}
})

//for storing images
const upload = multer({
    storage:Storage,
    // limits: {
    //     fileSize: 1024 * 1024 * 5, // 5MB file size limit
    //   },
      // fileFilter: function (req, file, cb) {
      //   // Add your file type filters here if needed
      //   // const allowedTypes = ['image/jpeg', 'image/png'];
      //   if (allowedTypes.includes(file.mimetype)) {
      //     cb(null, true);
      //   } else {
      //     cb(new Error('Invalid file type'));
      //   }
      // }
})

module.exports = upload;