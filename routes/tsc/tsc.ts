const DB = require('../../module/db')
const jwt = require('jsonwebtoken');
const Router = require('koa-router');
const tokenConfig = { privateKey: 'yue' };
const multer = require('koa-multer');//加载koa-multer模块
const fnc = require('../../module/fnc/fnc');

let { getTime } = fnc;

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

let verificationToken = (ctx: verificationTokenTyep): any => {
  try {
    const token: String = ctx.get('Authorization');
    let data: String;
    if (token === '') {
      return { flog: false, msg: '未登录', data: null }
    } else {
      try {
        data = jwt.verify(token.split(' ')[1], tokenConfig.privateKey)
        return { flog: true, data, msg: 'success' }
      } catch (error) {
        // console.log(error)
        return { flog: false, msg: 'token过期', data: null }
      }
    }
  } catch (error) {
    console.log(error);
  }
}





router.post('/notice', async (ctx: any) => {//创建、删除、修改状态消息提示记录
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return
  }

  let { offset, limit } = ctx.request.body;
  if (!offset || offset <= 0) { ctx.body = { code: returnCode.error, message: 'offset 错误', data: null }; return false };
  if (!limit || limit <= 0) { ctx.body = { code: returnCode.error, message: 'limit 错误', data: null }; return false };
  offset = offset * 1;
  limit = limit * 1;
  let data: any = await DB.find('user', { username: verificationToken(ctx).data.username }, {});
  let list: any = data[0].notice;
  let arr: Object[];
  let len = list.length;
  if (len === 0) {
    ctx.body = { code: returnCode.error, message: '无数据', data: [] };
    return false;
  }
  if (offset == 1) {
    arr = list.slice(0, limit);
    //  console.log(limit)
    for (let i = 0; 0 <= i && i < limit; i++) {
      if (list[i]) { list[i].flog = true; }
    }
  } else {
    arr = list.slice(offset * limit - limit, offset * limit);
    let a = offset * limit - limit;
    let b = offset * limit;
    for (let i = offset * limit - limit; a <= i && i <= b; i++) {
      if (list[i]) { list[i].flog = true; }
    }
  }
  let status = await DB.update('user', { username: verificationToken(ctx).data.username }, { notice: list });
  // console.log(status.result.n);
  if (status.result.n) {
    ctx.body = { code: returnCode.success, message: '成功', data: arr }
  }
})


router.post('/unread', async (ctx: any) => {//获取未读消息数量
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return
  }
  let data = await DB.find('user', { username: verificationToken(ctx).data.username });
  for (let i of data[0].notice) {
    if (!i.flog) {
      ctx.body = { code: returnCode.success, message: '', data: { status: '1' } };
      return false;
    }
  }
  ctx.body = { code: returnCode.success, message: '', data: { status: '0' } };
})


router.post('/changePwd', async (ctx: any) => { //修改密码
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return
  }
  let data = await DB.find('user', { username: verificationToken(ctx).data.username });
  let obj = data[0];
  let { pwd, newPwd } = ctx.request.body;
  if (pwd !== obj.pwd) {
    ctx.body = { code: returnCode.error, message: `原密码错误`, data: null };
    return false;
  }
  let status = await DB.update('user', { username: verificationToken(ctx).data.username }, { pwd: newPwd });
  if (status.result.n) {
    ctx.body = { code: returnCode.success, message: '修改密码成功', data: null };
  } else {
    ctx.body = { code: returnCode.error, message: '修改密码失败', data: null };
  }
})



router.post('/createTeam', async (ctx: any) => { //创建团队
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return false;
  }
  ctx.request.body.createTime = new Date().getTime();
  ctx.request.body.createDay = getTime('yearMonthDay'); //创建年月日
  ctx.request.body.flog = true;  //是否解散(默认true)
  let data = await DB.find('user', { username: verificationToken(ctx).data.username });
  let status = await DB.find('team', {});
  ctx.request.body.id = status.length + 1; //自增id
  ctx.request.body.taskList = [];          //任务列表
  ctx.request.body.memberList = [];        //成员列表
  ctx.request.body.flog = true;        //默认未删除为true
  ctx.request.body.userId = DB.getID(data[0]._id); //队长id
  let res = await DB.insert('team', ctx.request.body);
  if (res.result.n) {
    ctx.body = { code: returnCode.success, message: '创建成功', data: null };
  } else {
    ctx.body = { code: returnCode.error, message: '创建失败', data: null };
  }
})


