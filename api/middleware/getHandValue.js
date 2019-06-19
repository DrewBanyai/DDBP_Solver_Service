let cardIDs = [
    "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "TS", "JS", "QS", "KS", 
    "AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "TC", "JC", "QC", "KC", 
    "AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "TD", "JD", "QD", "KD", 
    "AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "TH", "JH", "QH", "KH", 
];

exports.cardIDs = cardIDs;

const cardValues = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K" ];

const Values = {
    ROYAL_FLUSH:        { Type: "Royal Flush", Value: 800 },
    FOUR_ACES:          { Type: "Four Aces", Value: 160 },
    FOUR_234:           { Type: "Four 2s, 3s, or 4s", Value: 80 },
    STRAIGHT_FLUSH:     { Type: "Straight Flush", Value: 50 },
    FOUR_5_THROUGH_K:   { Type: "Four 5s Through Kings", Value: 50 },
    FULL_HOUSE:         { Type: "Full House", Value: 10 },
    FLUSH:              { Type: "Flush", Value: 7 },
    STRAIGHT:           { Type: "Straight", Value: 5 },
    THREE_OF_A_KIND:    { Type: "Three of a Kind", Value: 3 },
    TWO_PAIR:           { Type: "Two Pair", Value: 1 },
    JACKS_OR_BETTER:    { Type: "Jacks or Better", Value: 1 },
    NOTHING:            { Type: "No Win", Value: 0 },

    //  Unused
    //FOUR_A_ANY_234:     { Type: "Four Aces With Any 2, 3, 4", Value: 400 },
    //FOUR_234_WITH_A:    { Type: "Four 2s, 3s, 4s with Ace", Value: 160 },
    //ROYAL_STRAIGHT:     { Type: "Royal Straight", Value: 35 },
    //FOUR_OF_A_KIND:     { Type: "Four of a Kind", Value: 50 },
};

exports.HandValues = Values;

//  Returns the value of the hand, given the current math sheet
exports.getHandValue = (hand) => {
    hand.cards.sort();
    
    //  If we've gotten this far, we know the hand is valid, so we should test it against the different types of value returns, starting with the largest
    if (GetFourAcesAny234(hand))        { return hand; }
    if (GetRoyalFlushValue(hand))       { return hand; }
    if (GetFourAcesValue(hand))         { return hand; }
    if (GetFour234WithAceValue(hand))   { return hand; }
    if (GetFour234Value(hand))          { return hand; }
    if (GetFour5ThroughKValue(hand))    { return hand; }
    if (GetStraightFlushValue(hand))    { return hand; }
    if (GetFullHouseValue(hand))        { return hand; }
    if (GetFlushValue(hand))            { return hand; }
    if (GetStraightValue(hand))         { return hand; }
    if (GetThreeOfAKindValue(hand))     { return hand; }
    if (GetTwoPairValue(hand))          { return hand; }
    if (GetJacksOrBetterValue(hand))    { return hand; }

    hand.value = Values.NOTHING;
    return hand; 
};

//  Value check functions
function GetFourAcesAny234(hand) {
    if (!GetFourAcesValue(hand)) { return (hand.value = null); }
    
    for (let i = 0; i < hand.cards.length; ++i) {
        if ((hand.cards[i][0] === "2") || (hand.cards[i][0] === "3") || (hand.cards[i][0] === "4")) {
            return (hand.value = Values.FOUR_A_ANY_234); 
        }
    }

    return (hand.value = null);
}

function GetRoyalFlushValue(hand) {
    if (!GetStraightFlushValue(hand))  { return (hand.value = null); }
    if (!GetRoyalStraightValue(hand))  { return (hand.value = null); }

    hand.value = Values.ROYAL_FLUSH;
    return hand.value;
}

function GetFourAcesValue(hand) {
    return ((hand.value = (HandHasFourOf(hand, "A") ? Values.FOUR_ACES : 0)));
}

