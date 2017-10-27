//Main file
var app = angular.module('superheroApp', ['addSuperheroCtrl','angularFileUpload','ui.bootstrap','galleryCtrl','detailCtrl', 'ngRoute', 'angular-filepicker'])
    .config(function($routeProvider, filepickerProvider){
        //The route provider handles the client request to switch route
        $routeProvider.when('/', {
                templateUrl: '/partials/addSuperhero.ejs',
                controller: 'addSuperheroController'
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
        filepickerProvider.setKey('ARSrCWK3SFGUDszMflnFYz');
    });

app.controller('pickerController', function($scope,$window,$timeout, $http,$upload, filepickerService){
    $scope.superhero = {};
    $scope.superhero.pictures = [];
    var file;
    $scope.heightStyle = {height:window.outerHeight-100};

    $scope.showModal = function () {
        $('#modalTwoModal').modal('show');
    }


   /* $scope.$watch('superhero.location', function (now, old) {
        if($scope.superhero.title ==  " " || $scope.superhero.description == " " ){
                $('#done').isDisabled = true;
        }
    })
*/

    $scope.changeValue = function(index){

        for(var i = 0;i< $scope.superhero.pictures.length; i++){
            $scope.superhero.pictures[i].isCover = false;
            }
        $scope.superhero.pictures[index].isCover = true;
        }

    $scope.superhero = {};
    $scope.superhero.coordinates = {};
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
          //console.log($scope.superhero.pictures[i].url);
          $scope.superhero.pictures[i].isCover = false;
        }
        $scope.picc =  $scope.superhero.pictures[0];
        $scope.superhero.pictures[0].isCover = true;

        $scope.remove = function(index){
            $scope.superhero.pictures.splice(index,1);
        }

           /* var fd = new FormData();
            fd.append('file', file);
            $http.post('/home/upload', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            $scope.upload = $upload.upload({
                url: '/home/upload',
                method: 'POST',
                data: {file: file, 'username': $scope.username}
            }).progress(function(evt) {
                //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                //console.log(data);
            });*/

    }

$scope.uploadMorePictures = function()
{
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
    $http.post('/home', $scope.superhero)
        .success(function (data) {

        })
        .error(function (data) {

        })
    var file = $scope.pics;
    
}
/*$scope.uploadPicturesDescribed = function()
{
    //$scope.superhero.morePictures[0].desc= "kkk";
    $http.post('/home',$scope.superhero)
        .success(function(data){
            
        })
        .error(function(data){
            
        })
}*/
    
   
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
                console.log($scope.superhero.morePictures[0].url);

                $scope.$apply();
                $('#modalTwoModal').modal('show');
                //$scope.createSuperhe()
            }
        );
    };
})