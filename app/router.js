'use strict';

const router = require('koa-router')();
const config = require('../config/config');
const passport = require('koa-passport');
const YAPI = require('./youtube');
const {User, Order, Sale, Playlist} = require("./tables");
const koaBody = require('koa-body')();

async function main(ctx) {
    await ctx.render('main/index');
}

async function create(ctx) {
    await ctx.render('create_playlist_to_sell/create_playlist_to_sell');
}

async function playlist_l(ctx) {
    var playlists = await Playlist.findAll({
        where: {
            userId: ctx.state.user.googleId
        }
    });
    var pls=[];
    var prices=[];
    for(var i in playlists){
      pls.push(playlists[i].dataValues);
      var priceD=await Sale.findOne({where:{playlistId:playlists[i].dataValues.youtubeId}});
      if(priceD!= null){
        var price=priceD.dataValues.price;
      }else{
        var price=null;
      }
      //var price=priceD.dataValues.price;
      prices.push({id:playlists[i].dataValues.youtubeId,price:price});
    }
    
    await ctx.render('my_playlists/my_playlists', {
        playlists: pls,
        prices:prices
    });
}

async function playlist_p(ctx) {
    var youApi = new YAPI(config, ctx.state.user.accessToken, ctx.state.user.refreshToken);
    var items = await youApi.getPlaylistItems(ctx.params.id);
    var info = await Playlist.findOne({
        where: {
            youtubeId: ctx.params.id
        }
    });
    await ctx.render('playlist-page/index', {
        info: info,
        items: items.items
    });
}

async function payment(ctx) {
    await ctx.render('paymentPage/Payment');
}

async function dashboard(ctx, next) {
    await ctx.render('main/index', {
        user: ctx.state.user
    });
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

router.get('/auth/google/callback',passport.authenticate('google',{ successRedirect: '/dashboard', failureRedirect: '/' }));

router.post('/sell', koaBody, async (ctx) => {
  console.log(ctx.request.body);
    try{
      if(ctx.request.body.price==-1){
        await Sale.destroy({where:{playlistId:ctx.request.body.playlistId}});
        await Playlist.upsert({
          status:"youtube",
          youtubeId:ctx.request.body.playlistId
        })
      }else{
        await Sale.upsert(ctx.request.body);
        var youApi = new YAPI(config, ctx.state.user.accessToken, ctx.state.user.refreshToken);
        var items = await youApi.getPlaylistItems(ctx.request.body.playlistId);
            var videos = [];
            for (var j in items.items) {
                videos.push(items.items[j].snippet.resourceId.videoId);
            }
        videos = videos.join(",");

        await Playlist.upsert({
          status:"sale",
          videos:videos,
          youtubeId:ctx.request.body.playlistId
        });
      }
      ctx.body="OK";
    }catch(err){
      console.log(err);
      ctx.body="Err";
    }
  });

router.get('/logout', logout);

router.get('/dashboard', dashboard);

module.exports = router;