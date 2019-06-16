const possibleHandsMiddleware = require('../middleware/getPossibleHands');
const handValidMiddleware = require('../middleware/isHandValid');
const handValueMiddleware = require('../middleware/getHandValue');

exports.best_move = async (req, res, next) => {
    let hand = req.body;

    if (!handValidMiddleware.isHandValid(hand)) {
        res.status(200).json({
            message: "Failure",
            error: hand.error,
            value: hand.value,
        });
        return;
    }

    let optionsList = possibleHandsMiddleware.getPossibleOptions(hand);
    let valuePromiseList = [];
    optionsList.forEach((option) => { 
        valuePromiseList.push(new Promise(async (resolve) => {
            await possibleHandsMiddleware.getPossibleOptionValues(option);
            resolve(true);
        }));
    });
    await (Promise.all(valuePromiseList));
    optionsList.sort((a, b) => { return (b.value > a.value) ? 1 : -1; });
    let bestOption = optionsList[0];
    
    res.status(200).json({
        message: "Success",
        drop: bestOption.dropped,
        hold: bestOption.held,
        value: bestOption.value,
    });
};