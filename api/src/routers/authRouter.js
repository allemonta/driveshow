const express = require('express')
const router = new express.Router()
const googleOAuth = require('../utils/googleOAuth');

router.post('/auth/google', async (req, res) => {
    try {
        const code = req.body.code;
        const profile = await googleOAuth.getProfileInfo(code);

        const user = {
            googleId: profile.sub,
            name: profile.name,
            firstName: profile.given_name,
            lastName: profile.family_name,
            email: profile.email,
            profilePic: profile.picture,
        };

        res.send({ user });
    } catch (e) {
        res.send({ error: e.toString() })
    }
});

module.exports = router 