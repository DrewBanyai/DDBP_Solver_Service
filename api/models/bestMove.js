const mongoose = require('mongoose');

const bestMoveSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cardString: String,
    held: [],
    value: Number,
});

module.exports = mongoose.model("BestMove", bestMoveSchema);