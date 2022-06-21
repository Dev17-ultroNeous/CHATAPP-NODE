const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "User name cannot be empty"]
        },
        phone: {
            type: String,
            required: [true, "User phone Number cannot be empty"]
        },
        lastMessage: {
            type: String,
            default: null
        },
        time: {
            type: String,
            default: null
        },
        sorting: {
            type: String,
            default: null
        },
        lastSeen: {
            type: String,
            default: null
        },
        isOnline: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
