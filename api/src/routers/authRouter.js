const express = require('express')
const router = new express.Router()
const googleUtil = require('../utils/googleUtil');
const User = require('../models/userModel')

router.post('/auth/google', async (req, res) => {
    try {
        const code = req.body.code;
        const tokens = await googleUtil.getTokensByCode(code)
        const userInfo = await googleUtil.getProfileInfo(tokens)
        let user = await User.findOne({ email: userInfo.email})

        if (!user) {
            /* Se è la prima volta che l'utente accede lo salvo nel DB */
            user = new User({ ...userInfo })
        }

        await googleUtil.createDriveshowFolder(tokens)

        user.googleToken = tokens
        await user.save()
        const jwtToken = await user.generateAuthToken()

        res.send({ jwtToken, userInfo });
    } catch (e) {
        res.send({ error: e.toString() })
    }
});

module.exports = router 