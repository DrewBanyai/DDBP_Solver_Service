const express = require('express');
const router = express.Router();

const bestMoveController = require('../controllers/bestMove');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Best Move get request (GET not supported)",
    });
});

router.post('/', bestMoveController.best_move);

module.exports = router;