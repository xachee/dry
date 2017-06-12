//koa-ejs, koa,  koa-ruter,'loover', passport,
const http=require("http");
const koa=require("koa");
const koaejs=require("koa-ejs");
const KoaR=require("koa-router");
const app= new koa();
app.listen(8080);

app.use(function (ctx) {
    ctx.body=ctx.url;
})
