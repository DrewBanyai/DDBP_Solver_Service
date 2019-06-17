const handValueMiddleware = require('../middleware/getHandValue');
const cardsStringMiddleware = require('../middleware/getCardsString');

let cardIDs = handValueMiddleware.cardIDs;

let storedHandValues = {};

exports.getPossibleOptions = (hand) => {
    let optionsList = [];
    let cards = [...hand.cards];

    //  0 Cards Dropped
    optionsList.push({ held: [ cards[0], cards[1], cards[2], cards[3], cards[4] ], dropped: [ ] });

    //  1 Card Dropped
    optionsList.push({ held: [ cards[0], cards[1], cards[2], cards[3] ], dropped: [ cards[4] ] });
    optionsList.push({ held: [ cards[0], cards[1], cards[2], cards[4] ], dropped: [ cards[3] ] });
    optionsList.push({ held: [ cards[0], cards[1], cards[3], cards[4] ], dropped: [ cards[2] ] });
    optionsList.push({ held: [ cards[0], cards[2], cards[3], cards[4] ], dropped: [ cards[1] ] });
    optionsList.push({ held: [ cards[1], cards[2], cards[3], cards[4] ], dropped: [ cards[0] ] });
    
    //  2 Cards Dropped
    optionsList.push({ held: [ cards[0], cards[1], cards[2] ], dropped: [ cards[3], cards[4] ] });
    optionsList.push({ held: [ cards[0], cards[1], cards[3] ], dropped: [ cards[2], cards[4] ] });
    optionsList.push({ held: [ cards[0], cards[2], cards[3] ], dropped: [ cards[1], cards[4] ] });
    optionsList.push({ held: [ cards[1], cards[2], cards[3] ], dropped: [ cards[0], cards[4] ] });
    optionsList.push({ held: [ cards[0], cards[1], cards[4] ], dropped: [ cards[2], cards[3] ] });
    optionsList.push({ held: [ cards[0], cards[2], cards[4] ], dropped: [ cards[1], cards[3] ] });
    optionsList.push({ held: [ cards[1], cards[2], cards[4] ], dropped: [ cards[0], cards[3] ] });
    optionsList.push({ held: [ cards[0], cards[3], cards[4] ], dropped: [ cards[1], cards[2] ] });
    optionsList.push({ held: [ cards[1], cards[3], cards[4] ], dropped: [ cards[0], cards[2] ] });
    optionsList.push({ held: [ cards[2], cards[3], cards[4] ], dropped: [ cards[0], cards[1] ] });

    //  3 Cards Dropped
    optionsList.push({ held: [ cards[0], cards[1] ], dropped: [ cards[2], cards[3], cards[4] ] });
    optionsList.push({ held: [ cards[0], cards[2] ], dropped: [ cards[1], cards[3], cards[4] ] });
    optionsList.push({ held: [ cards[1], cards[2] ], dropped: [ cards[0], cards[3], cards[4] ] });
    optionsList.push({ held: [ cards[0], cards[3] ], dropped: [ cards[1], cards[2], cards[4] ] });
    optionsList.push({ held: [ cards[1], cards[3] ], dropped: [ cards[0], cards[2], cards[4] ] });
    optionsList.push({ held: [ cards[2], cards[3] ], dropped: [ cards[0], cards[1], cards[4] ] });
    optionsList.push({ held: [ cards[0], cards[4] ], dropped: [ cards[1], cards[2], cards[3] ] });
    optionsList.push({ held: [ cards[1], cards[4] ], dropped: [ cards[0], cards[2], cards[3] ] });
    optionsList.push({ held: [ cards[2], cards[4] ], dropped: [ cards[0], cards[1], cards[3] ] });
    optionsList.push({ held: [ cards[3], cards[4] ], dropped: [ cards[0], cards[1], cards[2] ] });

    //  4 Cards Dropped
    optionsList.push({ held: [ cards[0] ], dropped: [ cards[1], cards[2], cards[3], cards[4] ] });
    optionsList.push({ held: [ cards[1] ], dropped: [ cards[0], cards[2], cards[3], cards[4] ] });
    optionsList.push({ held: [ cards[2] ], dropped: [ cards[0], cards[1], cards[3], cards[4] ] });
    optionsList.push({ held: [ cards[3] ], dropped: [ cards[0], cards[1], cards[2], cards[4] ] });
    optionsList.push({ held: [ cards[4] ], dropped: [ cards[0], cards[1], cards[2], cards[3] ] });

    //  5 Cards Dropped
    optionsList.push({ held: [ ], dropped: [ cards[0], cards[1], cards[2], cards[3], cards[4] ] });

    return optionsList;
};

