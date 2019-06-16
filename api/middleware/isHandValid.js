const handValueMiddleware = require('../middleware/getHandValue');

exports.isHandValid = (hand) => {
    hand.cards.sort();

    //  If the user sents a cards list with any number other than 5 entries, return -1 to indicate an invalid hand
    if (hand.cards.length != 5) {
        console.log(`User sent a hand with ${hand.cards.length} cards. Could not find hand value. Cards:`);
        console.log(hand.cards);
        hand.value = handValueMiddleware.HandValues.NOTHING;
        hand.error = `User sent a hand with ${hand.cards.length} cards. Could not find hand value.`;
        return false;
    }

    //  If the user sents a cards list with identifiers that don't map to our pattern, return -1 to indicate an invalid hand
    for (let i = 0; i < hand.cards.length; ++i) {
        let cardID = hand.cards[i];
        if (!handValueMiddleware.cardIDs.includes(cardID)) {
            console.log(`User sent a cards object with card ID ${cardID} which does not map to our card list entries names. Could not find hand value. Cards:`);
            console.log(hand.cards);
            hand.value = handValueMiddleware.HandValues.NOTHING;
            hand.error = `User sent a cards object with card ID ${cardID} which does not map to our card list entries names. Could not find hand value.`;
            return false;
        }
    }

    //  If any of the cards included in the list the user posted are identical, return -1 to indicate an invalid hand
    for (let i = 0; i < hand.cards.length - 1; ++i) {
        for (let j = i + 1; j < hand.cards.length; ++j) {
            if (hand.cards[i] === hand.cards[j]) {
                console.log(`User sent a cards object with duplicate cards. Could not find hand value. Cards:`);
                console.log(hand.cards);
                hand.value = handValueMiddleware.HandValues.NOTHING;
                hand.error = `User sent a cards object with duplicate cards. Could not find hand value.`;
                return false;
            }
        }
    }

    return true; 
};