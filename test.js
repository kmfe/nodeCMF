var ids = require('short-id');
ids.configure({
    length: 1,          // The length of the id strings to generate
    algorithm: 'sha1',  // The hashing algoritm to use in generating keys
    salt: Math.random   // A salt value or function
});

console.log(ids.store('5677b963aaf0a29c0cda4860'));  // "8dbd46"
console.log(ids.fetch(ids.store('5677b963aaf0a29c0cda4860')));  // 'foo'

ids.invalidate('8dbd46');
ids.fetch('8dbd46');  // undefined

//console.log(ids.generate('5677b963aaf0a29c0cda4860'));

var encoding = require('encoding');
console.log(Buffer.isEncoding('上海市扔了吗','utf-8'));
console.log(encoding.convert('上海市扔了吗','utf8').toString());

var fs = require('fs');
var iconv = require('iconv-lite');

fs.readFile('upload/csv/1450765420110.csv',function(err,data){
    //console.log(Buffer.);
    var str1 = iconv.decode(data,'gbk');
    console.log(iconv.encode(str1,'utf8'));
    //var str2 = iconv.encode(str1,)
});
