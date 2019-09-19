process.env.TZ = "Asia/Shanghai";
process.title = "wakhh.com";

import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import koa from 'koa';
import enforceHttps from 'koa-sslify';
import router from './router';

let app = new koa();

// Force HTTPS on all page
app.use(enforceHttps());

app.use(router.routes()).use(router.allowedMethods());

//ssl
let options = {
  key: fs.readFileSync(path.resolve('ssl/wakhh.com.key')),
  cert: fs.readFileSync(path.resolve('ssl/wakhh.com.pem'))
}

// start the server
http.createServer(app.callback()).listen(8080, '0.0.0.0');
https.createServer(options, app.callback()).listen(443, '0.0.0.0');