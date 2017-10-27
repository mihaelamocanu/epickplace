/**
 * Created by mihaela on 9/12/16.
 */

var app = angular.module('myApp', ['ngRoute','ui.bootstrap','homeApp'])
            //Add the API key to use filestack service
{
    
}
    ;


app.controller('planController',function($scope,$http,$timeout) {

    $http.get('/planatrip/getplannedalbum')
        .success(function(hotel){
            console.log(hotel);
            
            $scope.album = hotel.albums;
            $scope.lat = hotel.lat;
            $scope.longi = hotel.longi;
            for(var i=0;i<hotel.con.length;i++){
                $scope.hotels.push(hotel.con[i].contact);
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
})
