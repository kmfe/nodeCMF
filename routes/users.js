var express = require('express');
var router = express.Router();
var middleware = require('../middleware/user');


//注册页面
router.get('/reg', middleware.checkNotLogin, function (req, res) {
    if (req.session.user) {
        res.redirect('/index');
    } else {
        res.render('users/reg', {});
    }
});

//登录页面
router.get('/login', middleware.checkNotLogin, function (req, res) {
    if (req.session.user) {
        req.flash('error', '您已登录，不能重复登录~');
        res.redirect('back');
    } else {
        res.render('users/login', {});
    }
});

//提交注册
router.post('/reg', middleware.checkNotLogin, function (req, res) {
    var user = req.body;
    new Model('User')(user).save(function (err, user) {
        if (user) {
            res.redirect('/users/login');
        } else {
            console.log('数据库保存出错', err);
            res.redirect('/users/reg');
        }
    })
});

//提交登录
router.post('/login', middleware.checkNotLogin, function (req, res) {
    var user = req.body;
    Model('User').findOne(user, function (err, user) {
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/users/login');
        }
        req.session.user = user;
        req.flash('success', '登录成功');
        res.redirect('/users/index');
    })
});

//登录成功
router.get('/index', middleware.checkLogin, function (req, res) {
    res.render('users/index');
});

//退出登录
router.get('/logout', middleware.checkLogin, function (req, res) {
    req.flash('success', '退出成功');
    req.session.user = null;
    res.redirect('/users/login');
});

module.exports = router;
