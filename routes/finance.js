var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('finance/list');
});
router.get('/add', function (req, res) {
    res.render('finance/add');
});

//接收上传的文件
var multer = require('multer');
var path = require('path');
var CSV = require('node-csv').createParser();
var fs = require('fs');
var iconv = require('iconv-lite');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../upload/csv')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({storage: storage});

router.post('/add', upload.single('csv'), function (req, res) {
    var csv = req.body;

    //上传图片
    csv.data = path.join('/upload/csv', req.file.filename);

    //时间
    var date = new Date();
    csv.time = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
    csv.title = path.basename(req.file.filename,'.csv');
    csv.user = req.session.user.username;

    //分析上传数据
    fs.readFile('../upload/csv/' + req.file.filename, function (err, str) {
        if (err) {
            console.log(err);
        } else {
            var str2 = iconv.decode(str, 'gbk');
            CSV.parse(str2, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    csv.content = data;
                    new Model('Finances')(csv).save(function (err, csv) {
                        if (csv) {
                            res.redirect('/finance/list');
                        } else {
                            res.redirect('/finance/add');
                        }
                    })
                }
            });
        }
    });
});

router.get('/list', function (req, res) {
    Model('Finances').find().exec(function (err, finance) {
        if (err) {
            console.log(err);
        } else {
            res.render('finance/list', {
                data: finance
            });
        }
    });
});

router.get('/view/:id', function (req, res) {
    var id = req.params.id;
    Model('Finances').findById(id).exec(function (err, data) {
        res.render('finance/view', {
            data: data
        });
    })
});

module.exports = router;
