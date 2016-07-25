var jwt = require('express-jwt');
var auth = jwt({
    secret: 'secret_Client'

});

var User = require('../app/models/User.js');

module.exports = function(app,passport){

//THE ROUTING



    app.get('/', function(req,res){
        res.sendFile('index.html',{root:'public'})
    })



    app.get('/Profile',auth, function(req,res){


      res.json(req.user);

        //we will serahc User with this id
    })



    /*
    THE AUTH
     */

    app.post('/signup', function(req, res, next){




        passport.authenticate('local-signup', function(err,user, info){



            if(user){
                var token =user.generateJwt()
                return res.json({"token":token });
            } else {
                return res.status(400).json(info);
            }
        })(req, res, next);


    })



    //LOGIN

    app.post('/login', function(req, res, next){




        passport.authenticate('local-login', function(err,user, info){

            console.log('' + err + 'info' + JSON.stringify(info) +' user' + JSON.stringify(user))

            if(user){
                var token =user.generateJwt()
                return res.json({"token":token });
            } else {
                return res.status(400).json(info);
            }
        })(req, res, next);


    })








    // FACEBOOK STRATEGY

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));


    //LOGIN WITH FACEBOOK

    app.get('/auth/facebook/callback', function(req, res, next){




        passport.authenticate('facebook', {scope:['email']}, function(err,user, info){

            console.log('token' + user.facebook.token)

         if(err){
             res.status(400).json(err)
         }
            else{
             if(user){
                 res.status(200).json(user.facebook.token)
             }else{
                 res.json(info)
             }
         }


        })(req, res, next);


    })






    //GOOGLE STRATEGY

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }))




    //LOGIN WITH GOOGLE

    app.get('/auth/google/callback', function(req, res, next){




        passport.authenticate('google', {scope:['email']}, function(err,user, info){



            if(err){
                res.status(400).json(err)
            }
            else{
                if(user){
                    res.status(200).json(user.google.token)
                }else{
                    res.json(info)
                }
            }


        })(req, res, next);


    })



















    //LOGIN WITH TWITTER


    app.get('/auth/twitter', passport.authenticate('twitter', { scope : ['profile', 'email'] }))

    //LOGIN WITH GTWITTER

    app.get('/auth/twitter/callback', function(req, res, next){




        passport.authenticate('twitter', function(err,user, info){

console.log('User' + JSON.stringify(user) + 'info' + JSON.stringify(info))

            if(err){
                res.status(400).json(err)
            }
            else{
                if(user){
                    res.status(200).json(user.google.token)
                }else{
                    res.json(info)
                }
            }


        })(req, res, next);


    })


}