
const fs = require('fs');
const path = require('path');
const tokenConfig = { privateKey: 'yue' };
const jwt = require('jsonwebtoken');

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



function getFilesList(list: Array<String>): Number {//返回info系列文件最新的那个文件
    let Arr: Array<number> = [];
    list.forEach((val, ind) => {
        Arr.push(Number(val.split('.')[0].slice(4, val.split('.')[0].length)));
    })
    return Math.max(...Arr);
}

enum fileSize {
    minFile = 5000000,//5m
    maxFile = 10000000//10m
}
interface writeJsonFace{
    request:{
        header:{
            host:number
        };
        url:number;
        body:object;
    };
    body:object;
}
function writeJson(ctx:writeJsonFace) {
    let url = path.resolve(__dirname, '../info') //获取info文件夹绝对路径
    let files = fs.readdirSync(url);//读取文件夹获取文件名数组
    let filesNum: any = getFilesList(files); //通过上面的函数获取最新的文件夹名字
    let data = fs.statSync(path.resolve(__dirname, `../info/info${filesNum}.md`));  //读取最新info文件的文件信息
    let writeStream;
    if (data.size > fileSize.maxFile) { //判断最新文件的大小是否超出设置额度,超出在新的info文件建立写入流，否则在当前文件建立写入流
        writeStream = fs.createWriteStream(`./module/info/info${filesNum + 1}.md`, { 'flags': 'a' });
    } else {
        writeStream = fs.createWriteStream(`./module/info/info${filesNum}.md`, { 'flags': 'a' });
    }

    //开始写入数据，写入数据有ip地址、请求参数、当前时间、请求url路径、返回信息
    writeStream.write(`host:${ctx.request.header.host} \n`,'UTF-8')
    writeStream.write(`body:${JSON.stringify(ctx.request.body)} \n`,'UTF-8')
    writeStream.write(`time:${getNowDate()} \n`,'UTF-8')
    writeStream.write(`url:${ctx.request.url} \n`,'UTF-8')
    writeStream.write(`response:${JSON.stringify(ctx.body)} \n \n \n`,'UTF-8')
    writeStream.on('error', (err: string) => {//写入报错
        console.log(err);
    });
    writeStream.end();//写入结束
    writeStream.on('finish', () => { //写入完成
        // console.log('写入完成')
    })
}



enum returnCode {
    success = 200,
    tokenFailure = 401,
    error = 400
  }
  function returnMsg(ctx:any,status:any,msg:string,data:any):void{
    ctx.body = {code:returnCode[status],msg,data}
  }
  
  let verificationToken = (ctx: any): any => {
    try {
      const token: String = ctx.get('Authorization');
      let data: String;
      if (token === '') {
        ctx.body = { code: returnCode.error, message: '未登录',data:null};
        return { flog: false, msg: '未登录', data: null }
      } else {
        try {
          data = jwt.verify(token.split(' ')[1], tokenConfig.privateKey)
          return { flog: true, data, msg: 'success' }
        } catch (error) {
          // console.log(error)
          ctx.body = { code: returnCode.tokenFailure, message: 'token过期',data:null};
          return { flog: false, msg: 'token过期', data: null }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
module.exports = {
    getTime,
    getNowDate,
    writeJson,
    returnMsg,
    verificationToken,
    returnCode
}