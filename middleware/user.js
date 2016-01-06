//登录之后才能访问
exports.checkLogin = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.flash('error', '您未登录，请登录之后再访问');
        req.redirect('back');
    }
};

//没有登录才可以访问，比如退出等
exports.checkNotLogin = function (req,res,next) {
    if (req.session.user) {  //权限控制，已经是登录状态了
        req.flash('error', '您已登录，不能重复登录~');
        res.redirect('back');   //跳转到上一个页面
    } else {
        next(); //继续执行
    }
};