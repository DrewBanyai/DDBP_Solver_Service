const possibleHandsMiddleware = require('../middleware/getPossibleHands');
const handValidMiddleware = require('../middleware/isHandValid');
const cardsStringMiddleware = require('../middleware/getCardsString');
const mongoose = require('mongoose');

const bestMoveModel = require('../models/bestMove');

let connectToDatabase = async () => {
    let connectFunc = async () => {
        await mongoose.connect("mongodb+srv://drewb:Drew.3739@cluster0-ld6lo.mongodb.net/StereodoseRedux?retryWrites=true&w=majority", { useNewUrlParser: true });
    };

    try {
        await connectFunc();
    }
    catch (error) {
        console.log("Error while attempting to connect to MongoDB Server:");
        console.log(error.name);
        console.log(error.message);
    }
}

exports.best_move = async (req, res, next) => {
    let hand = req.body;

    let bestOption = await determineBestMove(hand);
    if (!bestOption) {
        res.status(200).json({
            message: "Failure",
            error: hand.error,
            value: hand.value,
        });
    }
    else {
        res.status(200).json({
            message: "Success",
            held: bestOption.held,
            value: bestOption.value,
        });
    }
};

let determineBestMove = async (hand) => {

    hand.cards.sort();

    if (!handValidMiddleware.isHandValid(hand)) { return null; }

    let cardString = cardsStringMiddleware.getCardsString(hand.cards);

    let bestOption = await bestMoveModel.findOne({ cardString: cardString }).exec();
    if (bestOption === null) {
        let optionsList = possibleHandsMiddleware.getPossibleOptions(hand);
        let valuePromiseList = [];
        optionsList.forEach((option) => { valuePromiseList.push(possibleHandsMiddleware.getPossibleOptionValues(option)); });

        console.log("Checking for best move: " + hand.cards);

        await (Promise.all(valuePromiseList));
        optionsList.sort((a, b) => { return (b.value > a.value) ? 1 : -1; });
        bestOption = optionsList[0];

        try {
            const bestMoveEntry = new bestMoveModel({
                _id: new mongoose.Types.ObjectId(),
                cardString: cardString,
                held: bestOption.held,
                value: bestOption.value
            });
            let result = await bestMoveEntry.save();
            console.log(`New entry written to database: ${result.cardString}`);
            console.log("");
        }
        catch (exception) {
            console.log("Caught exception");
            console.log(exception);
        }
    }

    return bestOption;
};

exports.determine_best_move = determineBestMove;

connectToDatabase();