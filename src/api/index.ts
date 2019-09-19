import koaRouter from 'koa-router';

let router = new koaRouter();

// 404
router.use((ctx, next) => {
  ctx.status = 404;
})

export default router;