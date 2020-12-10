const Koa = require('koa');
// const http = require('https');
// const fs = require('fs');
// const path = require('path');
// const cors = require('koa2-cors');
const serve = require('koa-static');
const Route = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors')
const api = require('./routes/api');
const tscApi = require('./routes/tsc/tsc')
const { writeJson } = require('./module/fnc/fnc')
const serverApi = require('./routes/server/server');
const { verificationToken, whitelist } = require('./module/util')


const app = new Koa();
const router = new Route();

app.use(bodyParser());
app.use(cors());
app.use(serve(__dirname + '/public'))

app.use(async (ctx, next) => { 
    ctx.body = '404 Not found，你输错接口地址了!';
    await next();
    writeJson(ctx)
})

app.use(async (ctx, next) => {  //登录权限中间件
    if (whitelist.indexOf(ctx.originalUrl) === -1) {//如果不在白名单里面
        let status = await verificationToken(ctx);
        status ? await next() : '';
        return false;
    }
    await next();
})

router.use('/api', api);
router.use('/tsc', tscApi);
router.use('/server', serverApi);
app.use(router.routes());//启动路由
app.use(router.allowedMethods())//加上就完事了
console.log('已监听3000端口');
app.listen(3000);