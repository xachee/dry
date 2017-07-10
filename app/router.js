'use strict';

const router = require('koa-router')();
const config = require('../config/config');
const passport = require('koa-passport');
const YAPI = require('./youtube');
const {User, Order, Sale, Playlist,Copy,Video} = require("./tables");
const koaBody = require('koa-body')();

async function main(ctx) {
  var news=[];
  var ordIds=[];
  var gid=null;
    if(ctx.isAuthenticated()){
      var ords=await Order.findAll({
        where:{
          ownerId:ctx.state.user.googleId
        }
      })

      for(var i in ords){
        ordIds.push(ords[i].dataValues.playlistId);
      }
      gid=ctx.state.user.googleId;
    }
    var pls =await Playlist.findAll({
      where: {
            status: "sale",
            userId:{
              $not :gid
            },
            id:{
              $notIn:ordIds
            }
        },
      order:[['id','DESC']],
      limit: 10
    })

    for(var i in pls){
      news.push(pls[i].dataValues);
      news[i].price=(await Sale.findOne({
        where:{
          playlistId:pls[i].dataValues.id
        }
      })).dataValues.price;
    }
    await ctx.render('main/index',{
      news:news
    });
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
      prices.push({id:playlists[i].dataValues.youtubeId,price:price});
    }
    var bpls=[];
    var ords=await Order.findAll({
      where:{
        ownerId:ctx.state.user.googleId
      }
    })

    var bprices=[];
    for(var i in ords){
      var pl=await Playlist.findOne({
        where:{
          id:ords[i].dataValues.playlistId
        }
      })
      bpls.push(pl.dataValues);
      var priceD = await Sale.findOne({where:{playlistId: pl.dataValues.id}});
      bprices.push({id:playlists[i].dataValues.youtubeId,price:priceD.dataValues.price});

    }

    await ctx.render('my_playlists/my_playlists', {
        playlists: pls,
        prices:prices,
        boughtPlaylists:bpls,
        boughtPrices:bprices
    });
}

async function playlist_p(ctx) {
  var info = await Playlist.findOne({
        where: {
            youtubeId: ctx.params.id
        }
    });

  if(info.dataValues.videos != ''){
    var items=[];
    var vid=info.dataValues.videos.split(",");
    for(var i in vid){
      var v=await Video.findOne({
        where:{
          videoId:vid[i]
        }
      });
      var title=v.dataValues.title;
      var thumb=v.dataValues.thumbnail;
      items.push({
        snippet:{
          title:title,
          thumbnails:{
            default:{
              url:thumb
            }
          },
          resourceId:{
            videoId:vid[i]
          }
        }
      })
    }
  }else{
    var youApi = new YAPI(config, ctx.state.user.accessToken, ctx.state.user.refreshToken);
    var items = (await youApi.getPlaylistItems(ctx.params.id)).items;

  }
  var infs=await Sale.findOne({
      where:{
        playlistId:info.id
      }
    });

    if(infs){
      info.price=infs.dataValues.price
    }
    await ctx.render('playlist-page/index', {
        info: info,
        items: items
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
    var prs=[];
    for(var i in playlists){
      pls.push(playlists[i].dataValues);
      var price=(await Sale.findOne({
        where:{
          playlistId:playlists[i].dataValues.id
        }
      })).dataValues.price;
      prs.push({price:price});
    }

    await ctx.render('store/store',{
      playlists:pls,
      prices:prs
    });
}

async function dashboard(ctx, next) {
    var news=[];
    var ords=await Order.findAll({
      where:{
        ownerId:ctx.state.user.googleId
      }
    })
    var ordIds=[];
    for(var i in ords){
      ordIds.push(ords[i].dataValues.playlistId);
    }
    var pls =await Playlist.findAll({
      where: {
            status: "sale",
            userId:{
              $not :ctx.state.user.googleId
            },
            id:{
              $notIn:ordIds
            }
        },
      order:[['id','DESC']],
      limit: 10
    })

    for(var i in pls){
      news.push(pls[i].dataValues);
      news[i].price=(await Sale.findOne({
        where:{
          playlistId:pls[i].dataValues.id
        }
      })).dataValues.price;
    }
    await ctx.render('main/index', {
        user: ctx.state.user,
        news:news
    });
    await next();
}

async function logout(ctx) {
    ctx.logout();
    ctx.redirect('/');
}

async function buy(ctx){
  try{
    await Order.create({
      playlistId:ctx.request.body.id,
      ownerId:ctx.state.user.googleId
    })
    var youApi = new YAPI(config, ctx.state.user.accessToken, ctx.state.user.refreshToken);

    var playlist=(await Playlist.findOne({
      where:{
        id:ctx.request.body.id
      }
    })).dataValues;

    var newId = await youApi.insertPlaylist({
      title:playlist.title,
      description:playlist.description
    });

    var videos=playlist.videos.split(",");
    for(var i in videos){
      await youApi.insertVideo({
        pid:newId,
        ptitle:playlist.title,
        vid:videos[i]
      })
    }

    await Copy.create({
      baseId:playlist.id,
      copyId:newId,
      ownerId:ctx.state.user.googleId
    })



    ctx.body="OK";
  }catch(err){
    console.log(err);
    ctx.body="err";
  }
}

async function inter(ctx){
  try{
    await User.upsert({
      googleId:ctx.state.user.googleId,
      interledger:ctx.request.body.int
    })
    ctx.body="OK";
  }catch(err){
    console.log(err);
    ctx.body="err";
  }
}

async function payment_settings(ctx){
  await ctx.render('payment/index',{user: ctx.state.user});
}

async function deletePlaylist(ctx){
  try{
    var youApi = new YAPI(config, ctx.state.user.accessToken, ctx.state.user.refreshToken);
    
    
    var inf = await Copy.findOne({
       where:{
        baseId:ctx.request.body.id,
        ownerId:ctx.state.user.googleId
      }
    });

    await Order.destroy({
      where:{
        ownerId:ctx.state.user.googleId,
        playlistId:ctx.request.body.id
      }
    })

    await Copy.destroy({
      where:{
        baseId:ctx.request.body.id,
        ownerId:ctx.state.user.googleId
      }
    });

    await youApi.deletePlaylist(inf.dataValues.copyId);
    ctx.body="OK";
  }catch(err){
    console.log(err);
    ctx.body="err";
  }
}

router.get('/payment_settings',payment_settings);
router.get('/main', main);
router.get('/', main);
router.get('/my-playlists', playlist_l);
router.get('/playlist-page/:id', playlist_p);
router.get('/payment', payment);
router.get('/store', store);
router.post('/buy',koaBody,buy);
router.post('/inter',koaBody,inter);
router.post('/deletePlaylist',koaBody,deletePlaylist);
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
  console.log(id);
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
        await Video.upsert({
          videoId:items.items[j].snippet.resourceId.videoId,
          title:items.items[j].snippet.title,
          thumbnail:items.items[j].snippet.thumbnails.default.url
        })
    }
    videos = videos.join(",");

    // Playlist status changing process and video id inserting
    await Playlist.update(
      {status:"sale", videos: videos},
      {where: {id: id,userId:ctx.state.user.googleId}}
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
