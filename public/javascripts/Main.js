angular.module('SocialMedia',['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/Home.html',

            })
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'loginController'
            })

            .when('/Signup', {
                templateUrl: 'partials/signup.html',
                controller: 'SignupController'
            })


            .when('/Profile', {
                templateUrl: 'partials/Profile.html',
                controller: 'ProfileController',

            })
            .otherwise({
                redirectTo: '/'
            });
    })
/*
Define our services
 */

.service('Auth', function($http,$window){

        /*
         define the function
         */
        var saveToken = function(token){
            $window.localStorage['user-token']=token;
        }

        var getToken = function()
        {
            return  $window.localStorage['user-token'];

        }

        var logout = function()
        {
            $window.localStorage.removeItem('user-token');

        }




        var isloggedIn = function()
        {
            // get teh token and check it
            var token = getToken();

            var payload ; // the data is stored here




            if(token=="undefined")
            {

                return false ;
            }

            if(token)
            {
                //console.log('token exist ' + token);
                payload = token.split('.')[1];
                payload =$window.atob(payload);
                payload = JSON.parse(payload);



                return payload.exp >Date.now() /1000;  // a expliquer

            }
            else{
                return false;
            }

        }


        /*
         */


        var currentUser = function()
        {
            // we must chekf it


            if(isloggedIn())
            {

                var token = getToken();
                var payload = token.split('.')[1] // !!!!!!
                payload =$window.atob(payload);
                payload = JSON.parse(payload);


console.log('paylod is' + JSON.stringify(payload))

                // we will return an object
                return{
                    id :payload._id,
                    email : payload.email,
                    nom : payload.nom
                }
            }


        }



        // teh register method

        var register = function(user)
        {

            return $http.post('/signup', user);

        }



        // the login method

        var login = function(user)
        {
            return $http.post('/login', user)


        }


        // get data for user
        var getProfile = function () {
            return $http.get('/Profile', {
                headers: {
                    Authorization: 'Bearer '+ getToken()
                }//end of headers


            }); // end of return


        }; // end of function




        return {
            saveToken: saveToken,
            getToken : getToken,
            logout :logout,
            isloggedIn :isloggedIn,
            currentUser :currentUser,
            register :register,
            login :login,
            getProfile :getProfile



        }
    })


    .service('User', function(){
        //social media functionality
    })
/*
Define our controllers
 */

.controller('loginController', function($scope,Auth,$location){

        $scope.user ={}


        $scope.login = function(){
Auth.login($scope.user).success(function(data){


    Auth.saveToken(data.token);

    $location.path('/Profile')
})
    .catch(function(err){

        $scope.error =err;
    console.log('err' + err)
})
        }


    })


    .controller('SignupController', function($scope,Auth,$location){

        $scope.newUser = {};


        $scope.signup = function(){



            Auth.register( $scope.newUser)
                .then(function(data){
                    console.log('data' + JSON.stringify(data));
                    //save token

                    Auth.saveToken(data.data.token)

                    $location.path('/Profile')

                }).catch(function(err){

                    $scope.error = err
                    console.log('err' + err)
                })

        }


    })


    .controller('ProfileController', function($scope,Auth,$location){


        //get the currenTuser
        Auth.getProfile().then(function(data){

            console.log('data' + JSON.stringify(data.data))
            $scope.user = data.data

        }).catch(function(err){

        })



        $scope.logout =function(){
            Auth.logout();
            $location.path('/')
        }


    })