const router = require("express").Router();
const User = require("../models/User");
const Check = require('../middleware/check');

//USER
router.get("/user", Check, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId });
        const user_profile = {
            username: user.username,
            no_followers: user.followers.length,
            no_following: user.followings.length,
        }
        res.status(200).json(user_profile);
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router;