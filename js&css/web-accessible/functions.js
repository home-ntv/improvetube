/*--------------------------------------------------------------
>>> FUNCTIONS
--------------------------------------------------------------*/

ImproveTube.childHandler = function (node) {
	var children = node.children;
	if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'svg' && node.nodeName !== '#text'&& node.nodeName !== '#comment' && node.nodeName !== 'SPAN' && node.nodeName !== 'DOM-IF' && node.nodeName !== 'DOM-REPEAT') {
		this.ytElementsHandler(node);

		if (children) {
			for (var i = 0, l = children.length; i < l; i++) {
				ImproveTube.childHandler(children[i]);
			}
		}
	}
};

ImproveTube.ytElementsHandler = function (node) {
	var name = node.nodeName,
		id = node.id;

	if (name === 'A') {
		if (node.href) {
			this.channelDefaultTab(node);

			if (node.className.indexOf('ytd-thumbnail') !== -1) {
				this.blacklist('video', node);
			}
			if (node.href.match(/@|((channel|user|c)\/)([^/]+)/)) {
				this.blacklist('channel', node);
			}
		}
	} else if (name === 'META') {
		if(node.getAttribute('name') === 'themeColor')			{ImproveTube.themeColor = node.content;}
		//if(node.getAttribute('name') === 'title')				{ImproveTube.title = node.content;}
		//if(node.getAttribute('name') === 'description')			{ImproveTube.description = node.content;}
		if(node.getAttribute('name') === 'keywords')			{ImproveTube.keywords = node.content;}
		if(node.getAttribute('itemprop') === 'name')			{ImproveTube.title = node.content;}
		if(node.getAttribute('itemprop') === 'description')		{ImproveTube.description = node.content;}
		if(node.getAttribute('itemprop') === 'paid')			{ImproveTube.paid = node.content;}
		if(node.getAttribute('itemprop') === 'channelId')		{ImproveTube.channelId = node.content;}
		if(node.getAttribute('itemprop') === 'videoId')			{ImproveTube.videoId = node.content;}
		if(node.getAttribute('itemprop') === 'unlisted')		{ImproveTube.unlisted = node.content;}
		// if(node.getAttribute('itemprop') === 'regionsAllowed'){ImproveTube.regionsAllowed = node.content;}
		if(node.getAttribute('itemprop') === 'duration')		{ImproveTube.duration = node.content;}
		if(node.getAttribute('itemprop') === 'isFamilyFriendly'){ImproveTube.isFamilyFriendly = node.content;}
		if(node.getAttribute('itemprop') === 'interactionCount'){ImproveTube.views = node.content;}
		if(node.getAttribute('itemprop') === 'datePublished'	){ImproveTube.datePublished = node.content;}
		if(node.getAttribute('itemprop') === 'uploadDate')		{ImproveTube.uploadDate = node.content;}
		if(node.getAttribute('itemprop') === 'genre')			{ImproveTube.category  = node.content;}
			
	} else if (name === 'YTD-TOGGLE-BUTTON-RENDERER' || name === 'YTD-PLAYLIST-LOOP-BUTTON-RENDERER') {
		if (
			node.parentComponent &&
			node.parentComponent.nodeName === 'YTD-MENU-RENDERER' &&
			node.parentComponent.parentComponent &&
			node.parentComponent.parentComponent.nodeName === 'YTD-PLAYLIST-PANEL-RENDERER'
		) {
			var index = Array.prototype.indexOf.call(node.parentNode.children, node);

			if (index === 0) {
	 if (this.storage.playlist_reverse === true) {
		try{this.elements.playlist.actions = node.parentNode.parentNode.parentNode.parentNode;}
		catch{try{this.elements.playlist.actions = node.parentNode.parentNode.parentNode;}
			catch{try{this.elements.playlist.actions = node.parentNode.parentNode;}
				catch{try{this.elements.playlist.actions = node.parentNode;}
					catch{try{this.elements.playlist.actions = node;}catch{}}
					}
				}	
			}	
		}
				this.playlistReverse();
			} else if (index === 1) {
				this.elements.playlist.shuffle_button = node;

				this.playlistShuffle();

	 if (this.storage.playlist_reverse === true) {
		try{this.elements.playlist.actions = node.parentNode.parentNode.parentNode.parentNode;}
		catch{try{this.elements.playlist.actions = node.parentNode.parentNode.parentNode;}
			catch{try{this.elements.playlist.actions = node.parentNode.parentNode;}
				catch{try{this.elements.playlist.actions = node.parentNode;}
					catch{try{this.elements.playlist.actions = node;}catch{}}
					}
				}	
			}	
		}
				this.playlistReverse();
			}
		}
	} else if (name === 'YTD-GUIDE-SECTION-RENDERER') {
		if (!this.elements.sidebar_section) {
			this.elements.sidebar_section = node;

			this.ImproveTubeYoutubeIcon();
		}
	} else if (name === 'YTD-VIDEO-PRIMARY-INFO-RENDERER') {
		this.elements.video_title = node.querySelector('.title.ytd-video-primary-info-renderer');

		this.ImproveTubeYoutubeIcon();
		this.ImproveTubeYoutubeButtonsUnderPlayer();


	} else if (name === 'YTD-VIDEO-SECONDARY-INFO-RENDERER') {
		this.elements.yt_channel_name = node.querySelector('ytd-channel-name');
		this.elements.yt_channel_link = node.querySelector('ytd-channel-name a');

		if (document.documentElement.dataset.pageType === 'video') {
			this.howLongAgoTheVideoWasUploaded();
			this.channelVideosCount();
		}
	} else if (name === 'YTD-MENU-RENDERER' && node.classList.contains('ytd-video-primary-info-renderer')) {
		if(document.documentElement.dataset.pageType === 'video'){
            this.hideDetailButton(node.$['flexible-item-buttons'].children);
        }
	} else if (name === 'YTD-SUBSCRIBE-BUTTON-RENDERER') {
		if (node.className.indexOf('ytd-c4-tabbed-header-renderer') !== -1) {
			ImproveTube.blacklist('channel', node);
		}

		ImproveTube.elements.subscribe_button = node;
	} else if (id === 'show-hide-button') {
		this.elements.livechat.button = document.querySelector('[aria-label="Hide chat"]');
		// console.log(document.querySelector('[aria-label="Hide chat"]'))
		this.livechat();
	} else if (name === 'YTD-MASTHEAD') {
		if (!this.elements.masthead) {
			this.elements.masthead = {
				start: node.querySelector('#start'),
				end: node.querySelector('#end'),
				logo: node.querySelector('a#logo')
			};

			this.ImproveTubeYoutubeIcon();
		}
	}
	else if (name === 'TP-YT-APP-DRAWER') {
		if (!this.elements.app_drawer) {
			this.elements.app_drawer = {
				start: node.querySelector('div#header'),
				logo: node.querySelector('a#logo')
			};

			this.ImproveTubeYoutubeIcon();
		}
	} else if (name === 'YTD-PLAYER') {
		if (!this.elements.ytd_player) {
			ImproveTube.elements.ytd_player = node;
		}
	} else if (id === 'movie_player') {
		if (!this.elements.player) {
			ImproveTube.elements.player = node;
			ImproveTube.elements.video = node.querySelector('video');
			ImproveTube.elements.player_left_controls = node.querySelector('.ytp-left-controls');
			ImproveTube.elements.player_thumbnail = node.querySelector('.ytp-cued-thumbnail-overlay-image');
			ImproveTube.elements.player_subtitles_button = node.querySelector('.ytp-subtitles-button');
			ImproveTube.playerSize();

			new MutationObserver(function (mutationList) {
				for (var i = 0, l = mutationList.length; i < l; i++) {
					var mutation = mutationList[i];

					if (mutation.type === 'childList') {
						for (var j = 0, k = mutation.addedNodes.length; j < k; j++) {
							var node = mutation.addedNodes[j];

							if (node.nodeName === 'DIV' && node.className.indexOf('ytp-ad-player-overlay') !== -1) {
								ImproveTube.playerAds(node);
							}
						}
					}
				}
			}).observe(node, {
				attributes: false,
				childList: true,
				subtree: true
			});

			new MutationObserver(function (mutationList) {
				for (var i = 0, l = mutationList.length; i < l; i++) {
					var mutation = mutationList[i];

					if (mutation.type === 'attributes') {
						if (mutation.attributeName === 'style') {
							ImproveTube.playerHdThumbnail();
						}
					}
				}
			}).observe(ImproveTube.elements.player_thumbnail, {
				attributes: true,
				attributeFilter: ['style'],
				childList: false,
				subtree: false
			});
		}
	} else if (name === 'YTD-WATCH-FLEXY') {
		this.elements.ytd_watch = node;

		if (
			this.isset(this.storage.player_size) &&
			this.storage.player_size !== 'do_not_change'
		) {
			node.calculateCurrentPlayerSize_ = function () {
				if (!this.theater && ImproveTube.elements.player) {
					if (this.updateStyles) {
						this.updthisateStyles({
							'--ytd-watch-flexy-width-ratio': 1,
							'--ytd-watch-flexy-height-ratio': 0.5625
						});

						this.updateStyles({
							'--ytd-watch-width-ratio': 1,
							'--ytd-watch-height-ratio': 0.5625
						});
					}

					return {
						width: ImproveTube.elements.player.offsetWidth,
						height: Math.round(ImproveTube.elements.player.offsetWidth / (16 / 9))
					};
				}

				return {
					width: NaN,
					height: NaN
				};
			};

			node.calculateNormalPlayerSize_ = node.calculateCurrentPlayerSize_;
		}
  }else if (document.documentElement.dataset.pageType === 'video'){
	 if (id ==='description-inner') {
			setTimeout(function () {
			ImproveTube.expandDescription(node);
	    }, 300);   			   
	}else if (id === 'meta') {setTimeout(function () { ImproveTube.expandDescription(node.querySelector('#more'));    }, 200);
    }else if (id === 'below' ){setTimeout(function () {  }, 0);
    }else if (id === 'panels'){setTimeout(function () {	
				ImproveTube.transcript(node);
				ImproveTube.chapters(node);    }, 200);
	}
  }

};