router.post('/teamAll', async (ctx: any) => {   //所有得团队
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return false;
  }
  let res = await DB.find('team', {}, { _id: 0 }, Number(ctx.request.body.offset), Number(ctx.request.body.limit));
  console.log(res)
  ctx.body = { code: returnCode.success, message: '成功', data: res };
})


router.post('/myTeam', async (ctx: any) => {   //我的团队
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return false;
  }
  let { userId, useranme } = ctx.request.body;
  let res = await DB.find('team', { userId: DB.getID(userId), flog: true }, { flog: 0 });
  // console.log(res)
  res.forEach((val: any, ind: Number) => {
    val.username = useranme;
  });
  ctx.body = { code: returnCode.success, message: '成功', data: res };
})


router.post('/searchUser', async (ctx: any) => {   //搜索用户
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return false;
  }
  let { text } = ctx.request.body;

  if (text === verificationToken(ctx).data.username) {
    ctx.body = { code: returnCode.error, message: '不能搜索自己的账号', data: null };
    return false;
  }
  let res = await DB.find('user', { username: text }, { pwd: 0, workRecordObj: 0, notice: 0 });
  if (res.length) {
    ctx.body = { code: returnCode.success, message: 'success', data: res[0] };
  } else {
    ctx.body = { code: returnCode.error, message: '未找到此账号', data: null };
  }
  console.log(res)

})


router.post('/inviteJoin', async (ctx: any) => {   //邀请加入(内部有未验证标注)
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return false;
  }
  let { userId, teamId, inviteId } = ctx.request.body;
  let message = '';
  let teamData = await DB.find('team', { id: Number(teamId) });
  // console.log(teamData[0].userId,userId,'----205')
  // console.log( teamData[0].userId!=userId,'----206')
  // console.log(ctx.request.body,'----207')
  if (teamData[0].userId != userId) {
    ctx.body = { code: returnCode.error, message: '你不是该团队的队长', data: null };
    return false;
  }

  if (teamData.length) {
    for (let i = 0; i < teamData[0].memberList.length; i++) { //标注
      if (teamData[0].memberList[i].userId === inviteId) {
        ctx.body = { code: returnCode.error, message: '邀请人已经在团队里面', data: null };
        return
      }
    }
    let name = await DB.find('user', { _id: DB.getID(teamData[0].userId) }, { username: 1 })
    message = `${name[0].username}邀请你加入${teamData[0].teamName}`;
  } else {
    ctx.body = { code: returnCode.error, message: '未找到此团队' };
  }
  let inviteJoinHistory = await DB.find('inviteJoinHistory', { userId: inviteId });
  if (inviteJoinHistory.length) {
    for (const iterator of inviteJoinHistory[0].list) {
      if (teamId === iterator.teamId && !iterator.status) {
        ctx.body = { code: returnCode.error, message: '已发送过请求，对方还未回复', data: null };
        return false
      }
    }
    let len = inviteJoinHistory[0].list.length + 1;
    let obj = { id: len, teamId, status: '', message, teamName: teamData[0].teamName }; //标注teamName
    inviteJoinHistory[0].list.unshift(obj);
    let status = await DB.update('inviteJoinHistory', { userId: inviteId }, { list: inviteJoinHistory[0].list });
    if (status.result.n) {
      ctx.body = { code: returnCode.success, message: '已向该用户发送邀请', data: null };
    }
  } else {
    let obj = { userId: inviteId, list: [{ id: 1, teamId, status: '', message }] };
    let status = await DB.insert('inviteJoinHistory', obj)
    if (status.result.n) {
      ctx.body = { code: returnCode.success, message: '已向该用户发送邀请', data: null };
    }

  }
  // console.log(userData);
})


router.post('/beInvited', async (ctx: any) => { //被邀请记录接口
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return false;
  }
  let { userId } = ctx.request.body;
  let history = await DB.find('inviteJoinHistory', { userId }, { _id: 0, userId: 0 });
  if (history.length) {
    ctx.body = { code: returnCode.success, message: 'success', data: history[0].list };
  } else {
    ctx.body = { code: returnCode.success, message: '暂时没有数据', data: history };
  }
})


