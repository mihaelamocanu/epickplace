/**
 * Created by mihaela on 6/1/16.
 */
//Main file
var app = angular.module('albumsApp', ['addSuperheroCtrl', 'galleryCtrl','detailCtrl', 'ngRoute', 'angular-filepicker'])
    .config(function($routeProvider, filepickerProvider){
        //The route provider handles the client request to switch route
       
        //Add the API key to use filestack service
        filepickerProvider.setKey('ARSrCWK3SFGUDszMflnFYz');
    });
app.controller('pickerController', function($scope,$rootScope,$location, $http, filepickerService){
    $scope.superhero = {};
    $scope.$on('$locationChangeStart',function(evt, absNewUrl, absOldUrl) {
console.log(absNewUrl);
        var hashIndex = absOldUrl.indexOf('#');

        var oldRoute = absOldUrl.substr(hashIndex + 2);

        History.lastRoute = oldRoute;
console.log(oldRoute);
       
    });
    
    $http.get('/home/user_page').success(function (username) {
        $scope.firstname = username.firstname;
        $scope.lastname = username.lastname;
        $scope.albums = username.albums;
        $scope.avatar = username.avatar;
        console.log( $scope.albums);

    });

    $scope.getImage=function(){

        if ($scope.avatar && $scope.avatar.indexOf("http")>-1)
            return $scope.avatar;
        return "data:image/png;base64,"+$scope.avatar;

    }


        $scope.openAlbum = function(url)
        {
            //window.location('/home/pictures');
            $http({
                method:'post',
                url:'/home/pictures',
                headers: {'Content-Type':'application/json'},
                data:{"url":url}

            }).success(function (a) {
               
                window.location = "/home/pictures";

            }).error(function (a) {
                //alert(a);
                console.log("jjjjj");
                console.log(a);
                $scope.show_login = true;
            });
        }

    
        $scope.createSuperhero = function(){
        $http.post('/home', $scope.superhero)
            .success(function(data){
                console.log(JSON.stringify(data));
                //Clean the form to allow the user to create new superheroes
                $scope.superhero = {};
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    //Single file upload, you can take a look at the options
    $scope.upload = function(){
        filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob){
                console.log(JSON.stringify(Blob));
                $scope.superhero.picture = Blob;
                $scope.$apply();
                $scope.createSuperhero();
            }
        );
    };
    //Multiple files upload set to 3 as max number
    $scope.uploadMultiple = function(){

        filepickerService.pickMultiple(
            {
                mimetype: 'image/*',
                language: 'en',
                maxFiles: 3,
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob){
                console.log(JSON.stringify(Blob));
                $scope.superhero.morePictures = Blob;
                $scope.$apply();
                $scope.createSuperhero();
            }
        );
    };
});