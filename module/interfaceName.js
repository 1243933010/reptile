
let interFaceNameObj={
    updateProfile:'/updateProfile',//更新头像名字
    login:'/login',//登录
    registered:'/registered',//注册
    updateMessage:'/updateMessage',//更新工作内容(暂未使用)
    addWorkContent:'/addWorkContent',//添加工作内容
    workDay:'/workDay',//获取某天得添加记录
    setWork:'/setWork',//修改状态
    deleteWork:'/deleteWork',//删除某条数据
    sevenDayWork:'/sevenDayWork',//获取当前起七天内得数据(所有，已完成，未完成)
    upload:'/upload',//上传图片返回路径
    notice:'/notice',//创建、删除、修改状态消息提示记录
    unread:'/unread',//获取未读消息数量
    changePwd:'/changePwd',//修改密码
    createTeam:'/createTeam',//创建团队
    teamAll:'/teamAll',//所有得团队
    myTeam:'/myTeam',//我的团队
    searchUser:'/searchUser',//搜索用户
    inviteJoin:'/inviteJoin',//邀请加入(内部有未验证标注)
    beInvited:'/beInvited',//被邀请记录接口
    processInvitation:'/processInvitation',//处理邀请
    participateTeam:'/participateTeam',//我参与的团队
    deleteTeam:'/deleteTeam',//逻辑删除团队
    createTeamWork:'/createTeamWork',//创建团队任务
    receiveTask:'/receiveTask',//领取未被领取的任务(队长队员都可领取)
    finishTeamTask:'/finishTeamTask',//被邀请记录接口
    beInvited:'/beInvited',//结束某个属于自己的团队任务
    deleteTeamTask:'/deleteTeamTask',//删除某个自己的团队任务
    getMyTeamTask:'/getMyTeamTask',//获取我创建的团队任务
    transfer:'/transfer',//转让团队给其他队友，转让不需要对方同意
    getMyFinishTeamTask:'/getMyFinishTeamTask',//获取我已完成的团队任务



}


module.exports=interFaceNameObj;