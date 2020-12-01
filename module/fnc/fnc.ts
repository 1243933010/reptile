
const fs = require('fs');
const path = require('path');


function getTime(type: String): String {
    if (type === 'yearMonthDay') {
        return getYearMonthDay();
    } else {
        return '123'
    }

}

function getYearMonthDay(): String {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year}-${month}-${day}`;
}

function getNowDate(): String {  //获取当前年月日时分秒
    let date = new Date();
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y + M + D + h + m + s;
    // console.log(Y+M+D+h+m+s); 
}



function getFilesList(list: Array<String>): Number {
    let Arr: Array<number> = [];
    list.forEach((val, ind) => {
        Arr.push(Number(val.split('.')[0].slice(4, val.split('.')[0].length)));
    })
    return Math.max(...Arr);
}

enum fileSize {
    minFile = 5000000,
    maxFile = 10000000
}
function writeJson(ctx: any) {
    let url = path.resolve(__dirname, '../info')
    let files = fs.readdirSync(url);
    let filesNum: any = getFilesList(files);
    let data = fs.statSync(path.resolve(__dirname, `../info/info${filesNum}.md`));
    let writeStream;
    if (data.size > fileSize.maxFile) {
        writeStream = fs.createWriteStream(`./module/info/info${filesNum + 1}.md`, { 'flags': 'a' });

    } else {
        writeStream = fs.createWriteStream(`./module/info/info${filesNum}.md`, { 'flags': 'a' });
    }
    let obj: object = {
        host: ctx.request.header.host,
        body: ctx.request.body,
        time: getNowDate(),
        url: ctx.request.url,
        response: ctx.body
    };
    writeStream.write(`${JSON.stringify(obj)} \n \n \n`, 'UTF8');
    writeStream.on('error', (err: string) => {
        console.log(err);
    });
    writeStream.end();
    writeStream.on('finish', () => {
        // console.log('写入完成')
    })
}

module.exports = {
    getTime,
    getNowDate,
    writeJson
}