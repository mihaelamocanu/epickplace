/**
 * Created by mihaela on 8/14/16.
 */
var app = angular.module('myApp', ['ngRoute','angularFileUpload','angular-filepicker','ui.bootstrap'])
    .config(function($routeProvider,filepickerProvider){
        //The route provider handles the client request to switch route
        $routeProvider.when('/', {
                templateUrl: '/partials/menu.ejs',
                controller: 'fastHotel'
            })
            .when('/rooms', {
                templateUrl: '/partials/rooms.ejs',
                controller:'hotelRooms',
                title:"Rooms"
            })
            .when('/amenities', {
                templateUrl: '/partials/amenities.ejs',
                controller:'hotelRooms',
            })
            .when('/pictures', {
                templateUrl: '/partials/pictures.ejs',
                controller:'hotelRooms',
            })

            .otherwise({redirectTo:'/page1'});
        //Add the API key to use filestack service

    });
app.controller('fastHotel',function($scope,$http,$timeout,filepickerService){
    $scope.superhero={};
    $scope.superhero.picture={};
 
    $scope.superhero.picture.url = "/uploads/uploadphoto.jpeg";
   
    $scope.onFileSelect = function($file) {
        
        $scope.picture = '';
        $scope.pics = $file;
        var file;

 
        //$files: an array of files selected, each file has name, size, and type.
        function  readImage(file){
            var fileReader = new FileReader(file);

            fileReader.onload = function (e) {
                $timeout(function () {
                    file.url = e.target.result;
                });

            }
            fileReader.readAsDataURL(file);
            return file;
        }

            var s = readImage($file[0]);
            $scope.superhero.picture = s;

            console.log($scope.superhero.picture);

        }
    
    $scope.uploadPicture = function()
    {
            var file = $scope.pics[0];
        $scope.superhero.coordinates ={};

            $scope.getLati = function () {

                var val = document.getElementById("lat").value;

                return val;
            }
            $scope.getLongi = function () {

                var val = document.getElementById("long").value;

                return val;
            }
            $scope.superhero.coordinates.latitude = $scope.getLati();
            $scope.superhero.coordinates.longitude = $scope.getLongi();

            $scope.superhero.picture.url = "http://localhost:3000/uploads/" + $scope.pics[0].name;
            var fd = new FormData();
            fd.append('file', file);

            $http.post('/home/upload', fd, {//upload to uploads file
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
        
             $http.post('/host', $scope.superhero)
            .success(function (data) {

            })
            .error(function (data) {

            })
        var file = $scope.pics;
       
    }


})
app.controller('hotelRooms',function($scope,$http,$rootScope,$timeout,rooms,amenities){

    $scope.title = '';
    $scope.hotel_rooms = rooms;
    $scope.amenities = amenities;
    $scope.superhero = {};
    $scope.hoverEdit = false;
    $scope.superhero.pictures = [];
  

    $scope.selected = function(index){
        rooms.isSelected(index);
    }
    $scope.select = function(index){

        amenities.isSelected(index);
    }
    $scope.onFileSelect = function($files) {
        $scope.superhero.pictures = [];
        $scope.pics = $files;

        //$files: an array of files selected, each file has name, size, and type.
        function  readImage(file){
            var fileReader = new FileReader(file);

            fileReader.onload = function (e) {
                $timeout(function () {
                    file.url = e.target.result;
                });

            }
            fileReader.readAsDataURL(file);
            return file;
        }
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.superhero.pictures[i] = readImage(file);
           
           
        }
       
       

        $scope.remove = function(index){
            $scope.superhero.pictures.splice(index,1);
        }
        

    }
    $scope.uploadMorePictures = function()
    {

        for(var i = 0;i< $scope.pics.length; i++) {
            var file = $scope.pics[i];

            $scope.superhero.pictures[i].url = "http://localhost:3000/uploads/" + $scope.pics[i].name;
            var fd = new FormData();
            fd.append('file', file);

            $http.post('/home/upload', fd, {//upload to upload file
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
        }
        $http.post('/host/pictures', $scope.superhero)
            .success(function (data) {

            })
            .error(function (data) {

            })
        var file = $scope.pics;
    
    }
    $(document).ready(function(){
        $("#first").click(function(){
            $(".row-hg-2").css('border', '1px solid white');
            $(".row-hg-2").css('box-shadow','none');
            $(this).css('border', '1px solid #602042');
            $(this).css('box-shadow','1px 1px 1px 1px #602042');
           /* $('#title').css('visibility','visible');
            $('#here').css('visibility','hidden');*/
        });
        $("#second").click(function(){
            $(".row-hg-2").css('border', '1px solid white');
            $(".row-hg-2").css('box-shadow','none');
            $(this).css('border', '1px solid #602042');
            $(this).css('box-shadow','1px 1px 1px 1px #602042');
            /*$('#title').css('visibility','visible');
            $('#here').css('visibility','hidden');*/
        });
        $("#third").click(function(){
            $(".row-hg-2").css('border', '1px solid white');
            $(".row-hg-2").css('box-shadow','none');
            $(this).css('border', '1px solid #602042');
            $(this).css('box-shadow','1px 1px 1px 1px #602042');
            /*$('#title').css('visibility','visible');
            $('#here').css('visibility','hidden');*/
        });
        $("#forth").click(function(){
            $(".row-hg-2").css('border', '1px solid white');
            $(".row-hg-2").css('box-shadow','none');
            $(this).css('border', '1px solid #602042');
            $(this).css('box-shadow','1px 1px 1px 1px #602042');
           /* $('#title').css('visibility','visible');
            $('#here').css('visibility','hidden');*/
        });
    });

    $scope.setRooms = function(){
        var hr = [];
        for(var i=0;i<rooms.length;i++){

            if(rooms[i].isSelected){
                hr[i]={};
                hr[i].name = "";
                hr[i].price = "";
                hr[i].name = rooms[i].room;
                hr[i].price = rooms[i].price;
            }

        }
        console.log(hr);
        $http.post('/host/rooms', hr)
            .success(function (data) {

            })
            .error(function (data) {

            })
    }
    $scope.setAmenities = function(){
        var hr = [];
        for(var i=0;i<amenities.length;i++){

            if(amenities[i].isSelected){
                hr[i]={};
                hr[i].name = "";

                hr[i].name = amenities[i].name;

            }

        }

        $http.post('/host/amenities', hr)
            .success(function (data) {

            })
            .error(function (data) {

            })
    }

})
app.controller('hotelContact',function($scope,$http,$timeout,filepickerService){
    $scope.superhero={};
    $scope.superhero.picture={};

    $scope.superhero.picture.url = "/uploads/uploadphoto.jpeg";

    $scope.onFileSelect = function($file) {

        $scope.picture = '';
        $scope.pics = $file;
        var file;


        //$files: an array of files selected, each file has name, size, and type.
        function  readImage(file){
            var fileReader = new FileReader(file);

            fileReader.onload = function (e) {
                $timeout(function () {
                    file.url = e.target.result;
                });

            }
            fileReader.readAsDataURL(file);
            return file;
        }

        var s = readImage($file[0]);
        $scope.superhero.picture = s;

        console.log($scope.superhero.picture);

    }
 

    $scope.uploadPicture = function()
    {
        var file = $scope.pics[0];
        $scope.superhero.coordinates ={};

        $scope.getLati = function () {

            var val = document.getElementById("lat").value;

            return val;
        }
        $scope.getLongi = function () {

            var val = document.getElementById("long").value;

            return val;
        }
        $scope.superhero.coordinates.latitude = $scope.getLati();
        $scope.superhero.coordinates.longitude = $scope.getLongi();

        $scope.superhero.picture.url = "http://localhost:3000/uploads/" + $scope.pics[0].name;
        var fd = new FormData();
        fd.append('file', file);

        $http.post('/home/upload', fd, {//upload to uploads file
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })

        $http.post('/host/contact', $scope.superhero)
            .success(function (data) {

            })
            .error(function (data) {

            })
        var file = $scope.pics;

    }


})
app.factory('rooms',function(){
    var hotel_rooms = [];
    for(var i=0;i<=16;i++)
    {
        hotel_rooms[i]={};
        hotel_rooms[i].room="";
        hotel_rooms[i].price="";
        hotel_rooms[i].description='';
        hotel_rooms[i].isSelected=false;
    }
 
    {
        hotel_rooms[0].room = "SINGLE ROOM";
        hotel_rooms[0].description = "A room which has single bed facility";
        hotel_rooms[1].room = "DOUBLE ROOM";
        hotel_rooms[1].description = "A room which has double bed facility";
        hotel_rooms[2].room = "DOUBLE DOUBLE ROOM";
        hotel_rooms[2].description = "A room which has two double bed facility";
        hotel_rooms[3].room = "TWIN ROOM";
        hotel_rooms[3].description = "A room which has two single bed separated by a center table";
        hotel_rooms[4].room = "INTERCONNECTING ROOMS";
        hotel_rooms[4].description = "Two rooms which share a common door,mostly used by families";
        hotel_rooms[5].room = "ADJOINING ROOMS";
        hotel_rooms[5].description = "Two rooms which share a common hall,mostly preferred by groups";
        hotel_rooms[6].room = "HOLLYWOOD TWIN  ROOM";
        hotel_rooms[6].description = "A room which has two single bed but shares a common head board";
        hotel_rooms[7].room = "DUPLEX";
        hotel_rooms[7].description = "A room which is been spread on two floors connected by an internal staircase";
        hotel_rooms[8].room = "CABANA";
        hotel_rooms[8].description = "A room which is near a water body or beside swimming pool";
        hotel_rooms[9].room = "STUDIO ROOM";
        hotel_rooms[9].description = "A room which a sofa-cum-bed facility";
        hotel_rooms[10].room = "PARLOR";
        hotel_rooms[10].description = "A room which is used for sitting and cannot be used for sleeping purpose";
        hotel_rooms[11].room = "LANAI";
        hotel_rooms[11].description = "A room which oversees a scenic beauty e.g. a Garden,landscape or waterfall";
        hotel_rooms[12].room = "EFFICIENCY ROOM";
        hotel_rooms[12].description = "A room kitchen facility";
        hotel_rooms[13].room = "HOSPITALITY ROOM";
        hotel_rooms[13].description = "A room where hotel staff would entertain their guests";
        hotel_rooms[14].room = "SUITE ROOM";
        hotel_rooms[14].description = "A room comprises of two or more bedrooms, a living roomand a dinning area";
        hotel_rooms[15].room = "KING BEDROOM";
        hotel_rooms[15].description = "A room with a king sized bed";
        hotel_rooms[16].room = "QUEEN BEDROOM";
        hotel_rooms[16].description = "A room with a queen sized bed";
    }
    hotel_rooms.isSelected = function(index){
        hotel_rooms[index].isSelected = !(hotel_rooms[index].isSelected);
    }
    return hotel_rooms;
})
app.factory('amenities',function(){
    var amenities = [];
    for(var i=0;i<12;i++){
        amenities[i]={};
        amenities[i].name = {};
        amenities[i].isSelected = false;

    }

    amenities[0].name="Free Parking";
    amenities[1].name="Wi-Fi Internet";
    amenities[2].name="24/7 Laundry Service";
    amenities[3].name="Gym and Beauty Care";
    amenities[4].name="Room Dining";
    amenities[5].name="Central Air Condition";
    amenities[6].name="Luxury Swimming Pool";
    amenities[7].name="Airport & local transfers";
    amenities[8].name="Bar & Restaurant";
    amenities[9].name="Ticket Booking";
    amenities[10].name="Currency conversion";
    amenities[11].name="Conference center";

    amenities.isSelected = function(index){

        amenities[index].isSelected = !(amenities[index].isSelected);
        
    }

    return amenities;
})