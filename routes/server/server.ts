const DB = require('../../module/db')
const jwt = require('jsonwebtoken');
const Router = require('koa-router');
const tokenConfig = { privateKey: 'yue' };
const multer = require('koa-multer');//加载koa-multer模块
const fnc = require('../../module/fnc/fnc');
const interfaceNameObj = require('../../module/interfaceName');



const router = new Router();

interface verificationTokenTyep {
  get: Function
}
interface interfaceType {
  body: Object
}
enum returnCode {
  success = 200,
  tokenFailure = 401,
  error = 400
}
function returnMsg(ctx:any,status:any,msg:string,data:any):void{
  ctx.body = {code:returnCode[status],msg,data}
}

let verificationToken = async(ctx: any)=> {
  try {
    const token: String = ctx.get('Authorization');
    if (token === '') {
      ctx.body = { code: returnCode.error, message: '未登录',data:null};
      return false
    } else {
      try {
        let data = jwt.verify(token.split(' ')[1], tokenConfig.privateKey)
        let status = await DB.find('user',{_id:DB.getID(data.id)});
        if(status){
            return true
        }else{
            returnMsg(ctx,'success','该账号没有权限操作',null);
            return false
        }        
      } catch (error) {
        returnMsg(ctx,'tokenFailure','token过期',null);
        return false
      }
    }
  } catch (error) {
    console.log(error);
  }
}


router.post(interfaceNameObj.adminLogin,async (ctx:any)=>{  //admin登录(未使用)
    let {username,pwd} = ctx.request.body;
    console.log(username,pwd);
    let [data,...a] = await DB.find('admin',{username});
    console.log(data)
    if(data){
        let token = jwt.sign({ id:data._id }, tokenConfig.privateKey, { expiresIn: '7d' })
        returnMsg(ctx,'success','success',{token:`Bearer ${token}`});
        return false
    }
    returnMsg(ctx,'error','未找到账号',null);
})


router.post(interfaceNameObj.user,async (ctx:any)=>{  //查询所有用户
    if (! await verificationToken(ctx)) {return false;}
    let data = await DB.find('user',{status:'1'},{workRecordObj:0,notice:0});
    if(data){
        returnMsg(ctx,'success','success',data);
        return false;
    }
    returnMsg(ctx,'error','error',null);
})


router.post(interfaceNameObj.delteUser,async (ctx:any)=>{  //逻辑删除用户
    if (!verificationToken(ctx)) {return false;}
    let {userId} = ctx.request.body;
    let [data,...a] = await DB.find('user',{_id:DB.getID(userId)},{});
    if(data){
        let status = await DB.update('user',{_id:DB.getID(userId)},{status:'0'})
        if(status.result.n){
            returnMsg(ctx,'success','success',null);
            return false
        }
        returnMsg(ctx,'error','删除失败',null);
        return false;
    }
    returnMsg(ctx,'error','没找到此用户',null);
})

router.post(interfaceNameObj.teamAll,async(ctx:any)=>{//所有得团队
  if (! await verificationToken(ctx)) {return false;}
  let {offfset,limit} = ctx.request.body;
  let data = await DB.find('team',{},{},Number(offfset),Number(limit));
  returnMsg(ctx,'success','success',data);
})


module.exports = router.routes();