ImproveTube.pageType = function () {
	if (/\/watch\?/.test(location.href)) {
		document.documentElement.dataset.pageType = 'video';
	} else if (location.pathname === '/') {
		document.documentElement.dataset.pageType = 'home';
	} else if (/\/subscriptions\?/.test(location.href)) {
		document.documentElement.dataset.pageType = 'subscriptions';
	} else if (/\/@|(\/(channel|user|c)\/)[^/]+(?!\/videos)/.test(location.href)) {
		document.documentElement.dataset.pageType = 'channel';
	} else {
		document.documentElement.dataset.pageType = 'other';
	}
};

ImproveTube.pageOnFocus = function () {
	ImproveTube.playerAutopauseWhenSwitchingTabs();
	ImproveTube.playerAutoPip();
};

ImproveTube.videoPageUpdate = function () {
	if (document.documentElement.dataset.pageType === 'video') {
		var video_id = this.getParam(new URL(location.href).search.substr(1), 'v');

		if (this.storage.track_watched_videos === true && video_id) {
			ImproveTube.messages.send({
				action: 'watched',
				type: 'add',
				id: video_id,
				title: document.title
			});
		}

		this.initialVideoUpdateDone = true;

		ImproveTube.howLongAgoTheVideoWasUploaded();
		ImproveTube.dayOfWeek();
		ImproveTube.channelVideosCount();
		ImproveTube.upNextAutoplay();
		ImproveTube.playerAutofullscreen();
		ImproveTube.playerSize();
		
		ImproveTube.playerScreenshotButton();
		ImproveTube.playerRepeatButton();
		ImproveTube.playerRotateButton();
		ImproveTube.playerPopupButton();
		ImproveTube.playerControls();
	}
};

