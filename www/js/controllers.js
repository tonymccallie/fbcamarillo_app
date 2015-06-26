angular.module('greyback.controllers', [])

.controller('AppController', function ($scope, $ionicDeploy, $ionicActionSheet, $location, $ionicPlatform) {
	console.log('AppController');
	//app wide variables
	$scope.DOMAIN = DOMAIN;
	$scope.imageDir = DOMAIN + '/img/thumb/';
	$scope.logs = [];
	$scope.log = function (obj) {
		$scope.logs.push(obj);
	}
	$ionicPlatform.ready(function () {
		$scope.log('Ionic Deploy: Checking for updates');
		$ionicDeploy.check().then(function (hasUpdate) {
			$scope.log('Ionic Deploy: Update available: ' + hasUpdate);
			$scope.hasUpdate = hasUpdate;
			if(hasUpdate) {
				$ionicActionSheet.show({
					titleText: 'There is an update available',
					buttons: [
						{ text: 'Update Now' }
					],
					buttonClicked: function(index) {
						$location.path('/menu/tabs/settings');
					},
					cancelText: 'Later',
					cancel: function() {
						return true;
					}
				});
			}
		}, function (err) {
			$scope.log('Ionic Deploy: Unable to check for updates', err);
		});
	});
})

.controller('HomeController', function ($scope, $q, $ionicModal, $timeout, $ionicSlideBoxDelegate, articles, posts, ImgCache, NewsService, CommunityService) {
	console.log('HomeController');
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	// Form data for the login modal
	$scope.loginData = {};

	$scope.articles = articles;
	$scope.posts = posts;

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope
	}).then(function (modal) {
		$scope.modal = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function () {
		$scope.modal.hide();
	};

	// Open the login modal
	$scope.login = function () {
		$scope.modal.show();
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function () {
		$scope.log('Doing login', $scope.loginData);

		// Simulate a login delay. Remove this and replace with your login
		// code if using a login system
		$timeout(function () {
			$scope.closeLogin();
		}, 1000);
	};

	$scope.update = function () {
		console.log('HomeController.update');
		var newsPromise = NewsService.update();
		var communityPromise = CommunityService.update();

		$q.all([newsPromise, communityPromise]).then(function (data) {
			console.log(data);
			$scope.articles = data[0];
			$ionicSlideBoxDelegate.update();
			$scope.posts = data[1];
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
})

.controller('NewsController', function ($scope, article) {
	$scope.article = article;
})

.controller('CommunityController', function ($scope, post) {
	$scope.post = post;
})

.controller('SettingsController', function ($scope, $ionicDeploy) {
	$scope.progress = 0;
	// Update app code with new release from Ionic Deploy
	$scope.doUpdate = function () {
		$ionicDeploy.update().then(function (res) {
			$scope.log('Ionic Deploy: Update Success! ', res);
		}, function (err) {
			$scope.log('Ionic Deploy: Update error! ', err);
		}, function (prog) {
			$scope.progress = prog;
			$scope.log('Ionic Deploy: Progress... ', prog);
		});
	};

	// Check Ionic Deploy for new code
	$scope.checkForUpdates = function () {
		$scope.log('Ionic Deploy: Checking for updates');
		$ionicDeploy.check().then(function (hasUpdate) {
			$scope.log('Ionic Deploy: Update available: ' + hasUpdate);
			$scope.hasUpdate = hasUpdate;
		}, function (err) {
			$scope.log('Ionic Deploy: Unable to check for updates', err);
		});
	}
});