function GetFour234WithAceValue(hand) {
    if (!GetFour234Value(hand)) { return (hand.value = null); }
    return (hand.value = (HandContains(hand, "A") ? Values.FOUR_234_WITH_A : 0));
}

function GetFour234Value(hand) {
    if (HandHasFourOf(hand, "2")) { return (hand.value = Values.FOUR_234); }
    if (HandHasFourOf(hand, "3")) { return (hand.value = Values.FOUR_234); }
    if (HandHasFourOf(hand, "4")) { return (hand.value = Values.FOUR_234); }
    return (hand.value = null);
}

function GetFour5ThroughKValue(hand) {
    if (HandHasFourOf(hand, "5")) { return (hand.value = Values.FOUR_5_THROUGH_K); }
    if (HandHasFourOf(hand, "6")) { return (hand.value = Values.FOUR_5_THROUGH_K); }
    if (HandHasFourOf(hand, "7")) { return (hand.value = Values.FOUR_5_THROUGH_K); }
    if (HandHasFourOf(hand, "8")) { return (hand.value = Values.FOUR_5_THROUGH_K); }
    if (HandHasFourOf(hand, "9")) { return (hand.value = Values.FOUR_5_THROUGH_K); }
    if (HandHasFourOf(hand, "T")) { return (hand.value = Values.FOUR_5_THROUGH_K); }
    if (HandHasFourOf(hand, "J")) { return (hand.value = Values.FOUR_5_THROUGH_K); }
    if (HandHasFourOf(hand, "Q")) { return (hand.value = Values.FOUR_5_THROUGH_K); }
    if (HandHasFourOf(hand, "K")) { return (hand.value = Values.FOUR_5_THROUGH_K); }
    return (hand.value = null);
}

function GetStraightFlushValue(hand) {
    if (!GetFlushValue(hand))     { return (hand.value = null); }
    if (!GetStraightValue(hand))  { return (hand.value = null); }

    return (hand.value = Values.STRAIGHT_FLUSH);
}

function GetFullHouseValue(hand) {
    let valueCounts = GetValueCounts(hand);
    if ((valueCounts[0] === 2) && (valueCounts[1] === 3)) { return (hand.value = Values.FULL_HOUSE); }
    return (hand.value = null);
}

function GetFlushValue(hand) {
    if (hand.cards[0][1] !== hand.cards[1][1]) { return (hand.value = null); }
    if (hand.cards[1][1] !== hand.cards[2][1]) { return (hand.value = null); }
    if (hand.cards[2][1] !== hand.cards[3][1]) { return (hand.value = null); }
    if (hand.cards[3][1] !== hand.cards[4][1]) { return (hand.value = null); }

    return (hand.value = Values.FLUSH);
}

