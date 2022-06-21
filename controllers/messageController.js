const Message = require("../models/msgModels");
const User = require("../models/userModels");
const Image = require("../models/imageModel");
const catchAsyncError = require("../utils/catchAsyncErrors");
const AppError = require("../utils/AppError");
const LastMessage = require("../models/lastMessageModel");
const jwt = require("jsonwebtoken");



exports.messageSend = catchAsyncError(async (req, res, next) => {
    if (!req.body.receiverid || !req.body.message || !req.body.time) {
        return res.status(401).json({
            status: "fail",
            message: "Please enter all details.",
        });
    }
    const { senderid, receiverid, message, time, type } = req.body;
    var currentdate = new Date();
    const data = await Message.create({
        message: message,
        sender: senderid,
        receiver: receiverid,
        time: time,
        type: type,
    });

    let lastMessages = await Message.findOne({
        sender: senderid,
        receiver: req.body.receiverid,
    })
        .sort({ createdAt: -1 })
        .exec();

    await User.findOneAndUpdate(
        {
            _id: req.body.receiverid,
        },
        {
            lastMessage: lastMessages.message,
            time: lastMessages.time,
            sorting: currentdate.getTime(),
        },
        { new: true }
    );
    await User.findOneAndUpdate(
        {
            _id: req.body.senderid,
        },
        {
            lastMessage: lastMessages.message,
            time: lastMessages.time,
            sorting: currentdate.getTime(),
        },
        { new: true }
    );
    let check = await LastMessage.findOne({
        sender: senderid,
        receiver: req.body.receiverid,
    });
    if (check) {
        await LastMessage.findOneAndUpdate(
            {
                sender: senderid,
            },
            {
                lastMessage: lastMessages.message,
                time: lastMessages.time,
                sorting: currentdate.getTime(),
            },
            { new: true }
        );
        await LastMessage.findOneAndUpdate(
            {
                sender: receiverid,
            },
            {
                lastMessage: lastMessages.message,
                time: lastMessages.time,
                sorting: currentdate.getTime(),
            },
            { new: true }
        );
    } else {
        await LastMessage.create({
            message: message,
            sender: senderid,
            receiver: receiverid,
            time: time,
            lastMessage: message,
        });
    }
    res.status(200).json({
        data,
    });


})

exports.messageGet = catchAsyncError(async (req, res, next) => {
    if (!req.body.receiverid) {
        return res.status(401).json({
            status: "fail",
            message: "Please enter receiverid.",
        });
    }
    let value = await Message.find({ sender: req.body.senderid, receiver: req.body.receiverid })
    let data = []
    for (var i = 0; i < value.length; i++) {
        let status = await Message.findByIdAndUpdate(
            { _id: value[i]._id.toString() },
            { messagestatus: "1" },
            { new: true }
        );
        data.push(status)
    }
    res.status(200).json({
        status: "Success",
        data,
    });
})