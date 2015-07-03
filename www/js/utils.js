angular.module('greyback.utils', [])

.filter('trusted', function ($sce) {
	return function (url) {
		return $sce.trustAsResourceUrl(url);
	};
})

.factory('$localStorage', function ($window) {
	return {
		set: function (key, value) {
			$window.localStorage[key] = value;
		},
		get: function (key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		setObject: function (key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function (key) {
			return JSON.parse($window.localStorage[key] || '{}');
		},
		setArray: function (key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getArray: function (key) {
			return JSON.parse($window.localStorage[key] || '[]');
		}
	}
})

.factory('AudioFactory', function ($document, $sce) {
	var audioElement = new Audio();

	//	self.progbar.addEventListener('click', function(event) {
	//		var percent = (event.pageX - self.progbar.offsetLeft - $('.uk-offcanvas-bar').get(0).offsetLeft) / $('#progress_bar').width();
	//		self.audio.currentTime = self.audio.duration * percent;
	//	});
	return {
		audioElement: audioElement,
		set: function (filename) {
			audioElement.src = $sce.trustAsResourceUrl(filename);
		},
		play: function (filename) {
			audioElement.play(); //  <-- Thats all you need
		},
		pause: function () {
			audioElement.pause();
		},
		stop: function () {
			audioElement.pause();
			audioElement.src = audioElement.currentSrc; /** http://stackoverflow.com/a/16978083/1015046 **/
		},
		fwd: function () {
			var current = audioElement.currentTime;
			var jump = current + 30;
			if (jump > audioElement.duration) {
				jump = audioElement.duration;
			}
			audioElement.currentTime = jump;
		},
		rwd: function () {
			var current = audioElement.currentTime;
			var jump = current - 30;
			if (jump <= 0) {
				jump = 0;
			}
			audioElement.currentTime = jump;
		},
		scrub: function (percent) {
			audioElement.currentTime = audioElement.duration * percent;
		},
		timer: function (callback) {
			audioElement.ontimeupdate = function () {
				callback(audioElement.duration, audioElement.currentTime)
			};
		}
	}
});