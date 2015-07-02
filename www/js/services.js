angular.module('greyback.services', [])

.service('NewsService', function ($q, $http, $location, $ionicSlideBoxDelegate, $localStorage, $state) {
	console.log('NewsService');

	// 3 headers
	// 1 general
	var self = this;
	var articles = {
		headers: [],
		articles: []
	};

	self.local = function ($category) {
		console.log('NewsService.local ' + $category);
		var deferred = $q.defer();
		var localArticles = $localStorage.getArray('NewsLatest.' + $category);
		deferred.resolve(localArticles);
		return deferred.promise;
	}

	self.remote = function ($category) {
		console.log('NewsService.remote ' + $category);
		switch ($category) {
		case 'headers':
			//category_id 3 = headers
			var news_url = '/ajax/plugin/news/news_articles/json/limit:4/category:3';
			break;
		default:
			//category_id 1 = general
			var news_url = '/ajax/plugin/news/news_articles/json/limit:10/category:1';
			break;
		}
		
		var promise = $http.get(DOMAIN + news_url)
			.success(function (response, status, headers, config) {

			if (response.status === 'SUCCESS') {
				//empty articles
				articles[$category] = [];
				//populate
				var temp = {};
				angular.forEach(response.data, function (item) {
					item.NewsArticle.body = onclickFix(item.NewsArticle.body);
					articles[$category].push(item);
					temp = item;
				});

				//save to cache
				$localStorage.setArray('NewsLatest.' + $category, articles[$category]);
				$ionicSlideBoxDelegate.update();

			} else {
				alert('there was a server error for NEWS');
				console.log(response);
			}
		})
			.error(function (response, status, headers, config) {
			console.log(['error', data, status, headers, config]);
		});
		return promise;
	}

	self.update = function ($category) {
		console.log('NewsService.update ' + $category);
		var deferred = $q.defer();
		self.remote($category).then(function (remoteArticles) {
			deferred.resolve(articles[$category]);
		});
		return deferred.promise;
	}

	self.init = function ($category) {
		console.log('NewsService.init');
		var deferred = $q.defer();
		self.local($category).then(function (storedArticles) {
			if (storedArticles.length > 0) {
				console.log('NewsService: use local ' + $category);
				articles[$category] = storedArticles;
				deferred.resolve(articles[$category]);
			} else {
				console.log('NewsService: use remote ' + $category);
				self.remote($category).then(function (remoteArticles) {
					deferred.resolve(articles[$category]);
				});
			}
		});

		$location.path('/tab/home');
		$location.replace();

		return deferred.promise;
	}

	self.latest = function ($category) {
		console.log('NewsService.latestHeaders ' + $category);
		var deferred = $q.defer();
		if (articles[$category].length === 0) {
			console.log('NewsService: no articles ' + $category);
			self.init($category).then(function (initArticles) {
				articles[$category] = initArticles;
				deferred.resolve(initArticles);
			});
		} else {
			console.log('NewsService: had articles ' + $category);
			deferred.resolve(articles[$category]);
		}
		$ionicSlideBoxDelegate.update();
		return deferred.promise;
	}


	self.article = function ($articleIndex, $category) {
		console.log('NewsService.article ' + $category);
		var deferred = $q.defer();
		if (articles[$category].length === 0) {
			console.log('empty');
			$location.path('/tab/home');
			$location.replace();
			return null;
		} else {
			deferred.resolve(articles[$category][$articleIndex]);
		}
		return deferred.promise;
	}
})

.service('MessagesService', function ($q, $http, $location, $ionicSlideBoxDelegate, $localStorage, $state) {
	console.log('MessagesService');
	var self = this;
	var series = [];
	var latestMessage = {};
	var currentSeries = [];

	self.local = function () {
		console.log('MessagesService.local');
		var deferred = $q.defer();
		var localSeries = $localStorage.getArray('MessageSeries');
		var localLatest = $localStorage.getArray('MessageLatest');
		deferred.resolve([localSeries, localLatest]);
		return deferred.promise;
	}

	self.remote = function () {
		console.log('MessagesService.remote');
		var promise = $http.get(DOMAIN + '/ajax/plugin/message/message_series/json/category:1')
			.success(function (response, status, headers, config) {

			if (response.status === 'SUCCESS') {
				//empty articles
				series = [];
				latestMessage = {};
				//populate
				var temp = {};
				angular.forEach(response.data, function (item) {
					series.push(item);
					temp = item;
				});
				latestMessage = response.latest;

				//save to cache
				$localStorage.setArray('MessageSeries', series);
				$localStorage.setArray('MessageLatest', latestMessage);

			} else {
				alert('there was a server error for Messages');
				console.log(response);
			}
		})
			.error(function (response, status, headers, config) {
			console.log(['error', data, status, headers, config]);
		});
		return promise;
	}

	self.update = function () {
		console.log('MessagesService.update');
		var deferred = $q.defer();
		self.remote().then(function (remoteData) {
			deferred.resolve(series);
		});
		return deferred.promise;
	}

	self.init = function () {
		console.log('MessagesService.init');
		var deferred = $q.defer();

		self.local().then(function (storedValues) {
			if (storedValues[0].length > 0) {
				console.log('MessagesService: use local');
				series = storedValues[0];
				latestMessage = storedValues[1];
				deferred.resolve(series);
			} else {
				console.log('MessagesService: use remote');
				self.remote().then(function (remoteValues) {
					deferred.resolve(series);
				});
			}
		});
		return deferred.promise;
	}

	self.latest = function () {
		console.log('MessagesService.latest');
		var deferred = $q.defer();
		if (series.length === 0) {
			console.log('MessagesService: no posts');
			self.init().then(function (initPosts) {
				posts = initPosts;
				deferred.resolve(initPosts);
			});
		} else {
			console.log('MessagesService: had posts');
			deferred.resolve(series);
		}
		return deferred.promise;
	}

	self.latestMessage = function () {
		return latestMessage;
	}

	self.getSeries = function (seriesId) {
		console.log('MessagesService.getSeries');
		var deferred = $q.defer();
		var promise = $http.get(DOMAIN + '/ajax/plugin/message/message_messages/json/series:' + seriesId)
			.success(function (response, status, headers, config) {
			if (response.status === 'SUCCESS') {
				currentSeries = [];
				angular.forEach(response.data, function(item) {
					item.displayDate = moment(item.MessageMessage.event_date).format("M/DD");
					currentSeries.push(item);
				})
				deferred.resolve(currentSeries);
			} else {
				alert('there was a server error for Messages');
				console.log(response);
			}
		})
			.error(function (response, status, headers, config) {
			console.log(['error', data, status, headers, config]);
		});
		return deferred.promise;
	}
	
	self.sermon = function(sermonIndex) {
		var deferred = $q.defer();
		if (currentSeries.length === 0) {
			console.log('empty');
			$location.path('/tab/home');
			$location.replace();
			return null;
		} else {
			deferred.resolve(currentSeries[sermonIndex]);
		}
		return deferred.promise;
	}
})