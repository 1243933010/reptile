集合:{
    work,
    team,
    notice
}



1、/api/upload    上传图片

2、/api/login     登录
{username:'yue',pwd:'123456'}

3、/api/updateProfile 更改名字和头像
{username:'test',avatar:'url路径'} 可以单独传其中一个
目前更改名字不会更新team和inviteJoinHistory 集合的名字数据

4、/tsc/changePwd 修改密码
{pwd:'',newPwd:''} 原密码，新密码

5、/api/registered 注册
{username:'yue',pwd:123456}

6、/api/addWorkContent 添加工作内容
{workText:'工作内容一',estimatedTime:'2'} 
workText为工作名称 estimatedTime预计完成时间(分钟)

7、/api/workDay 获取某天未删除得工作内容
{time:this.key}
key格式为某天得年-月-日，如果为各位签名不加0

8、/api/setWork 修改某条工作数据得状态
{id:item.id,time:item.time,remark:'测试测试测试'}
传唯一id和time，remark为完成备注(可选传)

9、/api/deleteWork 逻辑删除工作数据
{id:item.id,time:item.time}
传唯一id和time

10、/api/sevenDayWork  获取当前起七天内得数据(所有，已完成，未完成)
//all全部 completed已完成 undone未完成
{type:'all'}


11、/tsc/notice               创建、删除、修改状态消息提示 
{offset:2,limit:5}
offset第几页，limit每页数量

12、/tsc/unread              获取还有没有未读信息   status=1有未读 0无未读
{}




  建team集合 创建临时任务团队，时间到期自动解散或者主动解散，flog属性控制，有创建人，id，创建时间，到期时间，任务列表，邀请他人加入，创建人能主动解散，添加得团队工作也会记录在个人记录里面


12、/tsc/createTeam        创建任务团队
{任务团队名称,到期时间(年月日),团队label(一句话)，technology标签(字符串数组)}
{teamName:'',expireDate:'',teamLabel:'',technologyLabel:''}
                     
 14、    /tsc/teamAll       所有得团队(待用)
     {offset:1,limit:10}

                     
15、 /tsc/myTeam        我是队长的任务团队
    {}

 16、   /tsc/searchUser     搜索用户，暂时只能是名字，如果绑定了手机号也可以搜索手机号
    {text:'名字或者手机号'}



17、   /tsc/inviteJoin       邀请加入团队
    {userId自己id,teamId:任务团队id，inviteId被邀请人id}
    {userId:'',teamId:''，inviteId：""}

     <!-- /xx/xx            邀请记录接口 -->

 18、   /tsc/beInvited       被邀请记录接口
    {userId:''}
    返回的status为空是还未处理，为"1"是已同意，为"0"是已拒绝,为空展示同意和拒绝按钮
    


 19、   /tsc/processInvitation  处理邀请
    {status:'1',id:'1',userId:'',teamId:'',username:''}
    status为"1"是同意，"0"是拒绝,id为请求信息的id,userId自己的id，登录有，teamId:团队id，username：''



20、   /tsc/participateTeam           我参与得任务团队
    {userId}

    

21、  /tsc/deleteTeam           删除任务团队
     {teamId：'1'}



22、/tsc/transfer            转让团队给其他队友，转让不需要对方同意
    {teamId:'',teammateId:''}
    teammateId队友id

     
23、 /tsc/createTeamWork        创建任务(队员创建默认属于自己，队长创建得任务可以领取)
     {teamId:'',,taskNmae:'',taskLabel:''}
                      
                      
24、 /tsc/receiveTask    领取未被领取的任务(队长队员都可领取)
     {teamId:'',taskId:''}


  25、   /tsc/finishTeamTask  结束某个属于自己的团队任务
     {teamId:'',taskId:''}

  26、   /tsc/deleteTeamTask     删除某个自己的任务
     {teamId:'',,taskId:''}

27、  /tsc/getMyTeamTask     获取我创建的团队任务
     {status:''} '0'未完成 '1'已完成

28、 /tsc/setLabel    设置添加技能标签
    {labelList:[]}

29、/tsc/setMobile  设置mobile

30、 /tsc/logout   注销账号



userinfo:{
    token,
    username,
    img,
    Authorization,
}