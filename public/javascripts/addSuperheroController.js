var addCtrl = angular.module('addSuperheroCtrl', []);
addCtrl.controller('addSuperheroController', function($scope, $http,$route,$window, filepickerService){
	$scope.superhero = {};
	 $http.get('/home/user_page').success(function (username) {
		 $scope.firstname = username.firstname;
		 $scope.lastname = username.lastname;
		 $scope.avatar = username.avatar;
		 $scope.form = username.form;
	});
	$scope.jobs = ["Accountant","Actor","Actuary","Animal Keeper", "Announcer","Aquarium Careers", "Archeologist",
	"Architect","Dentist","Artist","Athlete","Bird Specialist","Bookkeping Clerk","Brain Scientist","Bdget Analyst",
	"Car Mechanic","Career Advisor","Carpenter","Chef","Head Cook","Chemist",""];
	$scope.types = ["occasionally","regular", "avid"];
	$scope.hobbies = ["traveller","photographer"];
	$scope.ImgVis = "hidden";


	
	$scope.showModal = function () {
		$('#modalOneModal').modal('show');
	}

	$scope.changeVis = function(){
		$scope.ImgVis = "visible";
	}

	$scope.changeHid = function(){
		$scope.ImgVis = "hidden";
	}

	$scope.showPopover = function() {
		$scope.popoverIsVisible = true;
	};

	$scope.hidePopover = function () {
		$scope.popoverIsVisible = false;
	};
	
	$scope.slides=[];
	var k=0;

	var slides = $scope.slides;
	
	
	

	$scope.currentIndex = 0;
	$scope.active = 0;
	$scope.setCurrentSlideIndex = function (index) {
		$scope.currentIndex = index;
	};

	$scope.isCurrentSlideIndex = function (index) {
		$scope.active = index;
		return $scope.currentIndex === index;
	};
	$scope.isActive = function(index)
	{
		return $scope.active === index;
	}
	$scope.getImage=function(){

		 if ($scope.avatar && $scope.avatar.indexOf("http")>-1)
		 	return $scope.avatar;
		return "data:image/png;base64,"+$scope.avatar;
		
	}
	$http.get("/reg/albums")
		.success(function(data){
			var albums = data.albums;
			
			for(var i=0;i<albums.length;i++)
				for(var j=0;j<albums[i].pictures.length;j++)
				{
					$scope.slides[k++]=albums[i].pictures[j].url;
				
				}
		})
		.error(function(data){
			
		});
	$http.get("/reg/source")
		.success(function (data) {
			
			if(data=="log") {
				$(window).load(function () {
					$('#modalOneModal').modal('show');
				});
			}

		})
		.error(function (data) {
			console.log(data);
		})

	$scope.editProfile = function () {
		
		$http.post('/home/editProfile',$scope.form)
			.success(function(data){

			})
			.error(function(data){
				
			})
	}
	$scope.createSuperhero = function(){
		$http.post('/home/avatar', $scope.superhero)
			.success(function(data){
				console.log(JSON.stringify(data));
				$scope.superhero = {};
				$http.get('/home').success(function(data){
					console.log("success");
						window.location = "/home";
				})
					.error(function(data){
						console.log("not good");
					});
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
				$scope.superhero.avatar = Blob;
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
			}
        );
	};	
})
