'use strict';

const router = require('koa-router')();
const config = require('../config/config');
const passport = require('koa-passport');
const YAPI = require('./youtube');
const sq = require("./tables");
async function main(ctx) {
  await ctx.render('main/index');
}

async function create(ctx) {
  await ctx.render('create_playlist_to_sell/create_playlist_to_sell');
}

async function playlist_l(ctx){

  var youApi = new YAPI(config, ctx.state.user.accessToken, "1/db5T5f0BHflTvcNPgkOJCPti9Jb1vgQ0uBYGnuRapJk");
  var data = await youApi.getPlaylistData();
  await ctx.render('my_playlists/my_playlists',{playlists:data.items});
}

async function playlist_p(ctx) {
  var user = (await sq.getUser(ctx.state.user.id)).dataValues;
  var youApi = new YAPI(config, ctx.state.user.accessToken, user.refreshToken);
  var data = await youApi.getPlaylistData();
  var items= await youApi.getPlaylistItems(ctx.params.id);
  for(var i=0;i<data.items.length;i++){
    if(data.items[i].id==ctx.params.id){
      var info=data.items[i];
      break;
    }
  }
  await ctx.render('playlist-page/index',{info:info,items:items.items});
}

async function payment(ctx) {
  await ctx.render('paymentPage/Payment');
}
async function dashboard(ctx, next) {

  await sq.upsertUser(ctx.state.user.id,ctx.state.user.accessToken,ctx.state.user.refreshToken);
  await ctx.render('main/index', {user: ctx.state.user});
  await next();
}
async function logout(ctx) {
  ctx.logout();
  ctx.redirect('/');
}

router.get('/create', create);
router.get('/main', main);
router.get('/', main);
router.get('/my-playlists', playlist_l);
router.get('/playlist-page/:id', playlist_p);
router.get('/payment', payment);
router.get('/auth/google', passport.authenticate('google', {
  scope: config.google.scope,
  accessType: config.google.accessType,
  approvalPrompt: config.google.approvalPrompt
}));
router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/dashboard',
  failureRedirect: '/'
}));
router.get('/logout', logout);

router.get('/dashboard', dashboard);

module.exports = router;
