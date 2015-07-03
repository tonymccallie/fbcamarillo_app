angular.module('greyback.controllers', [])

.controller('AppController', function ($scope, $ionicDeploy, $ionicActionSheet, $location, $ionicPlatform, $state, $ionicSideMenuDelegate, AudioFactory) {
	console.log('AppController');
	//app wide variables
	$scope.DOMAIN = DOMAIN;
	$scope.imageDir = DOMAIN + '/img/thumb/';
	$scope.logs = [];
	$scope.log = function (obj) {
		$scope.logs.push(moment().format('h:mm:ss') + ': ' + obj);
	}
	
	$ionicPlatform.ready(function () {
		$scope.log('Ionic Deploy: Checking for updates');
//		$ionicDeploy.check().then(function (hasUpdate) {
//			$scope.log('Ionic Deploy: Update available: ' + hasUpdate);
//			$scope.hasUpdate = hasUpdate;
//			if(hasUpdate) {
//				$ionicActionSheet.show({
//					titleText: 'There is an update available',
//					buttons: [
//						{ text: 'Update Now' }
//					],
//					buttonClicked: function(index) {
//						$location.path('/menu/tabs/settings');
//					},
//					cancelText: 'Later',
//					cancel: function() {
//						return true;
//					}
//				});
//			}
//		}, function (err) {
//			$scope.log('Ionic Deploy: Unable to check for updates', err);
//		});
	});
	
	$scope.audio = {
		MessageMessage: {
			filename: null
		}
	};
	$scope.audioStats = {
		current: 0,
		duration: 0,
		percentage: 3
	};
	$scope.audioPlayer = null;
	$scope.videoPlayer = null;

	$scope.test = 'test';

	$scope.showMenu = function () {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.showRightMenu = function () {
		$ionicSideMenuDelegate.toggleRight();
	};

	$scope.setAudio = function (audio) {
		$scope.audio = audio;
		$scope.showRightMenu();
		AudioFactory.set(DOMAIN + '/play/mp3/' + audio.MediaAudio.id + '/play.mp3');
		AudioFactory.play();
		AudioFactory.timer(function (duration, current) {
			var percentage = (current / duration) * 100;
			if (percentage < 3) {
				$scope.audioStats.percentage = 3;
			} else {
				$scope.audioStats.percentage = percentage;
			}
			$scope.audioStats.duration = moment.unix(duration).format('mm:ss');
			$scope.audioStats.current = moment.unix(current).format('mm:ss');
			$scope.$apply();
		});
		//		setTimeout(function(){
		//			$scope.audioPlayer = document.getElementById('message_audio_player');
		//			$scope.audioPlayer.src = DOMAIN+'/play/mp3/'+audio.MediaAudio.id+'/play.mp3';
		//			$scope.play();
		//		},0);
	}

	$scope.playAudio = function () {
		AudioFactory.play();
	}

	$scope.pauseAudio = function () {
		AudioFactory.play();
		AudioFactory.pause();
	}

	$scope.stopAudio = function () {
		AudioFactory.stop();
	}

	$scope.fwdAudio = function () {
		AudioFactory.fwd();
	}

	$scope.rwdAudio = function () {
		AudioFactory.rwd();
	}

	$scope.scrubAudio = function (event) {
		var progress_bar = document.getElementById('player_progress');
		var left_edge = window.screen.width - 275 + progress_bar.offsetLeft;
		var percentage = (event.pageX - left_edge) / progress_bar.offsetWidth;
		AudioFactory.scrub(percentage);
	}

	$scope.playVideo = function () {
		$scope.videoPlayer.play();
	};
})

.controller('HomeController', function ($scope, $q, $ionicModal, $timeout, $ionicSlideBoxDelegate, articles, headers, ImgCache, NewsService) {
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
	$scope.headers = headers;

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
		//var headersPromise = NewsService.update('headers');
		var newsPromise = NewsService.update('articles');
		
		newsPromise.then(function(data) {
			$scope.articles = data;
			$scope.$broadcast('scroll.refreshComplete');
		});

//		$q.all([headersPromise, newsPromise]).then(function (data) {
//			$scope.headers = data[0];
//			$scope.articles = data[1];
//			$scope.$broadcast('scroll.refreshComplete');
//			$ionicSlideBoxDelegate.update();
//		});
	}
	
	//$scope.update();
})

.controller('NewsController', function ($scope, $sce, article) {
	$scope.article = article;
	$scope.trust = function (snippet) {
		return $sce.trustAsHtml(snippet);
	};
})

.controller('MessagesController', function ($scope, $stateParams, $location, MessagesService, series) {
	console.log('MessagesController');
	$scope.series = series;
	$scope.latestMessage = MessagesService.latestMsg();
	
	$scope.update = function () {
		console.log('SeriesController.update');
		var seriesPromise = MessagesService.update();

		seriesPromise.then(function (data) {
			$scope.latestMessage = MessagesService.latestMsg();
			$scope.series = series;
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
	
	$scope.update();
	
	$scope.selectedSeries = null;
	$scope.sermons = [];
	if (typeof $stateParams.seriesIndex !== 'undefined') {
		$scope.selectedSeries = $scope.series[$stateParams.seriesIndex];
		MessagesService.getSeries($scope.selectedSeries.id).then(function(data) {
			$scope.sermons = data;
		});
	}
})

.controller('MessageController', function ($scope, $stateParams, $location, MessagesService, sermon) {
	console.log('MessageController');
	$scope.sermon = sermon;
})

.controller('StaffController', function ($scope, $stateParams, $location) {
	console.log('StaffController');
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
			console.log(err);
		});
	}
});