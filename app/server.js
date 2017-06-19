const Koa = require('koa');
const koaStatic = require('koa-static');
const render = require('koa-ejs');
const path =require('path');

const router= require('./router.js');

var server = new Koa();

render(server, {
    root: path.join(__dirname ,'../view'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: true
});

server.use(koaStatic('../public'));

server.use(router.routes());
server.use(router.allowedMethods());

module.exports = server;
