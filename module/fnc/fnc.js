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
    fileSize[fileSize["maxFile"] = 10000000] = "maxFile"; //10m
})(fileSize || (fileSize = {}));
function writeJson(ctx) {
    var url = path.resolve(__dirname, '../info'); //获取info文件夹绝对路径
    var files = fs.readdirSync(url); //读取文件夹获取文件名数组
    var filesNum = getFilesList(files); //通过上面的函数获取最新的文件夹名字
    var data = fs.statSync(path.resolve(__dirname, "../info/info" + filesNum + ".md")); //读取最新info文件的文件信息
    var writeStream;
    if (data.size > fileSize.maxFile) { //判断最新文件的大小是否超出设置额度,超出在新的info文件建立写入流，否则在当前文件建立写入流
        writeStream = fs.createWriteStream("./module/info/info" + (filesNum + 1) + ".md", { 'flags': 'a' });
    }
    else {
        writeStream = fs.createWriteStream("./module/info/info" + filesNum + ".md", { 'flags': 'a' });
    }
    //开始写入数据，写入数据有ip地址、请求参数、当前时间、请求url路径、返回信息
    writeStream.write("host:" + ctx.request.header.host + " \n", 'UTF-8');
    writeStream.write("body:" + JSON.stringify(ctx.request.body) + " \n", 'UTF-8');
    writeStream.write("time:" + getNowDate() + " \n", 'UTF-8');
    writeStream.write("url:" + ctx.request.url + " \n", 'UTF-8');
    writeStream.write("response:" + JSON.stringify(ctx.body) + " \n \n \n", 'UTF-8');
    writeStream.on('error', function (err) {
        console.log(err);
    });
    writeStream.end(); //写入结束
    writeStream.on('finish', function () {
        // console.log('写入完成')
    });
}
module.exports = {
    getTime: getTime,
    getNowDate: getNowDate,
    writeJson: writeJson
};
