'use strict';
const passport=require('koa-passport');
const strategy=require('passport-google-oauth20').Strategy;
const config=require('../config/config.js');

passport.use(new strategy({
    clientID:config.google.clientID,
    clientSecret:config.google.clientSecret,
    callbackURL:config.google.callbackURL,
    scope:config.google.scope},function(acssesToken,refreshToken,params,profile,done){
    const user={
    name:profile.name,
    displayName:profile.displayName,
    id:profile.id,
    photos:profile.photos,
    acssesToken:profile.acssesToken,
    refreshToken:profile.refreshToken
    };
    return done(null,user);
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
module.exports=passport;