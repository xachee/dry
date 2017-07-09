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
      var priceD = await Sale.findOne({where:{playlistId: playlists[i].dataValues.id}});
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

async function store(ctx) {
    var ords=await Order.findAll({
      where:{
        ownerId:ctx.state.user.googleId
      }
    })
    var ordIds=[];
    for(var i in ords){
      ordIds.push(ords[i].dataValues.playlistId);
    }
    var playlists = await Playlist.findAll({
        where: {
            status: "sale",
            userId:{
              $not :ctx.state.user.googleId
            },
            id:{
              $notIn:ordIds
            }
        }
    });

    var pls =[];
    for(var i in playlists){
      pls.push(playlists[i].dataValues);
    }
    await ctx.render('store/store',{
      playlists:pls
    });
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
router.get('/store', store);
router.get('/auth/google', passport.authenticate('google', {
    scope: config.google.scope,
    accessType: config.google.accessType,
    approvalPrompt: config.google.approvalPrompt
}));

router.get('/auth/google/callback',passport.authenticate('google',{ successRedirect: '/dashboard', failureRedirect: '/' }));

// ------------ //
// Sale process //
// ------------ //
router.post('/sell', koaBody, async (ctx) => {
  // CONSOLES
  console.log("////////////// Starting sell process //////////////////");
  console.log(ctx.request.body);

  let id = ctx.request.body.id;
  let price = ctx.request.body.price;

  // MAIN CODE
  try {
    // CONSOLE
    console.log("We get price ---- $" + price);
    // CODE
    // Insert a new row in table Sales
    await Sale.upsert(
      {playlistId: id, price: price}
    );

    // Selecting row in table Playlist by id
    let playlist = await Playlist.findById(id);
    console.log("Youtube playlist id - " + playlist.get('youtubeId'));
    //YAPI connection
    var youApi = new YAPI(config, ctx.state.user.accessToken, ctx.state.user.refreshToken);
    var items = await youApi.getPlaylistItems(playlist.get('youtubeId'));

    // Array for videos
    var videos = [];
    for (var j in items.items) {
        videos.push(items.items[j].snippet.resourceId.videoId);
    }
    videos = videos.join(",");

    // Playlist status changing process and video id inserting
    await Playlist.update(
      {status:"sale", videos: videos},
      {where: {id: id}}
    );

    // Massage
    ctx.body="OK";
  }
  catch(err) {
    // CONSOLE
    console.log(err);
    // ERROR
    ctx.body="Err";
  }
});

// ------------------------ //
// Sale cancelation process //
// ------------------------ //
router.post('/cancelSale', koaBody, async (ctx) => {
  // CONSOLES
  console.log("////////////// Canceling playlist sale //////////////////");
  console.log(ctx.request.body);

  // MAIN CODE
  try {
    // Removing playlist from playlist SALE table
    await Sale.destroy(
      {where: {playlistId: ctx.request.body.id}}
    );
    // Playlist status change process
    await Playlist.update(
      {status: "deleted"},
      {where: {id: ctx.request.body.id}}
    );
    // CODE - end
    ctx.body="OK";
  }
  catch(err) {
    // CONSOLE
    console.log(err);
    // ERROR
    ctx.body="Err";
  }
});


router.get('/logout', logout);

router.get('/dashboard', dashboard);

module.exports = router;
