const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        type: {
            type: String,
        },
        message: {
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
        messagestatus: {
            type: String,
            default: '0'
        }
    },
    { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);
module.exports = Message;
