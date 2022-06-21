const Message = require("../models/msgModels");
const User = require("../models/userModels");
const Image = require("../models/imageModel");
const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/AppError");
const LastMessage = require("../models/lastMessageModel");
const jwt = require("jsonwebtoken");

exports.signUp = catchAsyncError(async (req, res, next) => {

    const value = await User.findOne({ phone: req.body.phone });
    if (value) {
        res.status(401).json({
            status: false,
            message: "User is already signup.",
        });
    } else {
        const data = await User.create({
            name: req.body.name,
            phone: req.body.phone
        });
        res.status(200).json({
            status: true,
            message: "Successfully SignUp"
        });
    }
})
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

exports.signIn = catchAsyncError(async (req, res, next) => {
    if (!req.body.phone) {
        return res.status(401).json({
            status: false,
            message: "Please enter phone number.",
        });
    }
    let data = await User.findOne({ phone: req.body.phone }).select(['_id', 'name', 'phone']);

    if (data) {
        const token = signToken(data._id);

        res.status(200).json({
            status: true,
            message: "Successfully Signin",
            data,
            token,
        });
    } else {
        res.status(401).json({
            status: false,
            message: "Please enter valid details.",
        });
    }

})


exports.contactSync = catchAsyncError(async (req, res, next) => {
    let syncNumber = req.body.number;
    let userNumber = await User.findOne({ _id: req.user._id }).select(['_id', 'name', 'phone']);
    let data = [];
    for (var t = 0; t < syncNumber.length; t++) {
        let value = await User.findOneAndUpdate(
            { phone: syncNumber[t].phone },
            {
                name: syncNumber[t].name,
            },
            { new: true }
        ).select(['_id', 'name', 'phone']);
        if (value !== null) {
            if (value._id.toString() !== userNumber._id.toString()) {
                data.push(value);
            }
        }
    }
    res.status(200).json({
        status: true,
        data,

    });
})

exports.getChatUser = catchAsyncError(async (req, res, next) => {
    let chatUsers = await LastMessage.find({ receiver: req.user._id });
    let pushRecevier = [];
    for (var i = 0; i < chatUsers.length; i++) {
        let recevierValue = await User.find({ _id: chatUsers[i].sender }).select(['_id', 'name', 'phone', 'lastMessage', 'time', 'sorting', 'lastSeen', 'isOnline']);
        pushRecevier.push(...recevierValue);
    }
    let receiver = pushRecevier.sort((a, b) => {
        return b.sorting - a.sorting;
    });
    let chatUser = await LastMessage.find({ sender: req.user._id });
    let values = [];
    for (var i = 0; i < chatUser.length; i++) {
        let value = await User.find({ _id: chatUser[i].receiver }).select(['_id', 'name', 'phone', 'lastMessage', 'time', 'sorting', 'lastSeen', 'isOnline']);
        values.push(...value);
    }
    let sender = values.sort((a, b) => {
        return b.sorting - a.sorting;
    });
    for (var commonAry = 0; commonAry < sender.length; commonAry++) {
        receiver.push(sender[commonAry]);
    }
    function uniq(a) {
        return a.sort().filter(function (item, pos, ary) {
            return !pos || item._id.toString() != ary[pos - 1]._id.toString();
        });
    }
    let data = uniq(receiver).sort((a, b) => {
        return b.sorting - a.sorting;
    });
    res.status(200).json({
        status: true,
        data,
    });
})

exports.isOnline = catchAsyncError(async (req, res, next) => {
    let data = await User.findOneAndUpdate(
        { _id: req.user._id },
        { isOnline: true },
        { new: true }
    ).select(['_id', 'name', 'phone', 'lastMessage', 'time', 'sorting', 'lastSeen', 'isOnline']);

    res.status(200).json({
        status: true,
        data,
    });

})


exports.isOffline = catchAsyncError(async (req, res, next) => {
    let hr = new Date().getHours();
    let min = new Date().getMinutes();
    let time = `${hr}` + ":" + `${min}`;
    let data = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
            lastSeen: time,
            isOnline: false,
        },
        { new: true }
    ).select(['_id', 'name', 'phone', 'lastMessage', 'time', 'sorting', 'lastSeen', 'isOnline']);
    res.status(200).json({
        status: true,
        data,
    });

})