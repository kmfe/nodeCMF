var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/add', function (req, res) {
    res.render('crm/add', {client: {}});
});

router.get('/view', function (req, res) {
    Model('Clients').find().exec(function (err, clients) {
        if (err) {
            console.log(err);
        } else {
            res.render('crm/view');
        }
    });
});

//提供数据接口
router.get('/data', function (req, res) {
    Model('Clients').find().exec(function (err, clients) {
        if (err) {
            console.log(err);
        } else {
            res.send(clients)
        }
    });
});

//客户资料上传
var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../upload')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});
var upload = multer({storage: storage});

router.post('/add', upload.array('data', 12), function (req, res) {
    var client = req.body;
    var id = client.id;

    if (id) { //有id表示更新客户资料
        var updateObj = {
            company: client.company,
            position: client.position,
            name: client.name,
            contact: client.contact,
            email: client.email,
            qq: client.qq,
            intention: client.intention
        };
        new Model('Clients').update({_id: id}, {$set: updateObj}, function (err) {
            if (err) {
                res.redirect('back');
            } else {
                res.redirect('/crm/detail/' + id);
            }
        })
    } else {
        //上传图片
        client.data = [];
        for (var i = 0; i < req.files.length; i++) {
            client.data.push(path.join('/static', req.files[i].filename));
        }
        //时间
        var date = new Date();
        client.time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

        //上传人
        client.user = req.session.user.username;
        new Model('Clients')(client).save(function (err, client) {
            if (client) {
                res.redirect('/crm/view');
            } else {
                res.redirect('/crm/add');
            }
        })
    }
});

//客户资料查看
router.get('/detail/:id', function (req, res) {
    var id = req.params.id;
    Model('Clients').findById(id, function (err, client) {
        res.render('crm/detail', {client: client});
    })
});

//客户资料修改
router.get('/edit/:id', function (req, res) {
    var id = req.params.id;
    Model('Clients').findById(id, function (err, client) {
        res.render('crm/add', {client: client});
    })
});

//客户资料删除
router.get('/del/:id', function (req, res) {
    var id = req.params.id;
    Model('Clients').remove({_id: id}, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/crm/view');
        }
    })
});

module.exports = router;
