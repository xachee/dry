'use strict';

const router = require('koa-router')();
const config =require('../config/config');
const passport =require('koa-passport');
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
async function dashboard(ctx,next){
    await ctx.render('main/index',{user:ctx.state.user});
    await next();
}
async function logout(ctx){
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
router.get('/auth/google',passport.authenticate('google',{scope:config.google.scope,acssesType:config.google.accessType,approvalPrompt:'force'}));
router.get('/auth/google/callback',passport.authenticate('google',{successRedirect:'/dashboard',failureRedirect:'/'}));
router.get('/logout',logout);

router.get('/dashboard',dashboard);

module.exports = router;
