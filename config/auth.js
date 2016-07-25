module.exports = {

    'facebookAuth' : {
        'clientID'      : '614434788724310', // your App ID
        'clientSecret'  : 'ef78583695b12a42e500fc40bce0ab8f', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        passReqToCallback : true,
        profileFields: ['id', 'emails', 'name']
    },

    'twitterAuth' : {
        'consumerKey'       : 'xPnxYvoIXNI7TQzYNnBJfl6Xb',
        'consumerSecret'    : 'ooa4lxJ4WPX5awINp00L0ulTS5kDejIjeTt4ZAacQ8NvoiCiHX',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '964239618351-c7f8crrojmbl3r3t04qvif17hb58eamv.apps.googleusercontent.com',
        'clientSecret'  : 'oR5j0cSMy_8V-WF7nVQ7T2LR',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};