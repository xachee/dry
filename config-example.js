'use strict';

const config = {
    port: 3000,
    koaSecret: 'Some very strong key goes here, yo!',
    google: {
        clientID: 'you id here',
        clientSecret: 'your secret here',
        callbackURL: 'http://play.am:3000/auth/youtube/callback',
        accessType: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/youtube']
    }
};
