'use strict';

const router = require('koa-router')();

async function main(ctx){
    await ctx.render('main/index');
}

async function create(ctx){
    await ctx.render('create_playlist_to_sell/create_playlist_to_sell');
}

async function playlist_l(ctx){
    await ctx.render('playlist_list/playlist_list');
}

async function playlist_p(ctx){
    await ctx.render('playlist-page/index');
}

async function payment(ctx){
    await ctx.render('paymentPage/Payment');
}

router.get('/create', create);
router.get('/main', main);
router.get('/playlist-list', playlist_l);
router.get('/playlist-page', playlist_p);
router.get('/payment', payment);

module.exports = router;
