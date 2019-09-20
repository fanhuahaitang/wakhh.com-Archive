import koaRouter from 'koa-router';

let router = new koaRouter();

router.get('/test', (ctx, next) => {
  ctx.body = {
    message: 'test'
  };
})

export default router;