function GetStraightValue(hand) {
    //  We could do this more programatically, but let's just check the 10 possibilities manually...
    if ((hand.cards[0][0] === "2") && (hand.cards[1][0] === "3") && (hand.cards[2][0] === "4") && (hand.cards[3][0] === "5") && (hand.cards[4][0] === "A")) { return (hand.value = Values.STRAIGHT); }
    if ((hand.cards[0][0] === "2") && (hand.cards[1][0] === "3") && (hand.cards[2][0] === "4") && (hand.cards[3][0] === "5") && (hand.cards[4][0] === "6")) { return (hand.value = Values.STRAIGHT); }
    if ((hand.cards[0][0] === "3") && (hand.cards[1][0] === "4") && (hand.cards[2][0] === "5") && (hand.cards[3][0] === "6") && (hand.cards[4][0] === "7")) { return (hand.value = Values.STRAIGHT); }
    if ((hand.cards[0][0] === "4") && (hand.cards[1][0] === "5") && (hand.cards[2][0] === "6") && (hand.cards[3][0] === "7") && (hand.cards[4][0] === "8")) { return (hand.value = Values.STRAIGHT); }
    if ((hand.cards[0][0] === "5") && (hand.cards[1][0] === "6") && (hand.cards[2][0] === "7") && (hand.cards[3][0] === "8") && (hand.cards[4][0] === "9")) { return (hand.value = Values.STRAIGHT); }
    if ((hand.cards[0][0] === "6") && (hand.cards[1][0] === "7") && (hand.cards[2][0] === "8") && (hand.cards[3][0] === "9") && (hand.cards[4][0] === "T")) { return (hand.value = Values.STRAIGHT); }
    if ((hand.cards[0][0] === "7") && (hand.cards[1][0] === "8") && (hand.cards[2][0] === "9") && (hand.cards[3][0] === "J") && (hand.cards[4][0] === "T")) { return (hand.value = Values.STRAIGHT); }
    if ((hand.cards[0][0] === "8") && (hand.cards[1][0] === "9") && (hand.cards[2][0] === "J") && (hand.cards[3][0] === "Q") && (hand.cards[4][0] === "T")) { return (hand.value = Values.STRAIGHT); }
    if ((hand.cards[0][0] === "9") && (hand.cards[1][0] === "J") && (hand.cards[2][0] === "K") && (hand.cards[3][0] === "Q") && (hand.cards[4][0] === "T")) { return (hand.value = Values.STRAIGHT); }
    if ((hand.cards[0][0] === "A") && (hand.cards[1][0] === "J") && (hand.cards[2][0] === "K") && (hand.cards[3][0] === "Q") && (hand.cards[4][0] === "T")) { return (hand.value = Values.STRAIGHT); }
    
    return (hand.value = null);
}

function GetThreeOfAKindValue(hand) {
    let valueCounts = GetValueCounts(hand);
    for (let i = 0; i < valueCounts.length; ++i) {
        if (valueCounts[i] === 3) { return (hand.value = Values.THREE_OF_A_KIND); }
    }
    return (hand.value = null);
}

function GetTwoPairValue(hand) {
    let valueCounts = GetValueCounts(hand);
    valueCounts = valueCounts.filter(count => (count >= 2));
    if (valueCounts < 2) { return (hand.value = null); }
    if ((valueCounts[0] !== 2) || (valueCounts[1] !== 2)) { return (hand.value = null); }
    return (hand.value = Values.TWO_PAIR);
}

function GetJacksOrBetterValue(hand) {
    if (HandContains(hand, "J") >= 2) { return (hand.value = Values.JACKS_OR_BETTER); }
    if (HandContains(hand, "Q") >= 2) { return (hand.value = Values.JACKS_OR_BETTER); }
    if (HandContains(hand, "K") >= 2) { return (hand.value = Values.JACKS_OR_BETTER); }
    if (HandContains(hand, "A") >= 2) { return (hand.value = Values.JACKS_OR_BETTER); }
    return (hand.value = null);
}

//  Used checks with no mathematical return
function GetRoyalStraightValue(hand) {
    if ((hand.cards[0][0] === "A") && (hand.cards[1][0] === "J") && (hand.cards[2][0] === "K") && (hand.cards[3][0] === "Q") && (hand.cards[4][0] === "T")) { 
        return (hand.value = Values.ROYAL_STRAIGHT);
    }
    
    return (hand.value = null);
}

//  Unused
function GetFourOfAKind(hand) {
    let fourOfAKind = false;
    cardValues.forEach((value) => { fourOfAKind = fourOfAKind || HandHasFourOf(hand, value); });
    return (hand.value = (fourOfAKind ? Values.FOUR_OF_A_KIND : 0));
}

//  Helper Functions
function HandHasFourOf(hand, value) {
    valueCount = 0;
    hand.cards.forEach((card) => valueCount += (card[0] === value) ? 1 : 0);
    return (valueCount === 4);
}

function HandContains(hand, value) {
    valueCount = 0;
    hand.cards.forEach((card) => valueCount += (card[0] === value) ? 1 : 0);
    return valueCount;
}

function GetValueCounts(hand) {
    let valueCounts = [];
    cardValues.forEach((value) => {
        let cardCount = HandContains(hand, value);
        if (cardCount) { valueCounts.push(cardCount); }
    });
    valueCounts.sort();
    return valueCounts;
}