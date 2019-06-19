const handValueMiddleware = require('../middleware/getHandValue');
const bestMoveController = require('../controllers/bestMove');

exports.generate_data = async (req, res, next) => {
    generateData(); 

    res.status(200).json({
        message: "Generating Data...",
    });
};

let generateData = async () => {
    while (true) { await testRandomHand(); }
};

exports.generateData = generateData;

let testRandomHand = async () => {
    let hand = generateRandomHand();
    await bestMoveController.determine_best_move(hand);
};

function generateRandomHand() {
    let cards = [];
    console.log("Generating random hand...");
    for (let i = 0; i < 5; ++i) {
        let card = handValueMiddleware.cardIDs[parseInt(Math.random() * handValueMiddleware.cardIDs.length)];
        while (cards.includes(card)) { card = handValueMiddleware.cardIDs[parseInt(Math.random() * handValueMiddleware.cardIDs.length)]; }
        cards.push(card);
    }
    console.log("Random hand generated!");

    let hand = { cards: cards };
    return hand;
}