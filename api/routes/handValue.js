const express = require('express');
const router = express.Router();

const handValueController = require('../controllers/handValue');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Hand Value get request (GET not supported)",
    });
});

router.post('/', handValueController.hand_value);

module.exports = router;