ImproveTube.playerOnPlay = function () {
	HTMLMediaElement.prototype.play = (function (original) {
		return function () {
			this.removeEventListener('loadedmetadata', ImproveTube.playerOnLoadedMetadata);
			this.addEventListener('loadedmetadata', ImproveTube.playerOnLoadedMetadata);

			this.removeEventListener('timeupdate', ImproveTube.playerOnTimeUpdate);
			this.addEventListener('timeupdate', ImproveTube.playerOnTimeUpdate);

			this.removeEventListener('pause', ImproveTube.playerOnPause, true);
			this.addEventListener('pause', ImproveTube.playerOnPause, true);

			this.removeEventListener('ended', ImproveTube.playerOnEnded, true);
			this.addEventListener('ended', ImproveTube.playerOnEnded, true);

			ImproveTube.autoplay();
			ImproveTube.playerLoudnessNormalization();

			return original.apply(this, arguments);
		}
	})(HTMLMediaElement.prototype.play);
};

ImproveTube.initPlayer = function () {
	if (ImproveTube.elements.player && ImproveTube.video_url !== location.href) {

		ImproveTube.video_url = location.href;
		ImproveTube.played_before_blur = false;

		delete ImproveTube.elements.player.dataset.defaultQuality;

		ImproveTube.forcedPlayVideoFromTheBeginning();
		ImproveTube.playerPlaybackSpeed(false);
		ImproveTube.subtitles();
		ImproveTube.subtitlesLanguage();
		ImproveTube.subtitlesFontFamily();
		ImproveTube.subtitlesFontColor();
		ImproveTube.subtitlesFontSize();
		ImproveTube.subtitlesBackgroundColor();
		ImproveTube.subtitlesWindowColor();
		ImproveTube.subtitlesWindowOpacity();
		ImproveTube.subtitlesCharacterEdgeStyle();
		ImproveTube.subtitlesFontOpacity();
		ImproveTube.subtitlesBackgroundOpacity();
		ImproveTube.playerQuality();
		ImproveTube.playerVolume();
		ImproveTube.playerScreenshotButton();
		ImproveTube.playerRepeatButton();
		ImproveTube.playerRotateButton();
		ImproveTube.playerPopupButton();
		ImproveTube.playerControls();

		setTimeout(function () {
            ImproveTube.forcedTheaterMode();
        }, 150);

		if (location.href.indexOf('/embed/') === -1) {
			ImproveTube.miniPlayer();
		}  
	}
};

