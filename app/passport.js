'use strict';
const passport = require('koa-passport');
const Strategy = require('passport-google-oauth20').Strategy;
const config = require('../config/config');
const YAPI = require('./youtube');
const {User,Playlist} = require('./tables');

const strategyConfig = {
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
};

passport.use(new Strategy(strategyConfig,
    async function(accessToken, refreshToken, profile, done) {
        const user = {
            name: profile.name,
            displayName: profile.displayName,
            photos: profile.photos[0].value,
            accessToken: accessToken,
            googleId: profile.id
        };

        if (refreshToken != "undefined" && refreshToken != "" && refreshToken != null) {
            user.refreshToken = refreshToken;
        }
        await User.upsert(user);
        
        var userGet = (await User.findOne({
            where: {
                googleId: profile.id
            }
        })).dataValues;

        var youApi = new YAPI(config, userGet.accessToken, userGet.refreshToken);
        var data = await youApi.getPlaylistData();

        for (var i = 0; i < data.items.length - 1; i++) {
            // var items = await youApi.getPlaylistItems(data.items[i].id);
            // var videos = [];
            // for (var j in items.items) {
            //     videos.push(items.items[j].snippet.resourceId.videoId);
            // }
            // videos = videos.join(",");
            // console.log(videos);

            var playlist = {
                title: data.items[i].snippet.title,
                description: data.items[i].snippet.description,
                youtubeId: data.items[i].id,
                videos: '',
                thumbnail: data.items[i].snippet.thumbnails.medium.url,
                userId: userGet.googleId
            };

            await Playlist.upsert(playlist);
        }

        return done(null, user);
    }));

passport.serializeUser(function(user, done) {
    done(null, user.googleId);
});

passport.deserializeUser(async function(googleId, done) {
    var user = await User.findOne({
        where: {
            googleId: googleId
        }
    });
    done(null, user);
});

module.exports = passport;