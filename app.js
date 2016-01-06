var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var moment = require('moment');

var routes = require('./routes/index');
var users = require('./routes/users');
var crm = require('./routes/crm');
var finance = require('./routes/finance');
var rules = require('./routes/rules');

var app = express();
//数据库配置
require('./db/user.js');
app.use(flash());
app.use(session({
    name: 'connect_id',
    secret: 'infonx',
    cookie: {maxAge: 60 * 1000 * 60 * 24},
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({  //使用connect-mongo之后，session参数中必须添加该参数
        url: 'mongodb://127.0.0.1/infonx'
    })
}));

//配置公共变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();  //req.flash的取值差异
    res.locals.error = req.flash('error').toString();
    next();
});

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public/img', 'fav.ico')));
app.use(logger('dev'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false,limit:'50mb'}));
app.use(cookieParser());

//设置静态文件服务器，并设置缓存时间，虚拟静态路径
app.use(express.static(path.join(__dirname, 'public'),{maxAge:7200000}));
app.use('/static',express.static(path.join(__dirname, 'upload'),{maxAge:7200000}));

app.use('/', routes);
app.use('/users', users);
app.use('/crm', crm);
app.use('/finance', finance);
app.use('/rules', rules);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
