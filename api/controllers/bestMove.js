const possibleHandsMiddleware = require('../middleware/getPossibleHands');
const handValidMiddleware = require('../middleware/isHandValid');
const cardsStringMiddleware = require('../middleware/getCardsString');
const mongoose = require('mongoose');

const bestMoveModel = require('../models/bestMove');

mongoose.connect(`mongodb+srv://drewb:${process.env.MONGO_ATLAS_PASSWORD}@cluster0-ld6lo.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true });

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

    let cardString = cardsStringMiddleware.getCardsString(hand.cards);

    let bestOption = await bestMoveModel.findOne({ cardString: cardString }).exec();//.then(entry => { console.log("FOUND ENTRY:"); console.log(entry)}).catch(error => console.log(error));
    if (bestOption === null) {
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
        bestOption = optionsList[0];


        const bestMoveEntry = new bestMoveModel({
            _id: new mongoose.Types.ObjectId(),
            cardString: cardString,
            held: bestOption.held,
            dropped: bestOption.dropped,
            value: bestOption.value
        });
        bestMoveEntry.save().then(result => console.log(`New entry written to database: ${result.cardString}`)).catch(error => console.log(error));
    }
    
    res.status(200).json({
        message: "Success",
        drop: bestOption.dropped,
        hold: bestOption.held,
        value: bestOption.value,
    });
};