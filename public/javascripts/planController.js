/**
 * Created by mihaela on 8/22/16.
 */

var app = angular.module('myApp', ['ngRoute','ui.bootstrap','homeApp'])
    .config(function($routeProvider){
        //The route provider handles the client request to switch route
        $routeProvider.when('/', {
                templateUrl: '/partials/planHotel.ejs',
                controller: 'planController'
            })
            .when('/friends', {
                templateUrl: '/partials/planFriends.ejs',
                controller:'planFriends'
                
            })

            .otherwise({redirectTo:'/page1'});
        //Add the API key to use filestack service

    });

app.controller('planController',function($scope,$http,$timeout,setHotels){

/*console.log( SharedProperties.model.prop1);*/

    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1);
        var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }


    $scope.showModal = function (index) {
        console.log("hotelslink" + $scope.hotels[index].link);
        if ($scope.hotels[index].link == undefined) {
            $('#modalHotel').modal('show');
            $scope.index = index;
            for (var i = 0; i < $scope.hotels[index].pictures.length; i++) {
                $scope.hotels[index].pictures[i].isSelescted = false;
            }
            //$scope.hotels[index].pictures.isSelected = true;

            $scope.displayed_picture = $scope.hotels[index].picture.url;
        }
    }
    $scope.check = function(index){
        $scope.hotels[index].checked = ! $scope.hotels[index].checked;
        if($scope.hotels[index].checked){
            setHotels.set($scope.hotels[index]);
            setHotels.setAlbumId($scope.album);
            console.log($scope.hotels[index].id);
            setHotels.setId($scope.hotels[index].id);
        }
        console.log($scope.hotels[index].checked);
    }

    $scope.selectPicture = function(index_pic)
    {
        for(var i=0;i<$scope.hotels[$scope.index].pictures.length;i++){
            $scope.hotels[$scope.index].pictures[i].isSelected = false;
        }
        $scope.hotels[$scope.index].pictures[index_pic].isSelected = true;
        $scope.displayed_picture =  $scope.hotels[$scope.index].pictures[index_pic].url;
    }
    $scope.hotels = [];
    $scope.pictures = [];
    $http.get('/planatrip/hotels')
        .success(function(hotel){
            console.log("HOTEL" +hotel);
            $scope.album = hotel.album;
            $scope.lat = hotel.lat;
            $scope.longi = hotel.longi;
            for(var i=0;i<hotel.con.length;i++){


                $scope.hotels.push(hotel.con[i].contact);
                $scope.hotels[i].id = hotel.con[i]._id;
                $scope.hotels[i].pictures = hotel.con[i].pictures.pictures;
                $scope.hotels[i].checked = false;
                $scope.hotels[i].rooms = hotel.con[i].rooms;
                $scope.hotels[i].amenities = hotel.con[i].amenities;
                console.log($scope.hotels[0].pictures[0].url);
                $scope.hotels[i].distance = getDistanceFromLatLonInKm($scope.lat, $scope.longi, $scope.hotels[i].coordinates.latitude,
                    $scope.hotels[i].coordinates.longitude);

            }


        })
        .error(function(hotel){
           // console.log(hotel);

        });
    $http.get('/planatrip/properties')
        .success(function(hotels){
            //console.log(hotels.pro[0]);
            $scope.lat = hotels.lat;
            $scope.longi = hotels.longi;
            var l = $scope.hotels.length;
            for(var i=0;i<hotels.pro.length;i++){
                $scope.hotels.push(hotels.pro[i].property);
                $scope.hotels[i+l].distance = getDistanceFromLatLonInKm($scope.lat, $scope.longi, $scope.hotels[i+l].coordinates.latitude,
                    $scope.hotels[i+l].coordinates.longitude);
                //console.log($scope.hotels[i].distance);
            }

            //console.log($scope.hotels);

        })
        .error(function(hotels){
            //console.log(hotels);

        });
    



})
app.controller('planFriends',function ($scope,$http,setHotels) {
    $scope.searchFriends = function()
    {$scope.friends = []
        $http.get('/planatrip/friends',{
                params: { name: $scope.name }

            })
            .success(function(friend){
                console.log(friend);
                for(var i=0;i<friend.length;i++){
                    $scope.friends.push(friend[i]);
                    console.log($scope.friends[i]);
                }

            })
            .error(function(error){

            })

    }

    $scope.submit = function(){
        var planification = {};
        console.log($scope.title);
        planification['message']=$scope.message;
        planification['title']=$scope.title;
        planification['added_friends']=$scope.added_friends;
        planification['album']=setHotels.get();
        planification['hotels']=setHotels.getAlbumId();
        planification['hotel_id']=setHotels.getId();

        $http({
            method:'post',
            url:'/planatrip/planned',
            headers: {'Content-Type':'application/json'},
            data:{"planification":planification}

        }).success(function (a) {


            $scope.showAlert = function(ev) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('This is an alert title')
                        .textContent('You can specify some description text in here.')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Got it!')
                        .targetEvent(ev)
                );}

        }).error(function (a) {
            //alert(a);
            console.log("jjjjj");
            console.log(a);
            $scope.show_login = true;
        });
    }
    $scope.added_friends = [];
    $scope.addFriend = function(index){
        $scope.added_friends.push($scope.friends[index]);
    }
    $scope.removeFriends = function(index){
        $scope.added_friends.splice(index,1);
    }
})
app.factory('setHotels',function($window){
    var hotels,id,www;
    function setAlbumId(id){
        $window.localStorage.setItem('id',JSON.stringify(id));
    }
    function getAlbumId(){
        return $window.localStorage.getItem('id');
    }
    function getId(){
        return $window.localStorage.getItem('iid');
    }
    function setId(id){

        $window.localStorage.setItem('iid',id);
    }
 function set(hotels){
     console.log(hotels);
     this.hotels = hotels;
     $window.localStorage.setItem('hotel',JSON.stringify(this.hotels));
 }
    function get(){
        console.log("here");
        console.log($window.localStorage.getItem('hotel'));
        return $window.localStorage.getItem('hotel');
    }
    return {
        set: set,
        get: get,
        setAlbumId:setAlbumId,
        getAlbumId:getAlbumId,
        getId:getId,
        setId:setId
    }
})