ImproveTube.playerOnTimeUpdate = function () {
	if (ImproveTube.video_src !== this.src) {
		ImproveTube.video_src = this.src;

		if (ImproveTube.initialVideoUpdateDone !== true) {
			ImproveTube.playerQuality();
		}
	} else if (ImproveTube.latestVideoDuration !== this.duration) {
		ImproveTube.latestVideoDuration = this.duration;

		ImproveTube.playerQuality();
	}

	ImproveTube.alwaysShowProgressBar();
	ImproveTube.playerRemainingDuration();

	ImproveTube.played_time += .25;
};

ImproveTube.playerOnLoadedMetadata = function () {
	setTimeout(function () {
		ImproveTube.playerSize();
	}, 100);
};

ImproveTube.playerOnPause = function (event) {
	ImproveTube.playlistUpNextAutoplay(event);

	if (ImproveTube.elements.yt_channel_name) {
		ImproveTube.messages.send({
			action: 'analyzer',
			name: ImproveTube.elements.yt_channel_name.__data.tooltipText,
			time: ImproveTube.played_time
		});
	}
	ImproveTube.played_time = 0;
	ImproveTube.playerControls();
};

ImproveTube.playerOnEnded = function (event) {
	ImproveTube.playlistUpNextAutoplay(event);

	ImproveTube.messages.send({
		action: 'analyzer',
		name: ImproveTube.elements.yt_channel_name.__data.tooltipText,
		time: ImproveTube.played_time
	});

	ImproveTube.played_time = 0;
};

ImproveTube.onkeydown = function () {
	window.addEventListener('keydown', function () {
		if (
			ImproveTube.elements.player &&
			ImproveTube.elements.player.className.indexOf('ad-showing') === -1
		) {
			ImproveTube.ignore_autoplay_off = true;
		}
	}, true);
};

