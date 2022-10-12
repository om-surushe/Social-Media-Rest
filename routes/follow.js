const router = require("express").Router();
const User = require("../models/User");
const Check = require('../middleware/check');

//FOLLOW
router.post("/follow/:id", Check,async (req, res) => {
    if(req.userId != req.params.id){
        try {
            const user = await User.findOne({ _id: req.params.id });
            const current_user = await User.findOne({ _id: req.userId });
            if(!user.followers.includes(req.userId)){
                await user.updateOne({$push:{followers: req.userId}});
                await current_user.updateOne({$push:{followings: req.params.id}});
                res.status(200).send("user has been followd");
            }
            else{
                res.status(403).send("you already follow this user");
            }
        } catch (err) {
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).send("you cannot follow yourself");
    }
});

//UNFOLLOW
router.post("/unfollow/:id", Check,async (req, res) => {
    if (req.userId != req.params.id) {
        try {
            const user = await User.findOne({ _id: req.params.id });
            const current_user = await User.findOne({ _id: req.userId });
            if (user.followers.includes(req.userId)) {
                await user.updateOne({$pull:{followers: req.userId}});
                await current_user.updateOne({$pull:{followings: req.params.id}});
                res.status(200).send("user has been unfollowd");
            } else {
                res.status(403).send("you don't follow this user");
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).send("you cannot unfollow yourself");
    }
});

module.exports = router;