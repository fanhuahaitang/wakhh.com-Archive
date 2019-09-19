import koaRouter from 'koa-router';
import api from './api';
import logger from './lib/logger';
import koaStatic from 'koa-static';
import path from 'path';

let router = new koaRouter();

// API请求处理，使用二级路由'/api'的请求皆属于API请求
router.use('/api', async (ctx, next) => {
  // 日志中间件
  await next();
  logger.info(`Req:[${ctx.request.ip},${ctx.request.method},${ctx.request.originalUrl}];Res:${ctx.response.status};Record:${JSON.stringify(ctx.state)}`)
}, async (ctx, next) => {
  // 计时中间件
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('x-Response-Time', `${ms}ms`);
  ctx.state.time = ms;
}, async (ctx, next) => {
  // 错误捕获中间件
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.state.error = err;
  }
}, api.routes(), api.allowedMethods(), ctx => {
  // 404中间件，到达此中间件时，将不会再继续路由
  ctx.throw(404)
})

// 非API请求，皆视为静态文件资源请求
router.use(koaStatic(path.resolve('static'), {
  maxage: 5 * 60 * 1000
}));

export default router;