ImproveTube.onmousedown = function (event) {
	window.addEventListener('mousedown', function (event) {
		if (ImproveTube.elements.player && ImproveTube.elements.player.className.indexOf('ad-showing') === -1) {
			var path = event.composedPath();

			for (var i = 0, l = path.length; i < l; i++) {
				if (
					path[i].className &&
					path[i].className.indexOf &&
					(
						path[i].className.indexOf('html5-main-video') !== -1 ||
						path[i].className.indexOf('ytp-play-button') !== -1
					)
				) {
					ImproveTube.ignore_autoplay_off = true;
				}
			}
		}
	}, true);
};

ImproveTube.getCookieValueByName = function (name) {
	var match = document.cookie.match(new RegExp('([; ]' + name + '|^' + name + ')([^\\s;]*)', 'g'));

	if (match) {
		var cookie = match[0];

		return cookie.replace(name + '=', '').replace(' ', '');
	} else
		return '';
};

ImproveTube.getParam = function (query, name) {
	var params = query.split('&'),
		param = false;

	for (var i = 0; i < params.length; i++) {
		params[i] = params[i].split('=');

		if (params[i][0] == name) {
			param = params[i][1];
		}
	}

	if (param) {
		return param;
	} else {
		return false;
	}
};

ImproveTube.getParams = function (query) {
	var params = query.split('&'),
		result = {};

	for (var i = 0, l = params.length; i < l; i++) {
		params[i] = params[i].split('=');

		result[params[i][0]] = params[i][1];
	}

	return result;
};

ImproveTube.setCookie = function (name, value) {
	var date = new Date();

	date.setTime(date.getTime() + 3.154e+10);

	document.cookie = name + '=' + value + '; path=/; domain=.youtube.com; expires=' + date.toGMTString();
};

ImproveTube.createPlayerButton = function (options) {
	var controls = this.elements.player_left_controls;

	if (controls) {
		var button = document.createElement('button');

		button.className = 'ytp-button it-player-button';

		button.dataset.title = options.title;

		button.addEventListener('mouseover', function () {
			var tooltip = document.createElement('div'),
				rect = this.getBoundingClientRect();

			tooltip.className = 'it-player-button--tooltip';

			tooltip.style.left = rect.left + rect.width / 2 + 'px';
			tooltip.style.top = rect.top - 8 + 'px';

			tooltip.textContent = this.dataset.title;

			function mouseleave() {
				tooltip.remove();

				this.removeEventListener('mouseleave', mouseleave);
			}

			this.addEventListener('mouseleave', mouseleave);

			document.body.appendChild(tooltip);
		});

		if (options.id) {
			if (this.elements.buttons[options.id]) {
				this.elements.buttons[options.id].remove();
			}

			button.id = options.id;

			this.elements.buttons[options.id] = button;
		}

		if (options.child) {
			button.appendChild(options.child);
		}

		button.style.opacity = options.opacity || '.5';

		if (options.onclick) {
			button.onclick = options.onclick;
		}

		controls.insertBefore(button, controls.childNodes[3]);
	}
};

ImproveTube.empty = function (element) {
	for (var i = element.childNodes.length - 1; i > -1; i--) {
		element.childNodes[i].remove();
	}
};

ImproveTube.isset = function (variable) {
	return !(typeof variable === 'undefined' || variable === null || variable === 'null');
};

ImproveTube.stopPropagation = function (event) {
	event.stopPropagation();
};

ImproveTube.showStatus = function (value) {
	if (!this.elements.status) {
		this.elements.status = document.createElement('div');

		this.elements.status.id = 'it-status';
	}

	if (typeof value === 'number') {
		value = value.toFixed(2);
	}

	this.elements.status.textContent = value;

	if (ImproveTube.status_timer) {
		clearTimeout(ImproveTube.status_timer);
	}

	ImproveTube.status_timer = setTimeout(function () {
		ImproveTube.elements.status.remove();
	}, 500);

	this.elements.player.appendChild(this.elements.status);
};
