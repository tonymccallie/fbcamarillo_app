angular.module('greyback.services', [])

.service('NewsService', function ($q, $http, $location, $ionicSlideBoxDelegate, $localStorage, $state) {
	console.log('NewsService');
	var self = this;
	var articles = [];

	self.local = function () {
		console.log('NewsService.local');
		var deferred = $q.defer();
		var localArticles = $localStorage.getArray('NewsLatest');
		deferred.resolve(localArticles);
		return deferred.promise;
	}

	self.remote = function () {
		console.log('NewsService.remote');
		var promise = $http.get(DOMAIN + '/ajax/plugin/news/news_articles/json/limit:4/category:3')
			.success(function (response, status, headers, config) {

			if (response.status === 'SUCCESS') {
				//empty articles
				articles = [];
				//populate
				var temp = {};
				angular.forEach(response.data, function (item) {
					item.NewsArticle.body = onclickFix(item.NewsArticle.body);
					articles.push(item);
					temp = item;
				});

				//save to cache
				$localStorage.setArray('NewsLatest', articles);
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

	self.update = function () {
		console.log('NewsService.update');
		var deferred = $q.defer();
		self.remote().then(function (remoteArticles) {
			deferred.resolve(articles);
		});
		return deferred.promise;
	}

	self.init = function () {
		console.log('NewsService.init');
		var deferred = $q.defer();
		self.local().then(function (storedArticles) {
			if (storedArticles.length > 0) {
				console.log('NewsService: use local');
				articles = storedArticles;
				deferred.resolve(articles);
			} else {
				console.log('NewsService: use remote');
				self.remote().then(function (remoteArticles) {
					deferred.resolve(articles);
				});
			}
		});
		return deferred.promise;
	}

	self.latest = function () {
		console.log('NewsService.latest');
		var deferred = $q.defer();
		if (articles.length === 0) {
			console.log('NewsService: no articles');
			self.init().then(function (initArticles) {
				articles = initArticles;
				deferred.resolve(initArticles);
			});
		} else {
			console.log('NewsService: had articles');
			deferred.resolve(articles);
		}
		$ionicSlideBoxDelegate.update();
		return deferred.promise;
	}

	self.article = function ($articleIndex) {
		console.log('NewsService.article');
		var deferred = $q.defer();
		if (articles.length === 0) {
			console.log('empty');
			$location.path('/tab/home');
			$location.replace();
			return null;
		} else {
			deferred.resolve(articles[$articleIndex]);
		}
		return deferred.promise;
	}
})

.service('CommunityService', function ($q, $http, $location, $ionicSlideBoxDelegate, $localStorage, $state) {
	console.log('CommunityService');
	var self = this;
	var posts = [];

	self.local = function () {
		console.log('CommunityService.local');
		var deferred = $q.defer();
		var localPosts = $localStorage.getArray('CommunityLatest');
		deferred.resolve(localPosts);
		return deferred.promise;
	}

	self.remote = function () {
		console.log('CommunityService.remote');
		var promise = $http.get(DOMAIN + '/ajax/plugin/community/community_posts/json')
			.success(function (response, status, headers, config) {

			if (response.status === 'SUCCESS') {
				//empty articles
				posts = [];
				//populate
				var temp = {};
				angular.forEach(response.data, function (item) {
					item.CommunityPost.body = onclickFix(item.CommunityPost.body);
					posts.push(item);
					temp = item;
				});

				//save to cache
				$localStorage.setArray('CommunityLatest', posts);

			} else {
				alert('there was a server error for COMMUNITY');
				console.log(response);
			}
		})
			.error(function (response, status, headers, config) {
			console.log(['error', data, status, headers, config]);
		});
		return promise;
	}

	self.update = function () {
		console.log('CommunityService.update');
		var deferred = $q.defer();
		self.remote().then(function (remotePosts) {
			deferred.resolve(posts);
		});
		return deferred.promise;
	}

	self.init = function () {
		console.log('CommunityService.init');
		var deferred = $q.defer();
		self.local().then(function (storedPosts) {
			if (storedPosts.length > 0) {
				console.log('CommunityService: use local');
				posts = storedPosts;
				deferred.resolve(posts);
			} else {
				console.log('CommunityService: use remote');
				self.remote().then(function (remotePosts) {
					deferred.resolve(posts);
				});
			}
		});
		return deferred.promise;
	}

	self.latest = function () {
		console.log('CommunityService.latest');
		var deferred = $q.defer();
		if (posts.length === 0) {
			console.log('CommunityService: no posts');
			self.init().then(function (initPosts) {
				posts = initPosts;
				deferred.resolve(initPosts);
			});
		} else {
			console.log('CommunityService: had posts');
			deferred.resolve(posts);
		}
		return deferred.promise;
	}

	self.post = function ($postIndex) {
		console.log('CommunityService.post');
		var deferred = $q.defer();
		if (posts.length === 0) {
			console.log('empty');
			$location.path('/tab/home');
			$location.replace();
			return null;
		} else {
			deferred.resolve(posts[$postIndex]);
		}
		return deferred.promise;
	}
})

.service('MessagesService', function ($q, $http, $location, $ionicSlideBoxDelegate, $localStorage, $state) {
	console.log('MessagesService');
	var self = this;
	var series = [];

	self.local = function () {
		console.log('MessagesService.local');
		var deferred = $q.defer();
		var localPosts = $localStorage.getArray('MessageSeries');
		deferred.resolve(localPosts);
		return deferred.promise;
	}

	self.remote = function () {
		console.log('MessagesService.remote');
		var promise = $http.get(DOMAIN + '/ajax/plugin/community/community_posts/json')
			.success(function (response, status, headers, config) {

			if (response.status === 'SUCCESS') {
				//empty articles
				posts = [];
				//populate
				var temp = {};
				angular.forEach(response.data, function (item) {
					item.CommunityPost.body = onclickFix(item.CommunityPost.body);
					posts.push(item);
					temp = item;
				});

				//save to cache
				$localStorage.setArray('MessageSeries', posts);

			} else {
				alert('there was a server error for COMMUNITY');
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
		self.remote().then(function (remotePosts) {
			deferred.resolve(posts);
		});
		return deferred.promise;
	}

	self.init = function () {
		console.log('MessagesService.init');
		var deferred = $q.defer();
		self.local().then(function (storedPosts) {
			if (storedPosts.length > 0) {
				console.log('MessagesService: use local');
				posts = storedPosts;
				deferred.resolve(posts);
			} else {
				console.log('MessagesService: use remote');
				self.remote().then(function (remotePosts) {
					deferred.resolve(posts);
				});
			}
		});
		return deferred.promise;
	}

	self.latest = function () {
		console.log('MessagesService.latest');
		var deferred = $q.defer();
		if (posts.length === 0) {
			console.log('MessagesService: no posts');
			self.init().then(function (initPosts) {
				posts = initPosts;
				deferred.resolve(initPosts);
			});
		} else {
			console.log('MessagesService: had posts');
			deferred.resolve(posts);
		}
		return deferred.promise;
	}

	self.post = function ($postIndex) {
		console.log('MessagesService.post');
		var deferred = $q.defer();
		if (posts.length === 0) {
			console.log('empty');
			$location.path('/tab/home');
			$location.replace();
			return null;
		} else {
			deferred.resolve(posts[$postIndex]);
		}
		return deferred.promise;
	}
})