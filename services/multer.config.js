const multer = require('multer');
// save in memory rather in folder
const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });

module.exports = uploads;
