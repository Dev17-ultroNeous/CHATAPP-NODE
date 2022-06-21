const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    image: {
        type: Array,

    }

}, { timestamps: true });

const Image = mongoose.model("image", imageSchema);
module.exports = Image;
