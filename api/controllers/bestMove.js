const possibleHandsMiddleware = require('../middleware/getPossibleHands');
const handValidMiddleware = require('../middleware/isHandValid');
const cardsStringMiddleware = require('../middleware/getCardsString');

let storedBestMoves = {};

exports.best_move = async (req, res, next) => {
    let hand = req.body;
    hand.cards.sort();
    console.log("Checking for best move: " + hand.cards);

    if (!handValidMiddleware.isHandValid(hand)) {
        res.status(200).json({
            message: "Failure",
            error: hand.error,
            value: hand.value,
        });
        return;
    }

    let cardsString = cardsStringMiddleware.getCardsString(hand.cards);
    if (storedBestMoves.hasOwnProperty(cardsString)) { 
        res.status(200).json({
            message: "Success",
            drop: storedBestMoves[cardsString].dropped,
            hold: storedBestMoves[cardsString].held,
            value: storedBestMoves[cardsString].value,
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

    storedBestMoves[cardsString] = bestOption;
    
    res.status(200).json({
        message: "Success",
        drop: bestOption.dropped,
        hold: bestOption.held,
        value: bestOption.value,
    });
};