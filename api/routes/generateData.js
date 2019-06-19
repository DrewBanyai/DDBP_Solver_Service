const express = require('express');
const router = express.Router();

const generateDataController = require('../controllers/generateData');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Generate Data get request (GET not supported)",
    });
});

router.post('/', generateDataController.generate_data);

generateDataController.generateData();

module.exports = router;