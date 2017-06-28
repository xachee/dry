'use strict';
const promis= require('bluebird');
const google=require('googleapis');
const config=require('../config/config');
var OAuth2 = google.auth.OAuth2;


var YoutubeAPI = function YoutubeAPI(config,accessT,refreshT)
{
    this.oauth2Client = new OAuth2(
        config.google.clientID,
        config.google.clientSecret,
        config.google.callbackURL
    );

    this.oauth2Client.setCredentials({
        access_token:accessT,
        refresh_token:refreshT
    });

    this.youtube = google.youtube({
        version:"v3",
        auth:this.oauth2Client
    });

    this.getPlaylistData=function getPlaylistData () {
        this.youtube.playlists.list({
            part: 'snippet, contentDetails',
            mine:"true",
            maxResults : 25
        }, function (err, data, response) {
            if (err) {
                console.error('Error: ' + err);
            }
            if (data) {
                console.log(data);
            }
        });
    };

};

module.exports = YoutubeAPI;







/*

this.scopes = ['https://www.googleapis.com/auth/youtube'];
this.execute(this.scopes, this.runSamples);*/
