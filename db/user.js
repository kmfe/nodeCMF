var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://127.0.0.1/infonx');

db.connection.on('open', function () {
    console.log('数据库连接成功');
});
db.connection.on('error', function (err) {
    if (err) {
        console.log('数据库连接失败', err);
    }
});
global.Model = function (modName) {
    return mongoose.model(modName);
};

//创建users 数据模型
mongoose.model('User', new mongoose.Schema({
    username: {type: String, trim: true},
    password: String
}));

//创建客户数据模型
mongoose.model('Clients', new mongoose.Schema({
    company: String,
    position: String,
    name: String,
    sex: Number,
    contact: String,
    email: {
        type: String,
        default: ''
    },
    qq: {
        type: String,
        default: ''
    },
    intention: String,
    data: Array,
    time: String,
    user: {type: String, ref: 'User'}
}));

//创建文件数据模型
mongoose.model('Finances', new mongoose.Schema({
    data: String,
    time: String,
    title: String,
    user: {type: String, ref: 'User'},
    content: Array
}));

//创建分类模型
mongoose.model('Sorts', new mongoose.Schema({
    name: String,
    sortId: Number
}));

//创建文章数据模型
mongoose.model('Articles', new mongoose.Schema({
    title: String,
    date: String,
    sortName: String,

    sortNum: {type: Number, default: 1},
    author: {type: String, ref: 'User'},
    desc: {type: String, default: ''},
    state: {type: Object, default:{}},

    content: String,
    pv: {type: Number, default: 0},
    appendix: {type: Array, default: []}  //附件
}));

