
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;

// load the auth variables
var configAuth = require('./auth');
var User = require('../app/models/User.js');



module.exports = function(passport){







    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, {'Message': 'No user found.'}); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, {'Message': 'Oops! Wrong password.'}); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            });//end of idnOne



})


)

























    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            console.log('emial' + email + 'pasword' + password + 'username' )


            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {



                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({'local.email': email}, function (err, user) {
                    // if there are any errors, return the error

                    console.log('err' +err + 'user' + user)
                    if (err)

                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        console.log('user found' )
                        return done(null, false, {'signupMessage': 'That email is already taken.'});
                    } else {

                        // if there is no user with that email
                        // create the user

                        console.log('n,ew User' + newUser)
                        var newUser = new User();

                        // set the user's local credentials

                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);

                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });//end of save
                    }//end else

                });//end findONe


            })//end process

        })
)











    /*
    FACEBOOK STRATEGY
     */


    passport.use(new FacebookStrategy({


            // pull in our app id and secret from our auth.js file
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL

        },

        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                console.log( 'Profile' + JSON.stringify(profile));

                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {

                        console.log('user' + user)
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them

                        console.log('New User' )
                        var newUser            = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id    = profile.id; // set the users facebook id
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName || profile.displayName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.email; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));





/*
GOOGLE STRATEGY
 */

    passport.use(new GoogleStrategy({

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL,

        },
        function(token, refreshToken, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google


            process.nextTick(function() {

                // try to find the user based on their google id
                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {



                        // if a user is found, log them in
                        return done(null, user);
                    } else {

                        // if the user isnt in our database, create a new user
                        var newUser          = new User();

                        // set all of the relevant information
                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email

                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });

        }));






    /*
    TWITTER STRATEGY FOR AUTHENTICATION
     */


    passport.use(new TwitterStrategy({

            consumerKey     : configAuth.twitterAuth.consumerKey,
            consumerSecret  : configAuth.twitterAuth.consumerSecret,
            callbackURL     : configAuth.twitterAuth.callbackURL

        },
        function(token, tokenSecret, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function() {
console.log( 'profile' + profile.id)
                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                    console.log('whaaat' + user + 'er' + err)

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                    console.log('err' +err)
                        return done(err);

                    // if the user is found then log them in
                    if (user) {
                        console.log('user found')
                        return done(null, user); // user found, return that user
                    } else {

console.log('------------------------')
                        console.log('new User')
                        // if there is no user, create them
                        var newUser                 = new User();

                        // set all of the user data that we need
                        newUser.twitter.id          = profile.id;
                        newUser.twitter.token       = token;
                        newUser.twitter.username    = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        // save our user into the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            });

        }));









}