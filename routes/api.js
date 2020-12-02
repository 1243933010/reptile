// const Koa = require('koa');
// const MongoClient = require('mongodb').MongoClient;
const DB = require('../module/db')
const jwt = require('jsonwebtoken');
const Router = require('koa-router');
const tokenConfig = { privateKey: 'yue' };
const multer = require('koa-multer');//加载koa-multer模块
const util = require('../module/util');
const interfaceNameObj = require('../module/interfaceName');
const url = require('../module/config')

// const { Db } = require('mongodb');

const router = new Router();

let { getIPAdress, getDay, getSevenTime,getList } = util;

//配置
let storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, 'public/imgs/')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})

let upload = multer({ storage });//调用

let verificationToken = (ctx) => {//验证token
  try {
    const token = ctx.get('Authorization');
    let data;
    if (token === '') {
      return { flog: false, msg: '未登录' }
    } else {
      try {
        data = jwt.verify(token.split(' ')[1], tokenConfig.privateKey)
        return { flog: true, data }
      } catch (error) {
        // console.log(error)
        return { flog: false, msg: 'token过期' }
      }
    }
  } catch (error) {
    console.log(error)
  }
}



router.post(interfaceNameObj.updateProfile, async (ctx) => {//更新头像名字
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: 401, message: `${verificationToken(ctx).msg}` }
    return
  }
  let {username, avatar } = ctx.request.body;
  
  if (username) {
    let updateData = await DB.update('user', { _id:DB.getID(verificationToken(ctx).data.id)}, { username });
    console.log(verificationToken(ctx).data.id)
    if (updateData.result.n) {
      ctx.body = { code: 200, message: '更改名字成功', data: null };
    } else {
      ctx.body = { code: 400, message: '更改名字失败', data: null };
    }
  }
  if (avatar) {
    let updateData = await DB.update('user', { _id:DB.getID(verificationToken(ctx).data.id) }, { avatar });
    // console.log(updateData.result)
    if (updateData.result.n) {
      ctx.body = { code: 200, message: '更改头像成功', data: null };
    } else {
      ctx.body = { code: 400, message: '更改头像失败', data: null };
    }
  }
  // console.log(ctx.request.body);
})   


router.post(interfaceNameObj.login, async (ctx) => {//登录
  if (ctx.request.body) {
    let { username, pwd } = ctx.request.body;
    try {
      let res = await DB.find('user', { username,status:'1' },{status:0,avatar:0,notice:0,workRecordObj:0});
      if (res.length > 0) {
        let obj = res[0];
        // console.log(res)
        if (obj.pwd === pwd) {
          delete obj.pwd;
          let token = jwt.sign({ id:obj._id }, tokenConfig.privateKey, { expiresIn: '7d' })
          obj.token = 'Bearer ' + token;
          ctx.body = { code: 200, message: '成功', data: { userinfo: obj } };
        } else {
          ctx.body = { code: 400, message: '密码错误' };
        }
      } else {
        ctx.body = { code: 400, message: '未找到账号' };
      }
    } catch (error) {
      ctx.body = { code: 400, message: error };
    }
  }
  // console.log(ctx.request.body)

})  

router.post(interfaceNameObj.registered, async (ctx) => {//注册
  // console.log(ctx.request.body);
  // console.log(getIPAdress());
  if (!ctx.request.body.username) {
    ctx.body = { code: 400, message: '请填写用户名' };
    return false;
  }
  if (!ctx.request.body.pwd) {
    ctx.body = { code: 400, message: '请填写密码' };
    return false;
  }
  let data = await DB.find('user', { username: ctx.request.body.username,status:'1' });
  if (data.length) {
    ctx.body = { code: 400, message: '该用户名已被注册' };
    return false;
  }
  ctx.request.body.avatar = `http://${url.network}:3000/imgs/1604565232439.png`;
  ctx.request.body.workRecordObj = {};
  ctx.request.body.notice = [];
  ctx.request.body.mobile = '';
  ctx.request.body.status = '1';
  let status = await DB.insert('user', ctx.request.body);
  if (status.result.n) {
    ctx.body = { code: 200, message: '注册成功', data: null };
  } else {
    ctx.body = { code: 400, message: '出现错误', data: null };
  }
  // console.log(status)
  // console.log('111')
}) 


router.post(interfaceNameObj.updateMessage, async (ctx) => {//更新工作内容(暂未使用)
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: 401, message: `${verificationToken(ctx).msg}` }
    return
  }
  let time = new Date().getTime();
  // console.log(time);
  // console.log(ctx.request.body);
})



router.post(interfaceNameObj.addWorkContent, async (ctx) => {//添加工作内容
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: 401, message: `${verificationToken(ctx).msg}` }
    return
  }
  let { workText, estimatedTime } = ctx.request.body;
  if (!workText) {ctx.body = { code: 400, message: '工作内容不能为空' };return false;}
  if (!estimatedTime) {ctx.body = { code: 400, message: '工作时长不能为空' };return false;}
  let key = getDay();
  try {
    let res = await DB.find('user', { _id:DB.getID(verificationToken(ctx).data.id) });

    let msgObj = {createTime:new Date(),message:'你创建了一个工作内容',flog:false};
    res[0].notice.unshift(msgObj);
    let noticeObj = {['notice']:res[0].notice};
    let status = await DB.update('user',{ _id:DB.getID(verificationToken(ctx).data.id) },noticeObj);
    // console.log(status.result.n);

    let userinfo = res[0];
    ctx.request.body.creatTime = new Date().getTime();
    ctx.request.body.type = '0';
    ctx.request.body.remark = '';
    let obj = {};
    let arr = [];
    if (userinfo.workRecordObj[key]) {
      ctx.request.body.id = (userinfo.workRecordObj[key].length + 1).toString();
      arr = userinfo.workRecordObj[key];
    } else { //如果当天还没有添加过数据，新建一个代表当天的对象
      ctx.request.body.id = '1';
    }
    arr.push(ctx.request.body);
    obj = { [`workRecordObj.${key}`]: arr };
    let type = await DB.update('user', { _id:DB.getID(verificationToken(ctx).data.id) }, obj);
    if (type.result.n) {
      ctx.body = { code: 200, message: '添加成功', data: null };
    } else {
      ctx.body = { code: 400, message: '添加失败', data: null };
    }
  } catch (error) {
    ctx.body = { code: 400, message: error };
  }
}) 


