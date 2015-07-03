var DOMAIN = 'http://www.firstamarillo.org'
//DEVELOPMENT
var devtest = /localhost/.test(window.location.hostname);
if (devtest) {
	DOMAIN = 'http://localhost/greyback_shiny';
	isMobile = false;
}
devtest = /threeleaf/.test(window.location.hostname);
if (devtest) {
	DOMAIN = 'http://office.threeleaf.net:8080/greyback_shiny';
	isMobile = false;
}

var onclickFix = function (html) {
	html = html.replace(/href=\"\//ig, 'href="http://www.firstamarillo.org/');
	html = html.replace(/src=\"\//ig, 'src="http://www.firstamarillo.org/');
	return html.replace(/href=\"(.+?)\"/gi, 'onclick="window.open(\'$1\',\'_system\',\'location=yes\');"');
}

angular.module('greyback', ['ionic', 'ngCordova', 'ImgCache', 'ionic.service.core', 'ionic.service.push', 'ionic.service.deploy', 'ionic.service.analytics', 'greyback.controllers', 'greyback.services', 'greyback.utils'])

.run(function ($ionicPlatform, $ionicAnalytics, ImgCache) {
	console.log('run');
	$ionicPlatform.ready(function () {
		console.log('platform.ready');
		$ionicAnalytics.register();
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			$cordovaStatusBar.style(2);
		}

		ImgCache.$init();
	});
})

.filter('trusted', ['$sce', function ($sce) {
		return function (url) {
			return $sce.trustAsResourceUrl(url);
		};
	}])

.config(function ($ionicAppProvider, ImgCacheProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	console.log('config');
	// Identify app
	$ionicAppProvider.identify({
		// The App ID (from apps.ionic.io) for the server
		app_id: 'ebce0aa4',
		// The public API key all services will use for this app
		api_key: '2223c370a0970d9ce05985bde30b20595983a768fea620bb',
		// Set the app to use development pushes
		dev_push: true
	});

	ImgCacheProvider.manualInit = true;

	$ionicConfigProvider.backButton.previousTitleText(false).text('<i class="threeleaf">5</i>').icon('');
	$ionicConfigProvider.tabs.position('bottom');

	$stateProvider

	.state('menu', {
		url: "/menu",
		abstract: true,
		templateUrl: "templates/menu.html",
		controller: 'AppController',
		resolve: {
			headers: function (NewsService) {
				console.log('menu headers resolve');
				return NewsService.latest('headers');
			},
			articles: function (NewsService) {
				console.log('menu articles resolve');
				return NewsService.latest('articles');
			},
//			series: function (MessagesService) {
//				console.log('menu series resolve');
//				return MessagesService.latest();
//			}
		}
	})

	.state('menu.tabs', {
		url: "/tabs",
		abstract: true,
		views: {
			'menuContent': {
				templateUrl: "templates/tabs.html",
			}
		}
	})

	.state('menu.tabs.home', {
		url: "/home",
		views: {
			'tab-home': {
				templateUrl: "templates/home.html",
				controller: 'HomeController',
			}
		},
//		resolve: {
//			headers: function (NewsService) {
//				console.log('menu.tabs.home headers resolve');
//				return NewsService.latest('headers');
//			},
//			articles: function (NewsService) {
//				console.log('menu.tabs.home articles resolve');
//				return NewsService.latest('articles');
//			}
//		}
	})

	.state('menu.tabs.article', {
		url: '/article/:articleIndex/:category',
		views: {
			'tab-home': {
				templateUrl: 'templates/article.html',
				controller: 'NewsController'
			}
		},
		resolve: {
			article: function (NewsService, $stateParams) {
				console.log('menu.tabs.article articles resolve');
				return NewsService.article($stateParams.articleIndex, $stateParams.category)
			}
		}
	})

	.state('menu.tabs.post', {
		url: '/post/:postIndex',
		views: {
			'tab-home': {
				templateUrl: 'templates/post.html',
				controller: 'CommunityController'
			}
		},
		resolve: {
			post: function (CommunityService, $stateParams) {
				console.log('menu.tabs.post post resolve');
				return CommunityService.post($stateParams.postIndex)
			}
		}
	})

	.state('menu.tabs.series', {
		url: '/series',
		views: {
			'tab-series': {
				templateUrl: 'templates/series.html',
				controller: 'MessagesController'
			}
		},
		resolve: {
			series: function (MessagesService) {
				console.log('menu.tabs.series series resolve');
				return MessagesService.latest();
			}
		}
	})

	.state('menu.tabs.sermons', {
		url: '/sermons/:seriesIndex',
		views: {
			'tab-series': {
				templateUrl: 'templates/sermons.html',
				controller: 'MessagesController'
			}
		}
	})

	.state('menu.tabs.sermon', {
		url: '/sermon/:sermonIndex',
		views: {
			'tab-series': {
				templateUrl: 'templates/sermon.html',
				controller: 'MessageController'
			}
		},
		resolve: {
			sermon: function (MessagesService, $stateParams) {
				console.log('menu.tabs.sermon sermon resolve');
				return MessagesService.sermon($stateParams.sermonIndex);
			}
		}
	})

	.state('menu.tabs.news', {
		url: "/news",
		views: {
			'tab-news': {
				templateUrl: "templates/news.html",
				controller: 'HomeController',
			}
		},
		resolve: {
			articles: function (NewsService) {
				console.log('menu.tabs.news articles resolve');
				return NewsService.latest('articles');
			}
		}
	})

	.state('menu.tabs.article_details', {
		url: '/article_details/:articleIndex/:category',
		views: {
			'tab-news': {
				templateUrl: 'templates/article.html',
				controller: 'NewsController'
			}
		},
		resolve: {
			article: function (NewsService, $stateParams) {
				console.log('menu.tabs.article_details article resolve');
				return NewsService.article($stateParams.articleIndex, $stateParams.category)
			}
		}
	})

	.state('menu.tabs.events', {
		url: '/events',
		views: {
			'tab-giving': {
				templateUrl: 'templates/events.html'
			}
		}
	})

	.state('menu.tabs.giving', {
		url: '/giving',
		views: {
			'tab-giving': {
				templateUrl: 'templates/giving.html'
			}
		}
	})

	.state('menu.tabs.about', {
		url: '/about',
		views: {
			'tab-static': {
				templateUrl: 'templates/about.html'
			}
		}
	})

	.state('menu.tabs.contact', {
		url: '/contact',
		views: {
			'tab-static': {
				templateUrl: 'templates/contact.html'
			}
		}
	})

	.state('menu.tabs.staff', {
		url: '/settings',
		views: {
			'tab-static': {
				templateUrl: 'templates/staff.html',
				controller: 'StaffController'
			}
		}
	})

	.state('menu.tabs.developer', {
		url: '/developer',
		views: {
			'tab-static': {
				templateUrl: 'templates/developer.html'
			}
		}
	})

	.state('menu.tabs.settings', {
		url: '/settings',
		views: {
			'tab-static': {
				templateUrl: 'templates/settings.html',
				controller: 'SettingsController'
			}
		}
	})

	.state('full', {
		url: "/full",
		abstract: true,
		templateUrl: "templates/full.html",
		resolve: {
			test: function ($q, $timeout) {
				var deferred = $q.defer();
				$timeout(function () {
					deferred.resolve('Hello!');
				}, 100);
				return deferred.promise;
			}
		}
	})

	.state('login', {
		url: "/login",
		templateUrl: "templates/login.html",
	})

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/menu/tabs/home');
});