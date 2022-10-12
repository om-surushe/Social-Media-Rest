const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        userId:{
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true,
            max: 250
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);