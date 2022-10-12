const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            max: 250
        },
        desc: {
            type: String,
            max: 500,
        },
        comments: {
            type: Array,
            default: [],
        },
        likes: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);