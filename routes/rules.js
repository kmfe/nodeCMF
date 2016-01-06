var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('rules/list');
});
router.get('/add', function (req, res) {
    res.render('rules/add',{article:{}});
});

//添加文章
var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../upload/article')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});
var upload = multer({storage: storage});

/*
 * 单独处理文章附件
 * 上传文件之后给客户端响应压缩后的文件
 * */
var appendix = [];
var zipper = require("zip-local");
var zip = [];

router.post('/addinx', upload.array('file'), function (req, res) {
    appendix = appendix.concat(req.files);
    console.log(req.files);
    for(var i=0;i<req.files.length;i++){
        (function(index){
            //同步压缩文件
            zipper.sync.zip(req.files[index].path).compress().save('../upload/article/'+req.files[index].filename+'.zip',function(err){
                if(err){
                    console.log('error',err);
                }else{
                    console.log('压缩成功~');
                }
            });
        })(i);
    }

    for(var i=0;i<req.files.length;i++){
        zip.push(req.files[i].path+'.zip');
    }
    res.send(zip);
});

//添加|编辑文章
router.post('/add', upload.array('file'), function (req, res) {
    var article = req.body;
    article.appendix = appendix;
    article.state = JSON.parse(req.body.state);
    var id = article.id;
    if(id){ //更新专用id
        var updateObj = {
            title: article.title,
            date: article.date,
            sortName: article.sortName,
            desc: article.desc,
            content: article.content,
            author: article.author
        };
        new Model('Articles').update({_id: id}, {$set: updateObj}, function (err) {
            if (err) {
                res.redirect('back');
            } else {
                res.redirect('/rules/view/' + id);
            }
        })
    }else{
        new Model('Articles')(article).save(function (err, article) {
            if (err) {
                console.log('error', err);
            } else {
                appendix = [];
            }
        });
        res.send('完成~');
    }
});

//文章列表
router.get('/list', function (req, res) {
    res.render('rules/list');
});

router.get('/data', function (req, res) {
    Model('Articles').find(function (err, article) {
        if (err) {
            console.log('error', err);
        } else {
            res.send(article);
        }
    })
});

//文章详细
router.get('/view/:id', function (req, res) {
    var id = req.params.id;
    Model('Articles').findById(id, function (err, article) {
        if (err) {
            console.log(err);
        } else {
            res.render('rules/view', {article: article});
        }
    })
});

//编辑文章 -> 添加文章
router.get('/edit/:id', function (req, res) {
    var id = req.params.id;
    Model('Articles').findById(id, function (err, article) {
        if (err) {
            console.log(err);
        } else {
            res.render('rules/add', {article: article});
        }
    })
});


//删除文章
router.get('/del/:id', function (req, res) {
    var id = req.params.id;
    Model('Articles').remove({_id: id}, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/rules/list');
        }
    })
});

module.exports = router;
