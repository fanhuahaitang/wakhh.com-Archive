process.env.TZ = "Asia/Shanghai";
process.title = "wakhh.com";

import koa from 'koa';
import enforceHttps from 'koa-sslify';
import koaRouter from 'koa-router';
import api from './api';
import logger from './lib/logger';
import koaStatic from 'koa-static';
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

let app = new koa();

// Force HTTPS on all page
app.use(enforceHttps());

app.use(async (ctx, next) => {
  // 日志中间件
  // ctx.state = {};
  await next();
  logger.info(`Req:[${ctx.request.ip},${ctx.request.method},${ctx.request.originalUrl}];Res:${ctx.response.status};Record:${JSON.stringify(ctx.state)}`)
});

app.use(async (ctx, next) => {
  // 计时中间件
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('x-Response-Time', `${ms}ms`);
  ctx.state.time = ms;
});

app.use(async (ctx, next) => {
  // 错误捕获中间件
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.state.error = err;
  }
})

// API请求处理，使用二级路由'/api'的请求皆属于API请求
let router = new koaRouter();
router.use('/api', api.routes(), api.allowedMethods(), (ctx, next) => {
  // API请求处理，最后使用的404中间件，到达此中间件时，因为没有调用next函数，所以将不会再继续路由下去
})
app.use(router.routes()).use(router.allowedMethods());

// 非API请求，皆视为静态文件资源请求
app.use(koaStatic(path.resolve('static'), {
  maxage: 5 * 60 * 1000
}));

// 开启服务器
http.createServer(app.callback()).listen(8080, '0.0.0.0');
let options = {
  key: fs.readFileSync(path.resolve('ssl/wakhh.com.key')),
  cert: fs.readFileSync(path.resolve('ssl/wakhh.com.pem'))
}
https.createServer(options, app.callback()).listen(443, '0.0.0.0');