const handValueMiddleware = require('../middleware/getHandValue');

exports.hand_value = async (req, res, next) => {
    let handValue = handValueMiddleware.getHandValue(req.body);
    let success = (handValue !== -1);

    res.status(200).json(handValue);
};