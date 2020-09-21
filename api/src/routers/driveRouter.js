const express = require('express')
const router = new express.Router()
const googleUtil = require('../utils/googleUtil');
const auth = require('../middleware/auth')

router.get('/drive/folders/:folderId', auth, async (req, res) => {
    try {
        const images = await googleUtil.getImages(req.user.googleToken, req.params.folderId)
        res.send(images)
    } catch (e) {
        res.send({ error: e.toString() })
    }
});

router.get('/drive/folders', auth, async (req, res) => {
    try {
        const folders = await googleUtil.getFolders(req.user.googleToken)
        res.send(folders)
    } catch (e) {
        res.send({ error: e.toString() })
    }
});

module.exports = router 