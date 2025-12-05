const multer = require('multer');

const uploadMiddleware = multer({
    dest: 'uploads/',
    limits: {
        fieldSize: 10 * 1024 * 1024, //10MB for text fields
    },
});

module.exports = uploadMiddleware;
