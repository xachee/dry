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
    var that =this;
    this.getPlaylistData=function getPlaylistData () {
        return new Promise(function (res,rej) {
          that.youtube.playlists.list({
            part: 'snippet, contentDetails',
            mine:"true",
            maxResults : 25
          }, function (err, data) {
            if (err) {
              console.error('Error: ' + err);
              return rej();
            }
            if (data) {
              //console.log(data);
              res(data);
            }
          });
        })
    };
  this.getPlaylistItems=function getPlaylistItems (id) {
    return new Promise(function (res,rej) {
      that.youtube.playlistItems.list({
        part: 'snippet, contentDetails',
        playlistId: id,
        maxResults : 25
      }, function (err, data) {
        if (err) {
          console.error('Error: ' + err);
          return rej();
        }
        if (data) {
          //console.log(data);
          res(data);
        }
      });
    })
  };
};

module.exports = YoutubeAPI;







/*

this.scopes = ['https://www.googleapis.com/auth/youtube'];
this.execute(this.scopes, this.runSamples);*/
