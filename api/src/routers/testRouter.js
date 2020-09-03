const express = require('express')
const router = new express.Router()

router.get('/ping', function (req, res) {
    res.send('hello')
});

module.exports = router 