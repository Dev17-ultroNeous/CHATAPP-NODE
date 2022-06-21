const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
        },
        type: {
            type: String,
        },
        message: {
            type: String,
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
