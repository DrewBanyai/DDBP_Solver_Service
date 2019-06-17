const handValueMiddleware = require('../middleware/getHandValue');
const handValidMiddleware = require('../middleware/isHandValid');

exports.hand_value = async (req, res, next) => {
    let hand = req.body;
    hand.cards.sort();
    
    if (!handValidMiddleware.isHandValid(hand)) { 
        let handValue = handValueMiddleware.HandValues.NOTHING;
        res.status(200).json(handValue);
    }

    let handValue = handValueMiddleware.getHandValue(hand);
    let success = (handValue !== -1);

    res.status(200).json(handValue);
};