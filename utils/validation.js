const { check, validationResult } = require("express-validator");

const sendErrorResponse = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: "error",
            message: errors.errors.map((el) => el.msg)[0],
        });
    }

    next();
};


exports.validateTrims = [

    check("name").trim().notEmpty().withMessage("Please enter name."),
    check("phone").trim().notEmpty().withMessage("Please enter phoneNumber."),

    (req, res, next) => {
        sendErrorResponse(req, res, next);
    },

];
exports.validateSignin = [

    check("phone").trim().notEmpty().withMessage("Please enter phoneNumber."),

    (req, res, next) => {
        sendErrorResponse(req, res, next);
    },

]

