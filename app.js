const Koa = require('koa');
// const http = require('https');
const fs = require('fs');
const path = require('path');
const serve = require('koa-static');
const Route = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors')
// const cors = require('koa2-cors');
const api = require('./routes/api');
const tscApi = require('./routes/tsc/tsc')

const app = new Koa();
const router = new Route();

app.use(bodyParser());
app.use(cors());
app.use(serve(__dirname+'/public'))

app.use(async (ctx,next)=>{
    ctx.body = '404 Not found';
    await next();
})



router.use('/api',api);
router.use('/tsc',tscApi);
app.use(router.routes());//启动路由
app.use(router.allowedMethods())//加上就完事了
console.log('已监听3000端口');
app.listen(3000);