router.post(interfaceNameObj.workDay, async (ctx) => {//获取某天得添加记录
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: 401, message: `${verificationToken(ctx).msg}` };
    return false;
  }
  let time = new Date(ctx.request.body.time).getTime();
  let res = await DB.find('user', { _id:DB.getID(verificationToken(ctx).data.id) });
  // console.log(res)
  if (res[0].workRecordObj[time]) {
    res[0].workRecordObj[time].forEach((val, ind) => {
      val.time = time;
      if (val.type === '0') {
        delete val.remark;
      }
    })
    let arr = res[0].workRecordObj[time].filter(val => !val.deleteStatus);
    // console.log(arr)

    ctx.body = { code: 200, message: 'success', data: arr }
  } else {
    ctx.body = { code: 200, message: '所选择日期没有数据', data: [] }
  }
})


router.post(interfaceNameObj.setWork, async (ctx) => {//修改状态
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: 401, message: `${verificationToken(ctx).msg}` }
    return
  }
  let data = await DB.find('user', { _id:DB.getID(verificationToken(ctx).data.id) });

  let msgObj = {createTime:new Date(),message:'你修改了工作状态',flog:false};
  data[0].notice.unshift(msgObj);
  let noticeObj = {['notice']:data[0].notice};
  let noticeStatus = await DB.update('user',{ _id:DB.getID(verificationToken(ctx).data.id) },noticeObj);
  // console.log(noticeStatus.result.n);

  let msg = data[0].workRecordObj[ctx.request.body.time];
  let endTime = new Date().getTime();
  msg.forEach((val, ind) => {
    if (val.id === ctx.request.body.id) {
      val.type = '1';
      val.remark = ctx.request.body.remark;
      val.endTime = endTime;
      let timeNum = ((endTime - val.creatTime) / 60000).toFixed(1);
      if (timeNum > val.estimatedTime * 1) {
        val.differenceTime = (timeNum - val.estimatedTime * 1).toFixed(1);
        val.endType = '0';
      } else {
        val.differenceTime = (val.estimatedTime * 1 - timeNum).toFixed(1);
        val.endType = '1';
      }
    }
  })
  let obj = {};
  obj = { [`workRecordObj.${ctx.request.body.time}`]: msg };
  let status = await DB.update('user', { _id:DB.getID(verificationToken(ctx).data.id) }, obj);
  if (status.result.n) {
    ctx.body = { code: 200, message: '修改成功', data: null }
  } else {
    ctx.body = { code: 400, message: '错误' }
  }
}) 


router.post(interfaceNameObj.deleteWork, async (ctx) => {//删除某条数据
  // console.log(ctx.request.body);
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: 401, message: `${verificationToken(ctx).msg}` }
    return
  }
  let data = await DB.find('user', {_id:DB.getID(verificationToken(ctx).data.id) });
  // console.log(data[0].workRecordObj[ctx.request.body.time])
  let msgObj = {createTime:new Date(),message:'你删除了一项工作',flog:false};
  data[0].notice.unshift(msgObj);
  let noticeObj = {['notice']:data[0].notice};
  let noticeStatus = await DB.update('user',{ _id:DB.getID(verificationToken(ctx).data.id) },noticeObj);
  // console.log(noticeStatus.result.n);

  let arr = data[0].workRecordObj[ctx.request.body.time];
  let type = false;
  arr.forEach((val, ind) => {
    if (val.id === ctx.request.body.id) {
      // console.log(val)
      val.deleteStatus = '1';
      type = true;
    }
  })
  if (type) {
    let obj = { [`workRecordObj.${ctx.request.body.time}`]: arr };
    let status = await DB.update('user', { _id:DB.getID(verificationToken(ctx).data.id) }, obj);
    if (status.result.n) {
      ctx.body = { code: 200, message: '删除成功', data: null }
    } else {
      ctx.body = { code: 400, message: '删除错误', data: null }
    }
    console.log(arr)
  } else {
    ctx.body = { code: 400, message: '没找到数据', data: null };
  }
  // console.log(type)
})


router.post(interfaceNameObj.sevenDayWork, async (ctx) => {//获取当前起七天内得数据(所有，已完成，未完成)
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: 401, message: `${verificationToken(ctx).msg}` }
    return
  }
  let data = await DB.find('user', { _id:DB.getID(verificationToken(ctx).data.id) });
  
  let list = getList(getSevenTime(),data[0].workRecordObj,ctx.request.body.type);
  // console.log(list)
  ctx.body = { code: 200, message: 'success',data:list }
})


router.post(interfaceNameObj.upload, upload.single('file'), async (ctx, next) => {//上传图片返回路径
  ctx.body = { code: 200, message: '成功', filename: `http://${url.network}:3000/imgs/${ctx.req.file.filename}` }; //返回文件名
})

            

module.exports = router.routes();