exports.getPossibleOptionValues = async (option) => {
    let possibleHands = await getPossibleHands(option);
    let optionValue = await determineOptionValue(option, possibleHands);
    return optionValue;
};

let getPossibleHands = async (option) => {
    let possibleHandList = [];

    if (option.dropped.length === 0) { possibleHandList.push({ cards: [ option.held[0], option.held[1], option.held[2], option.held[3], option.held[4] ] }); }

    if (option.dropped.length >= 1) {
        for (let c1 = 0; c1 < cardIDs.length; ++c1) {
            if (option.dropped.includes(cardIDs[c1]) || option.held.includes(cardIDs[c1])) { continue; }
            if (option.dropped.length === 1) { possibleHandList.push({ cards: [ cardIDs[c1], option.held[0], option.held[1], option.held[2], option.held[3] ] }); }

            if (option.dropped.length < 2) { continue; }
            for (let c2 = c1 + 1; c2 < cardIDs.length; ++c2) {
                if (option.dropped.includes(cardIDs[c2]) || option.held.includes(cardIDs[c2])) { continue; }
                if (option.dropped.length === 2) { possibleHandList.push({ cards: [ cardIDs[c1], cardIDs[c2], option.held[0], option.held[1], option.held[2] ] }); }

                if (option.dropped.length < 3) { continue; }
                for (let c3 = c2 + 1; c3 < cardIDs.length; ++c3) {
                    if (option.dropped.includes(cardIDs[c3]) || option.held.includes(cardIDs[c3])) { continue; }
                    if (option.dropped.length === 3) { possibleHandList.push({ cards: [ cardIDs[c1], cardIDs[c2], cardIDs[c3], option.held[0], option.held[1] ] }); }

                    if (option.dropped.length < 4) { continue; }
                    for (let c4 = c3 + 1; c4 < cardIDs.length; ++c4) {
                        if (option.dropped.includes(cardIDs[c4]) || option.held.includes(cardIDs[c4])) { continue; }
                        if (option.dropped.length === 4) { possibleHandList.push({ cards: [ cardIDs[c1], cardIDs[c2], cardIDs[c3], cardIDs[c4], option.held[0] ] }); }

                        if (option.dropped.length < 5) { continue; }
                        for (let c5 = c4 + 1; c5 < cardIDs.length; ++c5) {
                            if (option.dropped.includes(cardIDs[c5]) || option.held.includes(cardIDs[c5])) { continue; }
                            if (option.dropped.length === 5) { possibleHandList.push({ cards: [ cardIDs[c1], cardIDs[c2], cardIDs[c3], cardIDs[c4], cardIDs[c5] ] }); }
                        }
                    }
                }
            }
        }
    }

    return possibleHandList;
};

exports.getPossibleHands = getPossibleHands;

let determineOptionValue = async (option, possibleHands) => {
    option.value = 0;
    possibleHands.forEach((hand) => {
        let cardsString = cardsStringMiddleware.getCardsString(hand.cards);
        if (storedHandValues.hasOwnProperty(cardsString)) { option.value += storedHandValues[cardsString]; }
        else {
            let value = handValueMiddleware.getHandValue(hand).value.Value;
            storedHandValues[cardsString] = value;
            option.value += value;
        }
    });
    option.value = option.value / possibleHands.length;
};