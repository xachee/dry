'use strict';

const router = require('koa-router')();
const config = require('../config/config');
const passport = require('koa-passport');
const YAPI = require('./youtube');

async function main(ctx) {
  await ctx.render('main/index');
}

async function create(ctx) {
  await ctx.render('create_playlist_to_sell/create_playlist_to_sell');
}

async function playlist_l(ctx) {
  await ctx.render('playlist_list/playlist_list');
}

async function playlist_p(ctx) {
  await ctx.render('playlist-page/index');
}

async function payment(ctx) {
  await ctx.render('paymentPage/Payment');
}
async function dashboard(ctx, next) {
  await ctx.render('main/index', {user: ctx.state.user});

  var youApi = new YAPI(config, ctx.state.user.accessToken, "1/db5T5f0BHflTvcNPgkOJCPti9Jb1vgQ0uBYGnuRapJk");

  youApi.getPlaylistData();

  await next();
}
async function logout(ctx) {
  ctx.logout();
  ctx.redirect('/');
}

/*router.get(async function(ctx,next){
 if(ctx.isAuthenticated()){
 return next();
 }else{
 ctx.redirect('/');
 }
 });*/
router.get('/create', create);
router.get('/main', main);
router.get('/', main);
router.get('/playlist-list', playlist_l);
router.get('/playlist-page', playlist_p);
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
