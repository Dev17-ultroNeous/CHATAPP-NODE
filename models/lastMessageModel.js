const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lastMessageSchema = new Schema(
    {
        type: {
            type: String,
        },
        lastMessage: {
            type: String,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
        },
        time: {
            type: String,
        },
        sorting: {
            type: String,
            default: null
        }

    },
    { timestamps: true }
);

const LastMessage = mongoose.model("lastMessage", lastMessageSchema);
module.exports = LastMessage;