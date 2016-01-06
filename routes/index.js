var express = require('express');
var router = express.Router();
var middleware = require('../middleware/user');

router.get('/', function (req, res) {
    if (req.session.user) {
        res.redirect('/users/index');
    } else {
        res.redirect('/users/reg');
    }
});

module.exports = router;
