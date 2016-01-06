var express = require('express');
var app = express();

app.get('/json', function (req, res) {
    res.json({
        a: 1
    });
});

app.listen(5000);