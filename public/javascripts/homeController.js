/**
 * Created by mihaela on 8/3/16.
 */

var app = angular.module('homeApp', ['ui.bootstrap', 'ngRoute','infinite-scroll'])
    .config(function($routeProvider){
        //The route provider handles the client request to switch route
        $routeProvider.when('/', {
                templateUrl: 'partials/presentation.ejs',
                controller: 'presentationController'
            })
            .when('/page1', {
                templateUrl: 'partials/gallery.html',
                controller: 'galleryController'
            })
            .when('/page2', {
                templateUrl: 'partials/detail.html',
                controller: 'detailController'
            })

            .otherwise({redirectTo:'/page1'});
        //Add the API key to use filestack service
        
    });
app.service('SharedProperties', function () {
    var _userName ;

   /* return {
        getUser:function () {

            return _userName
        },

        setUser:function(user) {
            console.log("setted"+user);
            _userName = user;
        }
    }*/
 var SharedProperties = this;
    SharedProperties.model = {
        'prop1': '',
        'prop2': ''
    };

});

app.controller('presentationController',function($http,$scope,$window,$rootScope,SharedProperties){


    $scope.height = $window.outerHeight + "px";
    $scope.width = '200px';

    var date = new Date(Date.now());

    $scope.albums_cover =[];

    var date = new Date(3000,30,01);
    var ok=false;
    var count = 0;
    $scope.vis = "hidden";

    $scope.photos = [];
    $scope.hoverIn = function(){
        $scope.hoverEdit = !$scope.hoverEdit;
    };

    $scope.hoverOut = function(){
        $scope.hoverEdit = !$scope.hoverEdit;
    };

    $scope.showModal = function (index) {
        $('#modalPictures').modal('show');
        $scope.index = index;
        $scope.photos = $scope.albums_cover[index].pictures;
        $scope.displayed_picture = $scope.photos[0].url;
        $scope.album_title = $scope.albums_cover[index].album_title;
        $scope.coordinates = $scope.albums_cover[index].coordinates;
        $scope.description = $scope.photos[0].description;
        console.log($scope.coordinates);
    }

    $http.get('/home/notifications')
        .success(function(data){
            $scope.aa =[];
            $scope.count = 0;

            if(data.notifications!= 'undefined') {
                for (var i = 0; i < data.notifications.length; i++) {
                    console.log(data.notifications[i].title);
                    $scope.aa.push(data.notifications[i]);

                    if ($scope.aa[i].read == false) {
                        $scope.count+= 1;
                    }
                }
            }
            console.log($scope.aa);

        })
        .error(function(data){

        });
    
    $scope.openTrip = function(index){

        console.log(index);
        console.log($scope.aa[index].id);
        var a = $scope.aa[index].id;
        $http.get('/home/gettrip',{
            params: {id:$scope.aa[index].id}
        })
        .success(function(data){
            console.log("DATA"+data.trip);
            $scope.trip = data.trip;
            console.log($scope.trip);
            $scope.name_planner = $scope.aa[index].name_planner;
                $('#modalTrip').modal('show');




        })
            .error(function (data)
            {

            });
    }
       
    
    $scope.rollright = function(){
    if($scope.photos.length!=1){

            count++;
        console.log($scope.photos.length);
            if(count == $scope.photos.length)
            {count=0;}
        console.log(count);
                $scope.displayed_picture = $scope.photos[count].url;
                $scope.description = $scope.photos[count].description;

        }

    }

    $scope.rollleft = function() {
        if ($scope.photos.length != 1) {
            console.log(count);
            count--;
            if (count == -1)
                count = $scope.photos.length - 1;
            $scope.displayed_picture = $scope.photos[count].url;
        }
    }

    $scope.changeVisibility = function () {

        if($scope.vis === "hidden"){
            console.log("hidden");
            $scope.vis = "visible";

        }
        else{
            $scope.vis = "hidden";

        }

    }

  


    $scope.myPagingFunction = function(){
        $http.get('/home/front',{
            params: { date: date }
        })
            .success(function(data){
                for(var i=0;i<data.array.length;i++){
                    $scope.albums_cover.push(data.array[i]);

                }

                date = data.array[data.array.length-1].date;
            })
            .error(function(data){

            })
    }

    $scope.animation = function(){

        ok = !ok;

        if(ok){
            $("#panel").animate({ "right":0 },"slow");
        }
        else{

            $("#panel").animate({"right":-200 },"slow");

        }

    }
    $scope.openPlanatrip = function(email)
    {   
       // SharedProperties.setUser("mmmm");
       /* window.location = "/planatrip/";
*/
        console.log($scope.index);
        console.log($scope.albums_cover[$scope.index]);
        $http({
            method:'post',
            url:'/planatrip/planatrip',
            headers: {'Content-Type':'application/json'},
            data:{"coordinates":$scope.albums_cover[$scope.index]}

        }).success(function (a) {

            window.location = "/planatrip/";

        }).error(function (a) {
            //alert(a);
            console.log("jjjjj");
            console.log(a);
            $scope.show_login = true;
        });
    }

    $scope.goToHost = function(){
        $http({
            method:'post',
            url:'/planatrip/gotohost',
            headers: {'Content-Type':'application/json'},
            data:{"album":$scope.trip.planification.hotels.hotel_id}

        }).success(function (a) {

            window.location.href = "/planatrip/";

        }).error(function (a) {
            //alert(a);
            console.log("jjjjj");
            console.log(a);
            $scope.show_login = true;
        });
    }
})





app.filter('cover',function(){
    return function(input){

        for(var i=0;i<input.length;i++)
            if(input[i].isCover==true){

                return input[i];
        }
    }
})

app.directive('key', function () {
    return {
        scope: {
            right:'&',
            left:'&',
        },
        controller: function ($scope) {

            $('body').on('keypress', function (evt) {
                if (evt.keyCode === 39) {

                    $scope.$apply(function(){
                        $scope.right();
                    });

                }
                if (evt.keyCode === 37) {
                    $scope.$apply(function(){
                        $scope.left();
                    });
                }
            })
        }
    }
})

app.directive('touchscreen', function () {
    return {
        restrict: 'A',
        link: function($scope, element) {

            element.bind('click', function(e) {

                $scope.$apply(function(){
                    $scope.changeVisibility();
                });

            });
        }
    };
});
