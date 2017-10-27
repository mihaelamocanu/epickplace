/**
 * Created by mihaela on 6/4/16.
 */
//Main file
var app = angular.module('picturesApp', ['addSuperheroCtrl', 'galleryCtrl','detailCtrl', 'ngRoute','ngAnimate', 'ui.bootstrap','angular-filepicker'])
    .config(function($routeProvider, filepickerProvider){
        //The route provider handles the client request to switch route

        //Add the API key to use filestack service
        filepickerProvider.setKey('ARSrCWK3SFGUDszMflnFYz');
        var description,url,title,latitude,longitude;

      
    });
app.controller('pickerController', function($scope,$log, $http,$uibModal,$window,filepickerService) {
    $scope.superhero = {};
    $scope.height = $window.innerHeight;
    $scope.width = $window.innerWidth;
    $scope.style={
        
        "height" : $window.innerHeight/1.5,
        "width":$window.innerWidth/1.5,
        "margin":"7px"
    }

    

    $http.get('/home/edit_album').success(function (pictures) {
        $scope.pictures = pictures.out.pictures;
        
    });

    $scope.open = function (url,description,title,lat,lng,location) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                data: function () {
                    data = {
                        "url":url,
                        "description":description,
                        "title":title,
                        "lat":lat,
                        "lng":lng,
                        "location":location
                    }
                   return  data;
                    
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.data = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };


    $scope.getLati = function () {

        var val = document.getElementById("lat").value;
   
        return val;
    }
    $scope.getLongi = function () {

        var val = document.getElementById("long").value;
       
        return val;
    }
    $scope.finish = function (location,latitude,longitude) {

     
        $http({
            method: 'post',
            url: '/home/edit_picture',
            headers: {'Content-Type': 'application/json'},
            data: {"url":url,
                "description":description,
                "title":title,
                "latitude":latitude,
                "longitude":longitude,
                "location":location},
            size:'20px'
        }).success(function (a) {

            window.location = "/home/pictures";

        }).error(function (a) {

            $scope.show_login = true;
        });
    }


    $scope.createSuperhero = function () {
        $http.post('/home', $scope.superhero)
            .success(function (data) {
                console.log(JSON.stringify(data));
                //Clean the form to allow the user to create new superheroes
                $scope.superhero = {};
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
    //Single file upload, you can take a look at the options
    $scope.upload = function () {
        filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function (Blob) {
               
                $scope.superhero.picture = Blob;
                $scope.$apply();
                $scope.createSuperhero();
            }
        );
    };
    //Multiple files upload set to 3 as max number
    $scope.uploadMultiple = function () {

        filepickerService.pickMultiple(
            {
                mimetype: 'image/*',
                language: 'en',
                maxFiles: 3,
                services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE', 'IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function (Blob) {
                console.log(JSON.stringify(Blob));
                $scope.superhero.morePictures = Blob;
                $scope.$apply();
                $scope.createSuperhero();
            }
        );
    };
});
    
app.controller('ModalInstanceCtrl',function ($scope,$window, $uibModalInstance,data) {
    
    $scope.picture = data.url;
    $scope.description = data.description;
    $scope.title = data.title;
    latitude = data.lat;
    longitude = data.lng;

   /* $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };
*/
    $scope.cancel = function () {
       
        description = $scope.description;
        title = $scope.title;
        url = data.url;


        if (angular.isUndefined(data.lat))
            data.lat = "";

        if (angular.isUndefined(data.lng))
            data.lng = "";

        if (angular.isUndefined(data.location))
            data.location = "";

        document.getElementById("lat").value = data.lat;
        document.getElementById("long").value = data.lng;
        document.getElementById("pac-input").value = data.location;
        $uibModalInstance.dismiss('cancel');
    };
});


