//koa-ejs, koa,  koa-ruter,'loover', passport,
const http=require("http");
const koa=require("koa");
const koaejs=require("koa-ejs");
const KoaR=require("koa-router");
const app= new koa();


app.use(function (ctx) {
    if(ctx.url=="/p1" || ctx.url=="/")
        ctx.body="<center><p>This is Page1<br><a href='p2'>Page 2</a></p></center>";
    else if(ctx.url=="/p2")
        ctx.body="<center><p>This is Page2<br><a href='p1'>Page 1</a></p></center>";
})

module.exports = app;
