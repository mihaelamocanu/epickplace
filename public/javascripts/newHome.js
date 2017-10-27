var myApp=angular.module('myApp',['ngRoute','ngFileUpload'])
.config(['$routeProvider','$locationProvider' ,function($routeProvider,$locationProvider){
    $routeProvider.when('/page1',{templateUrl:'partials/me.ejs',controller:'EditProfileController'});
    $routeProvider.when('/page2',{templateUrl:'partials/page2.html'});
    $routeProvider.otherwise({redirectTo:'/home'});
    $locationProvider.html5Mode({enabled:true,requireBase:false});
}]); 
myApp.controller('EditProfileController',['Upload','$scope','$state','$http',
                                    function (Upload,$scope,$state,$http) {

                                        $scope.user = JSON.parse(localStorage['User-Data']) || undefined;

                                        $scope.watch(function(){
                                            return $scope.file
                                        },function(){
                                            $scope.upload($scope.file);
                                        });
                                        $scope.upload = function (file){
                                            if(file){
                                                Upload.upload({
                                                    url:'/home',
                                                    method:'POST',
                                                    data:{userId:$scope.user._Id},
                                                    file:file
                                                }).progress(function(evt){
                                                    console.log("firing");
                                                }).success(function(data){
                                                    
                                                }).error(function(error){
                                                    console.log(error);
                                                })
                                            }

                                        };
    
}]);