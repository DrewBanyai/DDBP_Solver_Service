exports.getCardsString = (cards) => {
    let string = "";
    cards.forEach((card) => string += card);
    return string;
};