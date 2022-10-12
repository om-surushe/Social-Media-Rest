const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Check = require('../middleware/check');

//NEW POST
router.post("/posts", Check, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });

        const newPost = new Post(
            {
                userId: user._id,
                title: req.body.title,
                desc: req.body.desc
            }
        );

        const post = await newPost.save();

        const post_info = {
            id: post._id,
            title: post.title,
            desc: post.desc,
            createdAt: post.createdAt,
        }

        res.status(200).json(post_info);
    } catch (err) {
        res.status(500).json(err)
    }
});

// DELETE POST
router.delete("/posts/:id", Check, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id });

        if (post.userId == req.userId) {
            await post.deleteOne();
            res.status(200).send("post deleted");
        }
        else {
            res.status(403).send("you don't have permission to delete this post");
        }

    } catch (err) {
        res.status(500).json(err)
    }
});

// LIKE POST
router.post("/like/:id", Check, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id });

        if (!post.likes.includes(req.userId)) {
            await post.updateOne({ $push: { likes: req.userId } });
            res.status(200).json("The post has been liked");
        }
        else {
            res.status(200).json("The post has already been liked");
        }

    } catch (err) {
        res.status(500).json(err)
    }
});

// UNLIKE POST
router.post("/unlike/:id", Check, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id });

        if (post.likes.includes(req.userId)) {
            await post.updateOne({ $pull: { likes: req.userId } });
            res.status(200).json("The post has been unliked");
        }
        else {
            res.status(200).json("The post has already been unliked");
        }

    } catch (err) {
        res.status(500).json(err)
    }
});

// COMMENT POST
router.post("/comment/:id", Check, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id });

        if (post) {
            const newComment = new Comment(
                {
                    userId: req.userId,
                    comment: req.body.comment,
                }
            );

            const comment = await newComment.save();

            await post.updateOne({ $push: { comments: comment } });
            res.status(200).json(comment._id);
        }
        else {
            res.status(403).json("post not found");
        }

    } catch (err) {
        res.status(500).json(err)
    }
});

// GET POST
router.get("/posts/:id", Check, async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id });

        if (post) {
            const current_post = {
                likes: post.likes.length,
                comments: post.comments.length,
            }
            res.status(200).json(current_post);
        }
        else {
            res.status(403).json("post not found");
        }

    } catch (err) {
        res.status(500).json(err)
    }
});

// GET ALL POST
router.get("/all_posts", Check, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.userId }).sort({ createdAt: "descending" });

        const posts_array = posts.map((post) => {
            return {
                id: post._id,
                title: post.title,
                desc: post.desc,
                createdAt: post.createdAt,
                likes: post.likes.length,
                comments: post.comments.map((comment) => {
                    return{
                        userId: comment.userId, 
                        comment: comment.comment,
                    }
                }),
            }
        });
        res.status(200).json(posts_array);
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router;