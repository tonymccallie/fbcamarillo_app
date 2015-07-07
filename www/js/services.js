angular.module('greyback.services', [])

.service('NewsService', function ($q, $http, $location, $ionicSlideBoxDelegate, $localStorage, $state) {
	console.log('NewsService');

	// 3 headers
	// 1 general
	var self = this;
	self.articles = {
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
			var news_url = '/ajax/plugin/news/news_articles/json/limit:3/category:1';
			break;
		}
		
		var promise = $http.get(DOMAIN + news_url)
			.success(function (response, status, headers, config) {

			if (response.status === 'SUCCESS') {
				//empty articles
				self.articles[$category] = [];
				//populate
				var temp = {};
				angular.forEach(response.data, function (item) {
					item.NewsArticle.body = onclickFix(item.NewsArticle.body);
					self.articles[$category].push(item);
					temp = item;
				});

				//save to cache
				$localStorage.setArray('NewsLatest.' + $category, self.articles[$category]);
				if($category === 'headers') {
					$ionicSlideBoxDelegate.update();
				}

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
			deferred.resolve(self.articles[$category]);
		});
		return deferred.promise;
	}

	self.init = function ($category) {
		console.log('NewsService.init');
		var deferred = $q.defer();
		self.local($category).then(function (storedArticles) {
			if (storedArticles.length > 0) {
				console.log('NewsService: use local ' + $category);
				self.articles[$category] = storedArticles;
				deferred.resolve(self.articles[$category]);
			} else {
				console.log('NewsService: use remote ' + $category);
				self.remote($category).then(function (remoteArticles) {
					deferred.resolve(self.articles[$category]);
				});
			}
		});

//		$location.path('/tab/home');
//		$location.replace();

		return deferred.promise;
	}

	self.latest = function ($category) {
		console.log('NewsService.latestHeaders ' + $category);
		var deferred = $q.defer();
		if (self.articles[$category].length === 0) {
			console.log('NewsService: no articles ' + $category);
			self.init($category).then(function (initArticles) {
				self.articles[$category] = initArticles;
				deferred.resolve(initArticles);
			});
		} else {
			console.log('NewsService: had articles ' + $category);
			deferred.resolve(self.articles[$category]);
		}
		$ionicSlideBoxDelegate.update();
		return deferred.promise;
	}


	self.article = function ($articleIndex, $category) {
		console.log('NewsService.article ' + $category);
		var deferred = $q.defer();
		if (self.articles[$category].length === 0) {
			console.log('empty');
			$location.path('/tab/home');
			$location.replace();
			return null;
		} else {
			deferred.resolve(self.articles[$category][$articleIndex]);
		}
		return deferred.promise;
	}
})

.service('MessagesService', function ($q, $http, $location, $ionicSlideBoxDelegate, $localStorage, $state) {
	console.log('MessagesService');
	var self = this;
	self.series = [];
	self.latestMessage = {};
	var currentSeries = [];

	self.local = function () {
		console.log('MessagesService.local');
		var deferred = $q.defer();
		var localSeries = $localStorage.getArray('MessageSeries');
		var localLatest = $localStorage.getObject('MessageLatest');
		deferred.resolve([localSeries, localLatest]);
		return deferred.promise;
	}

	self.remote = function () {
		console.log('MessagesService.remote');
		var promise = $http.get(DOMAIN + '/ajax/plugin/message/message_series/json/category:1')
			.success(function (response, status, headers, config) {

			if (response.status === 'SUCCESS') {
				//empty articles
				self.series = [];
				self.latestMessage = {};
				//populate
				var temp = {};
				angular.forEach(response.data, function (item) {
					self.series.push(item);
					temp = item;
				});
				self.latestMessage = response.latest;

				//save to cache
				$localStorage.setArray('MessageSeries', self.series);
				$localStorage.setObject('MessageLatest', self.latestMessage);

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
			deferred.resolve(self.series);
		});
		return deferred.promise;
	}

	self.init = function () {
		console.log('MessagesService.init');
		var deferred = $q.defer();

		self.local().then(function (storedValues) {
			if (storedValues[0].length > 0) {
				console.log('MessagesService: use local');
				self.series = storedValues[0];
				self.latestMessage = storedValues[1];
				deferred.resolve(self.series);
			} else {
				console.log('MessagesService: use remote');
				self.remote().then(function (remoteValues) {
					deferred.resolve(self.series);
				});
			}
		});
		return deferred.promise;
	}

	self.latest = function () {
		console.log('MessagesService.latest');
		var deferred = $q.defer();
		if (self.series.length === 0) {
			console.log('MessagesService: no posts');
			self.init().then(function (initPosts) {
				self.series = initPosts;
				deferred.resolve(initPosts);
			});
		} else {
			console.log('MessagesService: had posts');
			deferred.resolve(self.series);
		}
		return deferred.promise;
	}

	self.latestMsg = function () {
		return self.latestMessage;
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
	
	self.latest_sermon = function() {
		if(!self.latestMessage.MessageMessage) {
			$location.path('/tab/home');
			$location.replace();
			return null;
		} else {
			return self.latestMessage;
		}	
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

.service('CalendarService', function ($q, $http, $location, $ionicSlideBoxDelegate, $localStorage, $state) {
	///ajax/plugin/calendar/calendar_events/json/calendar:1/limit:20
	console.log('CalendarService');
	var self = this;
	self.events = [];

	self.local = function () {
		console.log('CalendarService.local');
		var deferred = $q.defer();
		var localEvents = $localStorage.getArray('CalendarEvents');
		deferred.resolve(localEvents);
		return deferred.promise;
	}

	self.remote = function () {
		console.log('CalendarService.remote');
		var promise = $http.get(DOMAIN + '/ajax/plugin/calendar/calendar_events/json/calendar:1/limit:20')
			.success(function (response, status, headers, config) {

			if (response.status === 'SUCCESS') {
				//empty articles
				self.events = [];
				//populate
				angular.forEach(response.data, function (item) {
					item.displayDate = moment(item.occurrence_day).format("M/DD");
					item.displayMonth = moment(item.occurrence_day).format("MMMM");
					self.events.push(item);
				});

				//save to cache
				$localStorage.setArray('CalendarEvents', self.events);

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
		console.log('CalendarService.update');
		var deferred = $q.defer();
		self.remote().then(function (remoteData) {
			deferred.resolve(self.events);
		});
		return deferred.promise;
	}

	self.init = function () {
		console.log('CalendarService.init');
		var deferred = $q.defer();

		self.local().then(function (storedValues) {
			if (storedValues.length > 0) {
				console.log('CalendarService: use local');
				self.events = storedValues;
				deferred.resolve(self.events);
			} else {
				console.log('CalendarService: use remote');
				self.remote().then(function (remoteValues) {
					deferred.resolve(self.events);
				});
			}
		});
		return deferred.promise;
	}

	self.upcoming = function () {
		console.log('CalendarService.latest');
		var deferred = $q.defer();
		if (self.events.length === 0) {
			console.log('CalendarService: no events');
			self.init().then(function (initEvents) {
				self.events = initEvents;
				deferred.resolve(initEvents);
			});
		} else {
			console.log('CalendarService: had events');
			deferred.resolve(self.events);
		}
		return deferred.promise;
	}
	
	self.event = function(eventIndex) {
		console.log('CalendarService.event: '+ eventIndex);
		var deferred = $q.defer();
		if (self.events.length === 0) {
			console.log('empty');
			$location.path('/tab/home');
			$location.replace();
			return null;
		} else {
			deferred.resolve(self.events[eventIndex]);
		}
		return deferred.promise;
	}
	
})