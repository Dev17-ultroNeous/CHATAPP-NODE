const express = require("express");
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");
const multer = require("multer");
const sharp = require("sharp");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const { validateTrims, validateSignin } = require("../utils/validation")

let protect = async (req, res, next) => {

    let token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else {
        return res.status(401).json({
            status: false,
            message: "You are not logged in. Please login to access.",
        });
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    var user = await User.findById(id);
    req.user = user;
    next();
};

const router = express.Router();

router.post("/signup", validateTrims, userController.signUp);

router.post("/signin", validateSignin, userController.signIn);

router.post("/messages", messageController.messageSend);

router.post("/getmessages", messageController.messageGet);

router.post("/contactsync", protect, userController.contactSync);

router.post("/getchatuser", protect, userController.getChatUser);

router.post("/isonline", protect, userController.isOnline);

router.post("/isoffline", protect, userController.isOffline);

router.post("/bluetrick", messageController.blueTrick);

module.exports = router;