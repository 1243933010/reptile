"use strict";
var fs = require('fs');
var path = require('path');
function getTime(type) {
    if (type === 'yearMonthDay') {
        return getYearMonthDay();
    }
    else {
        return '123';
    }
}
function getYearMonthDay() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year + "-" + month + "-" + day;
}
function getNowDate() {
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
    // console.log(Y+M+D+h+m+s); 
}
function getFilesList(list) {
    var Arr = [];
    list.forEach(function (val, ind) {
        Arr.push(Number(val.split('.')[0].slice(4, val.split('.')[0].length)));
    });
    return Math.max.apply(Math, Arr);
}
var fileSize;
(function (fileSize) {
    fileSize[fileSize["minFile"] = 5000000] = "minFile";
    fileSize[fileSize["maxFile"] = 10000000] = "maxFile";
})(fileSize || (fileSize = {}));
function writeJson(ctx) {
    var url = path.resolve(__dirname, '../info');
    var files = fs.readdirSync(url);
    var filesNum = getFilesList(files);
    var data = fs.statSync(path.resolve(__dirname, "../info/info" + filesNum + ".md"));
    var writeStream;
    if (data.size > fileSize.maxFile) {
        writeStream = fs.createWriteStream("./module/info/info" + (filesNum + 1) + ".md", { 'flags': 'a' });
    }
    else {
        writeStream = fs.createWriteStream("./module/info/info" + filesNum + ".md", { 'flags': 'a' });
    }
    var obj = {
        host: ctx.request.header.host,
        body: ctx.request.body,
        time: getNowDate(),
        url: ctx.request.url,
        response: ctx.body
    };
    writeStream.write(JSON.stringify(obj) + " \n \n \n", 'UTF8');
    writeStream.on('error', function (err) {
        console.log(err);
    });
    writeStream.end();
    writeStream.on('finish', function () {
        // console.log('写入完成')
    });
}
module.exports = {
    getTime: getTime,
    getNowDate: getNowDate,
    writeJson: writeJson
};
