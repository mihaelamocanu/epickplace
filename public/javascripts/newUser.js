/**
 * Created by mihaela on 4/19/16.
 */

var app = angular.module('myApp', ['ngRoute'])
    .config(function($routeProvider){
        //The route provider handles the client request to switch route
        $routeProvider.when('/', {
                templateUrl: '../partials/login.ejs',
                controller: 'sign'
            })
            .when('/loginhost', {
                templateUrl: '../partials/signhosting.ejs',
                controller: 'signHosting'
            })
            .when('/registerh', {
                templateUrl: '../partials/signhosting.ejs',
                controller: 'signHosting'
            })
            .when('/register', {
                templateUrl: '../partials/login.ejs',
                controller: 'sign'
            })
            .when('/login', {
                templateUrl: '../partials/login.ejs',
                controller: 'sign'
            })
            .otherwise({redirectTo:'/page1'});
        //Add the API key to use filestack service

    });



app.controller('sign',function($scope,$http,$rootScope) {
  
        if(localStorage['User-Data']){
            $scope.loggedIn=true;
        }
        else
        { $scope.loggedIn=false;}

      
        $scope.signUser = function () {

            $http({
                method:'post',
                url:'/reg/reg',
                headers: {'Content-Type':'application/json'},
                data:{"firstname":$scope.firstname,"lastname":$scope.lastname,"email":$scope.email,"password":$scope.pass,"continent":$scope.continent}
            }).success(function (a) {
               // alert(a);
                window.location = "/home";

            }).error(function (a) {
                //alert(a);
                $scope.show = true;
            });


        }


        $scope.loginUser = function () {

            $http({
                method:'post',
                url:'/reg/log',
                headers: {'Content-Type':'application/json'},
                data:{"email":$scope.email_log,"password":$scope.password}

            }).success(function (a) {
                //alert(a);
                console.log('nnnnn');
                console.log(a);
                window.location = "/home";

            }).error(function (a) {
                //alert(a);
                console.log("jjjjj");
                console.log(a);
                $scope.show_login = true;
            });


        }

    })
    
app.controller('signHosting',function ($scope,$http) {
        if(localStorage['User-Data']){
            $scope.loggedIn=true;
        }
        else
        { $scope.loggedIn=false;}


        $scope.signUser = function () {

            $http({
                method:'post',
                url:'/host/reg',
                headers: {'Content-Type':'application/json'},
                data:{"email":$scope.email,"password":$scope.pass}
            }).success(function (a) {
                // alert(a);
                window.location = "/home";

            }).error(function (a) {
                //alert(a);
                $scope.show = true;
            });


        }


        $scope.loginUser = function () {

            $http({
                method:'post',
                url:'/host/log',
                headers: {'Content-Type':'application/json'},
                data:{"email":$scope.email_log,"password":$scope.password}

            }).success(function (a) {
                //alert(a);
                console.log('nnnnn');
                console.log(a);
                window.location = "/host/fasthotel";

            }).error(function (a) {
                //alert(a);
                console.log("jjjjj");
                console.log(a);
                $scope.show_login = true;
            });


        }

        
        });