router.post('/processInvitation', async (ctx: any) => {  //处理邀请
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return false;
  }
  let { id, status, userId, teamId, username } = ctx.request.body;
  let data = await DB.find('inviteJoinHistory', { userId })
  for (let i = 0; i < data[0].list.length; i++) {
    if (id == data[0].list[i].id) {
      data[0].list[i].status = status;
      let msg = await DB.update('inviteJoinHistory', { userId }, { list: data[0].list });
      if (!msg.result.n) {
        ctx.body = { code: returnCode.error, message: '数据更新失败', data: null };
        return
      }
      if (status === '1') {
        let teamData = await DB.find('team', { id: Number(teamId) });
        let obj = { userId, username };
        teamData[0].memberList.push(obj);
        let res = await DB.update('team', { id: Number(teamId) }, { memberList: teamData[0].memberList });
        console.log(res.result)
        if (res.result.n) {
          ctx.body = { code: returnCode.success, message: 'success', data: null };
        } else {
          ctx.body = { code: returnCode.error, message: '数据更新失败', data: null };
        }
      } else {
        ctx.body = { code: returnCode.success, message: `你已拒绝了${data[0].list[i].teamName}团队的邀请` };
        return false;
      }
    }
  }
  // console.log(ctx.request.body);

})

router.post('/participateTeam', async (ctx: any) => {  //我参与的团队
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return false;
  }
  let { userId } = ctx.request.body

  console.log(ctx.request.body)
  let data = await DB.find('team', { "memberList.userId": userId }, { _id: 0, flog: 0, taskList: 0, memberList: 0, userId: 0 });
  console.log(data)
  ctx.body = { code: returnCode.success, message: 'success', data };
})


router.post('/deleteTeam', async (ctx: any) => { //逻辑删除团队
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return false;
  }
  let { teamId } = ctx.request.body;
  let data = await DB.update('team', { id: Number(teamId) }, { flog: false });
  if (data.result.n) {
    ctx.body = { code: returnCode.success, message: '删除成功' };
  } else {
    ctx.body = { code: returnCode.error, message: '删除失败' };
  }
})

router.post('/transfer', async (ctx: any) => {  //转让团队
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return false;
  }
  let {teamId,teammateId} = ctx.request.body;
  let data = await DB.update('team', { id: Number(teamId) }, { flog: false });

})

/**
 * 接收{teamId:'',userId:'',taskNmae:'',taskLabel:''}
 * 额外添加开始时间createTime、结束时间endTime、任务状态taskStatus(默认为'0'未完成)、
 * 任务是否领取状态isReceive(0未领取)、是否逻辑删除flog(默认为true) 
 */
router.post('/createTeamWork',async (ctx:any)=>{  //创建团队任务
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return false;
  }
  let {teamId,userId} = ctx.request.body;
  let [team,...a] = await DB.find('team',{id:Number(teamId)});
  ctx.request.body.createTime = new Date().getTime();
  ctx.request.body.endTime = null;
  ctx.request.body.taskStatus = '0';
  ctx.request.body.flog = true;
  ctx.request.body.taskId = team.taskList.length+1;
  ctx.request.body.isReceive = '1'; 
  if(team.userId.toString()=== userId){//如果是队长创建的项目未领取的状态
    ctx.request.body.isReceive = '0';
    ctx.request.body.userId = null;
  }
  team.taskList.unshift(ctx.request.body);
  let status = await DB.update('team',{id:Number(teamId)},{taskList:team.taskList});
  // console.log(status.result.n);
  if(status.result.n){
    ctx.body = { code: returnCode.success, message: '创建成功' };
    return
  }
  ctx.body = { code: returnCode.error, message: '创建失败'};
})


/**
 * {teamId:'',taskId:'',userId:'';}
 * 
 */
router.post('/receiveTask', async(ctx:any)=>{
  if (!verificationToken(ctx).flog) {
    ctx.body = { code: returnCode.tokenFailure, message: `${verificationToken(ctx).msg}` }
    return false;
  }
  let {teamId,userId,taskId} = ctx.request.body;
  console.log(teamId,userId);
  let [data,...a] = await DB.find('team',{id:Number(teamId)});
  data.taskList.forEach((val:any,ind:number) => {
    if(val.taskId===Number(taskId)){
      val.userId = userId;
      console.log('111')
    }
  })
  let status = await DB.update('team',{id:Number(teamId)},{taskList:data.taskList});
  if(status.result.n){
    ctx.body = { code: returnCode.success, message: '领取成功' };
    return
  }
  ctx.body = { code: returnCode.error, message: '领取失败'};
})


module.exports = router.routes();




