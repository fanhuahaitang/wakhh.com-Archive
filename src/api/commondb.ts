import koaRouter from 'koa-router';
import koaBody from 'koa-body';

let router = new koaRouter();

router.get('/:dbName/one/:id', (ctx, next) => {
  ctx.body = {
    dbName: ctx.params.dbName,
    id: ctx.params.id
  };
})

router.get('/:dbName/many/:idList', (ctx, next) => {
  ctx.body = {
    dbName: ctx.params.dbName,
    idList: (ctx.params.idList as string).split(',')
  };
})

router.get('/:dbName/all', (ctx, next) => {
  ctx.body = {
    dbName: ctx.params.dbName,
    page: ctx.query.page,
    size: ctx.query.size
  };
})

router.post('/:dbName/one', koaBody(), (ctx, next) => {
  ctx.body = {
    dbName: ctx.params.dbName,
    data: ctx.body
  };
})

router.post('/:dbName/many', koaBody(), (ctx, next) => {
  ctx.body = {
    dbName: ctx.params.dbName,
    data: ctx.body
  };
})

router.put('/:dbName/one/:id', koaBody(), (ctx, next) => {
  ctx.body = {
    dbName: ctx.params.dbName,
    id: ctx.params.id,
    data: ctx.body
  };
})

router.put('/:dbName/many/:idList', koaBody(), (ctx, next) => {
  ctx.body = {
    dbName: ctx.params.dbName,
    idList: (ctx.params.idList as string).split(','),
    data: ctx.body
  };
})

router.put('/:dbName/all', koaBody(), (ctx, next) => {
  ctx.body = {
    dbName: ctx.params.dbName,
    data: ctx.body
  };
})

router.del('/:dbName/one/:id', (ctx, next) => {
  ctx.body = {
    dbName: ctx.params.dbName,
    id: ctx.params.id
  };
})

router.del('/:dbName/many/:idList', (ctx, next) => {
  ctx.body = {
    dbName: ctx.params.dbName,
    idList: (ctx.params.idList as string).split(',')
  };
})

router.del('/:dbName/all', (ctx, next) => {
  ctx.body = {
    dbName: ctx.params.dbName
  };
})

export default router;