const possibleHandsMiddleware = require('../middleware/getPossibleHands');

exports.best_move = async (req, res, next) => {
    let optionsList = possibleHandsMiddleware.getPossibleOptions(req.body);
    optionsList.forEach((option) => { possibleHandsMiddleware.getPossibleOptionValues(option); console.log(option); });

    res.status(200).json({
        message: "Success",
        optionsList: optionsList,
    });
};