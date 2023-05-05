/*------------------------------------------------------------------------------
AUTOPLAY
------------------------------------------------------------------------------*/
ImproveTube.autoplay = function () {
    var video = ImproveTube.elements.player;
    if (ImproveTube.video_url !== location.href) {
        ImproveTube.ignore_autoplay_off = false;
    }
    // if (allow autoplay is false) and  (no ads playing) and
	// ( there is a video and ( (it is not in a playlist and  auto play is off ) or ( playlist auto play is off and it is not in a playlist ) ) ) or (if we are in a channel and the channel trailer autoplay is off)  )
    if (ImproveTube.ignore_autoplay_off === false && video.classList.contains('ad-showing') === false &&
        (
            (document.documentElement.dataset.pageType === "video" && ((location.href.indexOf('list=') === -1 && ImproveTube.storage.player_autoplay === false) || (ImproveTube.storage.playlist_autoplay === false && location.href.indexOf('list=') !== -1))) ||
            (document.documentElement.dataset.pageType === "channel" && ImproveTube.storage.channel_trailer_autoplay === false)
        )
    ) {
        setTimeout(function () {console.log("autoplayyOFFFF");
         video.pauseVideo();
        });
    }
};
/*------------------------------------------------------------------------------
FORCED PLAY VIDEO FROM THE BEGINNING
------------------------------------------------------------------------------*/
ImproveTube.forcedPlayVideoFromTheBeginning = function () {
	if (this.storage.forced_play_video_from_the_beginning === true && document.documentElement.dataset.pageType === 'video') {
		this.elements.player.seekTo(0);
	}
};

/*------------------------------------------------------------------------------
AUTOPAUSE WHEN SWITCHING TABS
------------------------------------------------------------------------------*/
ImproveTube.playerAutopauseWhenSwitchingTabs = function () {
	var player = ImproveTube.elements.player;

	if (this.storage.player_autopause_when_switching_tabs === true && player) {
		if (this.focus === false) {
			this.played_before_blur = player.getPlayerState() === 1;

			player.pauseVideo();
		} else if (this.focus === true && this.played_before_blur === true) {
			player.playVideo();
		}
	}
};
/*------------------------------------------------------------------------------
AUTO PIP WHEN SWITCHING TABS
------------------------------------------------------------------------------*/
ImproveTube.playerAutoPip = function () {
	const video = ImproveTube.elements.video;

	if (this.storage.player_autoPip === true && video) {
		(async () => {
			try {
				await video.requestPictureInPicture();
			  } catch (error) {
				console.error('Failed to enter Picture-in-Picture mode', error);
			  }
		  })();
		}
};
/*------------------------------------------------------------------------------
FORCED PLAYBACK SPEED
------------------------------------------------------------------------------*/
ImproveTube.playerPlaybackSpeed = function (change) {
	var player = this.elements.player,
		video = player.querySelector('video'),
		option = this.storage.player_playback_speed,
		tries = 0;
	const intervalMs = 100,
		maxIntervalMs = 5000;

	if (this.isset(option) === false) {
		option = 1;
	}

	var waitForDescInterval = setInterval(() => {
		if (document.querySelector('div#description') || (++tries * intervalMs >= maxIntervalMs)) {
			clearInterval(waitForDescInterval);
		}

		if (this.storage.player_forced_playback_speed === true) {
			if (player.getVideoData().isLive === false &&
				(this.storage.player_force_speed_on_music === true ||
				 document.querySelector('h3#title')?.innerText !== 'Music'  // (=buyable/registered music table)
				|| (
				    (ImproveTube.elements.category !== 'Music' && !/official (music )?video|lyrics|cover[\)\]]|[\(\[]cover|cover version|karaok|(sing|play)[- ]?along|卡拉OK|卡拉OK|الكاريوكيкараоке|カラオケ|노래방/i.test(ImproveTube.elements.title + ImproveTube.elements.keywords)
					) || /do[ck]u|interv[iyj]|back[- ]?stage|インタビュー|entrevista|面试|面試|회견|wawancara|مقابلة|интервью|entretien|기록한 것|记录|記錄|ドキュメンタリ|وثائقي|документальный/i.test(ImproveTube.elements.keywords + ImproveTube.elements.title)
				  ) // && location.href.indexOf('music') === -1   // (=only running on www.youtube.com anyways)
			)) {
				player.setPlaybackRate(Number(option));
				video.playbackRate = Number(option);
			} else {
				player.setPlaybackRate(1);
			}
		}
	}, intervalMs);
};
/*------------------------------------------------------------------------------
SUBTITLES
------------------------------------------------------------------------------*/
ImproveTube.subtitles = function () {
	if (this.storage.player_subtitles === true) {
		var player = this.elements.player;

		if (player && player.toggleSubtitlesOn) {
			player.toggleSubtitlesOn();
		}
	}
};
/*------------------------------------------------------------------------------
SUBTITLES LANGUAGE
------------------------------------------------------------------------------*/
ImproveTube.subtitlesLanguage = function () {
    var option = this.storage.subtitles_language;
    if (this.isset(option) && option !== 'default') {
        var player = this.elements.player,
            button = this.elements.player_subtitles_button;

        if (player && player.getOption && button && button.getAttribute('aria-pressed') === 'true') {
            var tracklist = this.elements.player.getOption('captions', 'tracklist', {
                includeAsr: true
            });

            var matchTrack = false;
            for (var i =0, l = tracklist.length; i<l; i++){
                if (tracklist[i].languageCode.includes(option)) {
                    if( false === tracklist[i].vss_id.includes("a.") || true === this.storage.auto_generate){
                        this.elements.player.setOption('captions', 'track', tracklist[i]);
                        matchTrack = true; break;
                    }
                }
            }
         //   if (!matchTrack){  player.toggleSubtitles();  }
        }
    }
};
/*------------------------------------------------------------------------------
SUBTITLES FONT FAMILY
------------------------------------------------------------------------------*/
ImproveTube.subtitlesFontFamily = function () {
	var option = this.storage.subtitles_font_family;

	if (this.isset(option)) {
		var player = this.elements.player,
			button = this.elements.player_subtitles_button;

		if (player && player.getSubtitlesUserSettings && button && button.getAttribute('aria-pressed') === 'true') {
			var settings = player.getSubtitlesUserSettings();

			if (settings) {
				settings.fontFamily = Number(option);

				player.updateSubtitlesUserSettings(settings);
			}
		}
	}
};
/*------------------------------------------------------------------------------
SUBTITLES FONT COLOR
------------------------------------------------------------------------------*/
ImproveTube.subtitlesFontColor = function () {
	var option = this.storage.subtitles_font_color;

	if (this.isset(option)) {
		var player = this.elements.player,
			button = this.elements.player_subtitles_button;

		if (player && player.getSubtitlesUserSettings && button && button.getAttribute('aria-pressed') === 'true') {
			var settings = player.getSubtitlesUserSettings();

			if (settings) {
				settings.color = option;

				player.updateSubtitlesUserSettings(settings);
			}
		}
	}
};
/*------------------------------------------------------------------------------
SUBTITLES FONT SIZE
------------------------------------------------------------------------------*/
ImproveTube.subtitlesFontSize = function () {
	var option = this.storage.subtitles_font_size;

	if (this.isset(option)) {
		var player = this.elements.player,
			button = this.elements.player_subtitles_button;

		if (player && player.getSubtitlesUserSettings && button && button.getAttribute('aria-pressed') === 'true') {
			var settings = player.getSubtitlesUserSettings();

			if (settings) {
				settings.fontSizeIncrement = Number(option);

				player.updateSubtitlesUserSettings(settings);
			}
		}
	}
};
/*------------------------------------------------------------------------------
SUBTITLES BACKGROUND COLOR
------------------------------------------------------------------------------*/
ImproveTube.subtitlesBackgroundColor = function () {
	var option = this.storage.subtitles_background_color;

	if (this.isset(option)) {
		var player = this.elements.player,
			button = this.elements.player_subtitles_button;

		if (player && player.getSubtitlesUserSettings && button && button.getAttribute('aria-pressed') === 'true') {
			var settings = player.getSubtitlesUserSettings();

			if (settings) {
				settings.background = option;

				player.updateSubtitlesUserSettings(settings);
			}
		}
	}
};
/*------------------------------------------------------------------------------
SUBTITLES BACKGROUND OPACITY
------------------------------------------------------------------------------*/
ImproveTube.subtitlesBackgroundOpacity = function () {
	var option = this.storage.subtitles_background_opacity;

	if (this.isset(option)) {
		var player = this.elements.player,
			button = this.elements.player_subtitles_button;

		if (player && player.getSubtitlesUserSettings && button && button.getAttribute('aria-pressed') === 'true') {
			var settings = player.getSubtitlesUserSettings();

			if (settings) {
				settings.backgroundOpacity = option / 100;

				player.updateSubtitlesUserSettings(settings);
			}
		}
	}
};
/*------------------------------------------------------------------------------
SUBTITLES WINDOW COLOR
------------------------------------------------------------------------------*/
ImproveTube.subtitlesWindowColor = function () {
	var option = this.storage.subtitles_window_color;

	if (this.isset(option)) {
		var player = this.elements.player,
			button = this.elements.player_subtitles_button;

		if (player && player.getSubtitlesUserSettings && button && button.getAttribute('aria-pressed') === 'true') {
			var settings = player.getSubtitlesUserSettings();

			if (settings) {
				settings.windowColor = option;

				player.updateSubtitlesUserSettings(settings);
			}
		}
	}
};
/*------------------------------------------------------------------------------
SUBTITLES WINDOW OPACITY
------------------------------------------------------------------------------*/
ImproveTube.subtitlesWindowOpacity = function () {
	var option = this.storage.subtitles_window_opacity;

	if (this.isset(option)) {
		var player = this.elements.player,
			button = this.elements.player_subtitles_button;

		if (player && player.getSubtitlesUserSettings && button && button.getAttribute('aria-pressed') === 'true') {
			var settings = player.getSubtitlesUserSettings();

			if (settings) {
				settings.windowOpacity = Number(option) / 100;

				player.updateSubtitlesUserSettings(settings);
			}
		}
	}
};
/*------------------------------------------------------------------------------
SUBTITLES CHARACTER EDGE STYLE
------------------------------------------------------------------------------*/
ImproveTube.subtitlesCharacterEdgeStyle = function () {
	var option = this.storage.subtitles_character_edge_style;

	if (this.isset(option)) {
		var player = this.elements.player,
			button = this.elements.player_subtitles_button;

		if (player && player.getSubtitlesUserSettings && button && button.getAttribute('aria-pressed') === 'true') {
			var settings = player.getSubtitlesUserSettings();

			if (settings) {
				settings.charEdgeStyle = Number(option);

				player.updateSubtitlesUserSettings(settings);
			}
		}
	}
};
/*------------------------------------------------------------------------------
SUBTITLES FONT OPACITY
------------------------------------------------------------------------------*/
ImproveTube.subtitlesFontOpacity = function () {
	var option = this.storage.subtitles_font_opacity;

	if (this.isset(option)) {
		var player = this.elements.player,
			button = this.elements.player_subtitles_button;

		if (player && player.getSubtitlesUserSettings && button && button.getAttribute('aria-pressed') === 'true') {
			var settings = player.getSubtitlesUserSettings();

			if (settings) {
				settings.textOpacity = option / 100;

				player.updateSubtitlesUserSettings(settings);
			}
		}
	}
};
/*------------------------------------------------------------------------------
UP NEXT AUTOPLAY
------------------------------------------------------------------------------*/
ImproveTube.upNextAutoplay = function () {
	var option = this.storage.up_next_autoplay;

	if (this.isset(option)) {
		var toggle = document.querySelector('.ytp-autonav-toggle-button');

		if (toggle) {
			if (option !== (toggle.getAttribute('aria-checked') === 'true')) {
				toggle.click();
			}
		}
	}
};
/*------------------------------------------------------------------------------
ADS
------------------------------------------------------------------------------*/
ImproveTube.playerAds = function (parent) {
	try{var button = parent.querySelector('.ytp-ad-skip-button.ytp-button');}catch{}
	if (button) {
		if (this.storage.player_ads === 'block_all') {
			button.click();
		} else if (this.storage.player_ads === 'subscribed_channels') {
			if (!parent.querySelector('#meta paper-button[subscribed]')) {
				button.click();
			}
		} else if (this.storage.player_ads === 'block_music') {
			if (ImproveTube.elements.category === 'music') {
				button.click();
			}
		}
	}
};
/*------------------------------------------------------------------------------
AUTO FULLSCREEN
------------------------------------------------------------------------------*/
ImproveTube.playerAutofullscreen = function () {
	if (
		this.storage.player_autofullscreen === true &&
		document.documentElement.dataset.pageType === 'video' &&
		!document.fullscreenElement
	) {
		this.elements.player.toggleFullscreen();
	}
};
/*------------------------------------------------------------------------------
QUALITY
------------------------------------------------------------------------------*/
ImproveTube.playerQuality = function () {
	var player = this.elements.player,
		quality = this.storage.player_quality;

	if (player && player.getAvailableQualityLevels && !player.dataset.defaultQuality) {
		var available_quality_levels = player.getAvailableQualityLevels();

		if (quality && quality !== 'auto') {
			if (available_quality_levels.includes(quality) === false) {
				quality = available_quality_levels[0];
			}

			player.setPlaybackQualityRange(quality);
			player.setPlaybackQuality(quality);
			player.dataset.defaultQuality = quality;
		}
	}
};
/*------------------------------------------------------------------------------
FORCED VOLUME
------------------------------------------------------------------------------*/
ImproveTube.playerVolume = function () {
	if (this.storage.player_forced_volume === true) {
		var volume = this.storage.player_volume;

		if (!this.isset(volume)) {
			volume = 100;
		} else {
			volume = Number(volume);
		}

		this.elements.player.setVolume(volume);
	}
};
/*------------------------------------------------------------------------------
LOUDNESS NORMALIZATION
------------------------------------------------------------------------------*/
ImproveTube.onvolumechange = function (event) {
	if (document.querySelector('.ytp-volume-panel') && ImproveTube.storage.player_loudness_normalization === false) {
		var volume = Number(document.querySelector('.ytp-volume-panel').getAttribute('aria-valuenow'));

		this.volume = volume / 100;
	}
};

ImproveTube.playerLoudnessNormalization = function () {
	var video = this.elements.video;

	if (video) {
		video.removeEventListener('volumechange', this.onvolumechange);
		video.addEventListener('volumechange', this.onvolumechange);
	}

	if (this.storage.player_loudness_normalization === false) {
		try {
			var local_storage = localStorage['yt-player-volume'];

			if (this.isset(Number(this.storage.player_volume)) && this.storage.player_forced_volume === true) {

			} else if (local_storage) {
				local_storage = JSON.parse(JSON.parse(local_storage).data);

				local_storage = Number(local_storage.volume);

				video.volume = local_storage / 100;
			} else {
				video.volume = 100;
			}
		} catch (err) {}
	}
};
/*------------------------------------------------------------------------------
SCREENSHOT
------------------------------------------------------------------------------*/
ImproveTube.screenshot = function () {
	var video = ImproveTube.elements.video,
		style = document.createElement('style'),
		cvs = document.createElement('canvas'),
		ctx = cvs.getContext('2d');

	style.textContent = 'video{width:' + video.videoWidth + 'px !important;height:' + video.videoHeight + 'px !important}';

	cvs.width = video.videoWidth;
	cvs.height = video.videoHeight;

	document.body.appendChild(style);

	setTimeout(function () {
		ctx.drawImage(video, 0, 0, cvs.width, cvs.height);

		cvs.toBlob(function (blob) {
			if (ImproveTube.storage.player_screenshot_save_as !== 'clipboard') {
				var a = document.createElement('a');
				a.href = URL.createObjectURL(blob); console.log("screeeeeeenshot tada!");

				a.download = location.href.match(/(\?|\&)v=[^&]+/)[0].substr(3) || location.href.match(/()embed\/[^&]+/)[0].substr(3) || ImproveTube.videoID || location.href.match + '-' + new Date(ImproveTube.elements.player.getCurrentTime() * 1000).toISOString().substr(11, 8).replace(/:/g, '-') + '.png';

				a.click();
			} else {
				navigator.clipboard.write([
					new ClipboardItem({
						'image/png': blob
					})
				]);
			}
		});

		style.remove();
	});
};

ImproveTube.playerScreenshotButton = function () {
	if (this.storage.player_screenshot_button === true) {
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		path.setAttributeNS(null, 'd', 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z');

		svg.appendChild(path);

		this.createPlayerButton({
			id: 'it-screenshot-button',
			child: svg,
			opacity: 0.64,
			onclick: this.screenshot,
			title: 'Screenshot'
		});
	} else if (this.elements.buttons['it-screenshot-styles']) {
		this.elements.buttons['it-screenshot-styles'].remove();
	}
};
/*------------------------------------------------------------------------------
REPEAT
------------------------------------------------------------------------------*/
ImproveTube.playerRepeatButton = function (node) {
	if (this.storage.player_repeat_button === true) {
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		path.setAttributeNS(null, 'd', 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z');

		svg.appendChild(path);

		this.createPlayerButton({
			id: 'it-repeat-button',
			child: svg,
			onclick: function () {
				var video = ImproveTube.elements.video;

				if (video.hasAttribute('loop')) {
					video.removeAttribute('loop');

					this.style.opacity = '.5';
				} else if (!/ad-showing/.test(ImproveTube.elements.player.className)) {
					video.setAttribute('loop', '');

					this.style.opacity = '1';
				}
			},
			title: 'Repeat'
		});

		if (this.storage.player_always_repeat === true) {
			setTimeout(function () {
				ImproveTube.elements.video.setAttribute('loop', '');

				ImproveTube.elements.buttons['it-repeat-styles'].style.opacity = '1';
			}, 100);
		}
	} else if (this.elements.buttons['it-repeat-styles']) {
		this.elements.buttons['it-repeat-styles'].remove();
	}
};
/*------------------------------------------------------------------------------
ROTATE
------------------------------------------------------------------------------*/
ImproveTube.playerRotateButton = function () {
	if (this.storage.player_rotate_button === true) {
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		path.setAttributeNS(null, 'd', 'M15.55 5.55L11 1v3.07a8 8 0 0 0 0 15.86v-2.02a6 6 0 0 1 0-11.82V10l4.55-4.45zM19.93 11a7.9 7.9 0 0 0-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02a7.92 7.92 0 0 0 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41A7.9 7.9 0 0 0 19.93 13h-2.02a5.9 5.9 0 0 1-1.02 2.48z');

		svg.appendChild(path);

		this.createPlayerButton({
			id: 'it-rotate-button',
			child: svg,
			opacity: 0.85,
			onclick: function () {
				var player = ImproveTube.elements.player,
					video = ImproveTube.elements.video,
					rotate = Number(document.body.dataset.itRotate) || 0,
					transform = '';

				rotate += 90;

				if (rotate === 360) {
					rotate = 0;
				}

				document.body.dataset.itRotate = rotate;

				transform += 'rotate(' + rotate + 'deg)';

				if (rotate == 90 || rotate == 270) {
					var is_vertical_video = video.videoHeight > video.videoWidth;

					transform += ' scale(' + (is_vertical_video ? player.clientWidth : player.clientHeight) / (is_vertical_video ? player.clientHeight : player.clientWidth) + ')';
				}

				if (!ImproveTube.elements.buttons['it-rotate-styles']) {
					var style = document.createElement('style');

					ImproveTube.elements.buttons['it-rotate-styles'] = style;

					document.body.appendChild(style);
				}

				ImproveTube.elements.buttons['it-rotate-styles'].textContent = 'video{transform:' + transform + '}';
			},
			title: 'Rotate'
		});
	} else if (this.elements.buttons['it-rotate-button']) {
		this.elements.buttons['it-rotate-button'].remove();
		this.elements.buttons['it-rotate-styles'].remove();
	}
};
/*------------------------------------------------------------------------------
POPUP PLAYER
------------------------------------------------------------------------------*/
ImproveTube.playerPopupButton = function () {
	if (this.storage.player_popup_button === true) {
		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
		path.setAttributeNS(null, 'd', 'M19 7h-8v6h8V7zm2-4H3C2 3 1 4 1 5v14c0 1 1 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zm0 16H3V5h18v14z');

		svg.appendChild(path);

		this.createPlayerButton({
			id: 'it-popup-player-button',
			child: svg,
			opacity: 0.8,
			onclick: function () {
				var player = ImproveTube.elements.player;

				player.pauseVideo();

				window.open('//www.youtube.com/embed/' + location.href.match(/watch\?v=([A-Za-z0-9\-\_]+)/g)[0].slice(8) + '?start=' + parseInt(player.getCurrentTime()) + '&autoplay=' + (ImproveTube.storage.player_autoplay == false ? '0' : '1'), '_blank', 'directories=no,toolbar=no,location=no,menubar=no,status=no,titlebar=no,scrollbars=no,resizable=no,width=' + player.offsetWidth + ',height=' + player.offsetHeight);
			},
			title: 'Popup'
		});
	} else if (this.elements.buttons['it-popup-player-button']) {
		this.elements.buttons['it-popup-player-button'].remove();
	}
};
/*------------------------------------------------------------------------------
Force SDR
------------------------------------------------------------------------------*/
ImproveTube.playerSDR = function () {
	if (this.storage.player_SDR === true) {
		Object.defineProperty(window.screen, 'pixelDepth', {
			enumerable: true,
			configurable: true,
			value: 24
		});
	}
};
/*------------------------------------------------------------------------------
Hide controls
------------------------------------------------------------------------------*/
ImproveTube.playerControls = function (pause=false) {
    var player = this.elements.player;   if (player) {
		let hide = this.storage.player_hide_controls;
        if (hide === 'always') {
            player.hideControls();
        } else if(hide === 'off') {
            player.showControls();
        } else if(hide === 'when_paused') {
		   if(this.elements.video.paused){
	       player.hideControls( );

	  ImproveTube.elements.player.parentNode.addEventListener('mouseenter', function () {
	  player.showControls();});
	  ImproveTube.elements.player.parentNode.addEventListener('mouseleave', function () {
      player.hideControls( );});


		ImproveTube.elements.player.parentNode.onmousemove = (function() {
			let onmousestop = function() {
				player.hideControls( );
			}, thread;

			return function() {
			  player.showControls();
			  clearTimeout(thread);
			  thread = setTimeout(onmousestop, 1000);
			};
		  })();
	   }} else { player.showControls();  }
}
};
/*------------------------------------------------------------------------------
CUSTOM MINI-PLAYER
------------------------------------------------------------------------------*/
ImproveTube.mini_player__setSize = function (width, height, keep_ar, keep_area) {
    if (keep_ar) {
        const aspect_ratio = ImproveTube.elements.video.style.width.replace('px', '') / ImproveTube.elements.video.style.height.replace('px', '');
	    if (keep_area) {
	        height = Math.sqrt((width * height) / aspect_ratio);
	        width = height * aspect_ratio;
	    } else {
	        height = width / aspect_ratio;
	    }
    }

    ImproveTube.elements.player.style.width = width + 'px';
    ImproveTube.elements.player.style.height = height + 'px';
};

ImproveTube.miniPlayer_scroll = function () {
	if (window.scrollY >= 256 && ImproveTube.mini_player__mode === false && ImproveTube.elements.player.classList.contains('ytp-player-minimized') === false) {
		ImproveTube.mini_player__mode = true;

		ImproveTube.mini_player__original_width = ImproveTube.elements.player.offsetWidth;
		ImproveTube.mini_player__original_height = ImproveTube.elements.player.offsetHeight;

		ImproveTube.elements.player.classList.add('it-mini-player');

		ImproveTube.mini_player__x = Math.max(0, Math.min(ImproveTube.mini_player__x, document.body.offsetWidth - ImproveTube.mini_player__width));
		ImproveTube.mini_player__y = Math.max(0, Math.min(ImproveTube.mini_player__y, window.innerHeight - ImproveTube.mini_player__height));

		ImproveTube.mini_player__cursor = '';
		document.documentElement.removeAttribute('it-mini-player-cursor');

		ImproveTube.elements.player.style.transform = 'translate(' + ImproveTube.mini_player__x + 'px, ' + ImproveTube.mini_player__y + 'px)';

		ImproveTube.mini_player__setSize(ImproveTube.mini_player__width, ImproveTube.mini_player__height, true, true);

		window.addEventListener('mousedown', ImproveTube.miniPlayer_mouseDown);
		window.addEventListener('mousemove', ImproveTube.miniPlayer_cursorUpdate);

		window.dispatchEvent(new Event('resize'));
	} else if (window.scrollY < 256 && ImproveTube.mini_player__mode === true || ImproveTube.elements.player.classList.contains('ytp-player-minimized') === true) {
		ImproveTube.mini_player__mode = false;
		ImproveTube.elements.player.classList.remove('it-mini-player');
		ImproveTube.mini_player__move = false;
		ImproveTube.elements.player.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';
		ImproveTube.elements.player.style.width = '';
		ImproveTube.elements.player.style.height = '';

		ImproveTube.mini_player__cursor = '';
		document.documentElement.removeAttribute('it-mini-player-cursor');

		window.removeEventListener('mousedown', ImproveTube.miniPlayer_mouseDown);
		window.removeEventListener('mousemove', ImproveTube.miniPlayer_cursorUpdate);

		window.dispatchEvent(new Event('resize'));
	}
};

ImproveTube.miniPlayer_mouseDown = function (event) {
	if (event.button !== 0) {
		return false;
	}

	if (ImproveTube.miniPlayer_resize() === true) {
		return false;
	}

	var is_player = false,
		path = event.composedPath();

	for (var i = 0, l = path.length; i < l; i++) {
		if ((path[i].classList && path[i].classList.contains('it-mini-player')) === true) {
			is_player = true;
		}
	}

	if (is_player === false) {
		return false;
	}

	event.preventDefault();

	var bcr = ImproveTube.elements.player.getBoundingClientRect();

	ImproveTube.miniPlayer_mouseDown_x = event.clientX;
	ImproveTube.miniPlayer_mouseDown_y = event.clientY;
	ImproveTube.mini_player__width = bcr.width;
	ImproveTube.mini_player__height = bcr.height;

	ImproveTube.mini_player__player_offset_x = event.clientX - bcr.x;
	ImproveTube.mini_player__player_offset_y = event.clientY - bcr.y;

	ImproveTube.mini_player__max_x = document.body.offsetWidth - ImproveTube.mini_player__width;
	ImproveTube.mini_player__max_y = window.innerHeight - ImproveTube.mini_player__height;

	window.addEventListener('mouseup', ImproveTube.miniPlayer_mouseUp);
	window.addEventListener('mousemove', ImproveTube.miniPlayer_mouseMove);
};

ImproveTube.miniPlayer_mouseUp = function () {
	var strg = JSON.parse(localStorage.getItem('ImproveTube-mini-player')) || {};

	strg.x = ImproveTube.mini_player__x;
	strg.y = ImproveTube.mini_player__y;

	localStorage.setItem('ImproveTube-mini-player', JSON.stringify(strg));

	window.removeEventListener('mouseup', ImproveTube.miniPlayer_mouseUp);
	window.removeEventListener('mousemove', ImproveTube.miniPlayer_mouseMove);

	ImproveTube.mini_player__move = false;

	setTimeout(function () {
		window.removeEventListener('click', ImproveTube.miniPlayer_click, true);
	});
};

ImproveTube.miniPlayer_click = function (event) {
	event.stopPropagation();
	event.preventDefault();
};

ImproveTube.miniPlayer_mouseMove = function (event) {
	if (
		event.clientX < ImproveTube.miniPlayer_mouseDown_x - 5 ||
		event.clientY < ImproveTube.miniPlayer_mouseDown_y - 5 ||
		event.clientX > ImproveTube.miniPlayer_mouseDown_x + 5 ||
		event.clientY > ImproveTube.miniPlayer_mouseDown_y + 5
	) {
		var x = event.clientX - ImproveTube.mini_player__player_offset_x,
			y = event.clientY - ImproveTube.mini_player__player_offset_y;

		if (ImproveTube.mini_player__move === false) {
			ImproveTube.mini_player__move = true;

			window.addEventListener('click', ImproveTube.miniPlayer_click, true);
		}

		if (x < 0) {
			x = 0;
		}

		if (y < 0) {
			y = 0;
		}

		if (x > ImproveTube.mini_player__max_x) {
			x = ImproveTube.mini_player__max_x;
		}

		if (y > ImproveTube.mini_player__max_y) {
			y = ImproveTube.mini_player__max_y;
		}

		ImproveTube.mini_player__x = x;
		ImproveTube.mini_player__y = y;

		ImproveTube.elements.player.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
	}
};

ImproveTube.miniPlayer_cursorUpdate = function (event) {
	var x = event.clientX,
		y = event.clientY,
		c = ImproveTube.mini_player__cursor;

	if (
		x >= ImproveTube.mini_player__x + ImproveTube.mini_player__width - ImproveTube.miniPlayer_resize_offset &&
		x <= ImproveTube.mini_player__x + ImproveTube.mini_player__width &&
		y >= ImproveTube.mini_player__y &&
		y <= ImproveTube.mini_player__y + ImproveTube.miniPlayer_resize_offset
	) {
		c = 'ne-resize';
	} else if (
		x >= ImproveTube.mini_player__x + ImproveTube.mini_player__width - ImproveTube.miniPlayer_resize_offset &&
		x <= ImproveTube.mini_player__x + ImproveTube.mini_player__width &&
		y >= ImproveTube.mini_player__y + ImproveTube.mini_player__height - ImproveTube.miniPlayer_resize_offset &&
		y <= ImproveTube.mini_player__y + ImproveTube.mini_player__height
	) {
		c = 'se-resize';
	} else if (
		x >= ImproveTube.mini_player__x &&
		x <= ImproveTube.mini_player__x + ImproveTube.miniPlayer_resize_offset &&
		y >= ImproveTube.mini_player__y + ImproveTube.mini_player__height - ImproveTube.miniPlayer_resize_offset &&
		y <= ImproveTube.mini_player__y + ImproveTube.mini_player__height
	) {
		c = 'sw-resize';
	} else if (
		x >= ImproveTube.mini_player__x &&
		x <= ImproveTube.mini_player__x + ImproveTube.miniPlayer_resize_offset &&
		y >= ImproveTube.mini_player__y &&
		y <= ImproveTube.mini_player__y + ImproveTube.miniPlayer_resize_offset
	) {
		c = 'nw-resize';
	} else if (
		x >= ImproveTube.mini_player__x &&
		x <= ImproveTube.mini_player__x + ImproveTube.mini_player__width &&
		y >= ImproveTube.mini_player__y &&
		y <= ImproveTube.mini_player__y + ImproveTube.miniPlayer_resize_offset
	) {
		c = 'n-resize';
	} else if (
		x >= ImproveTube.mini_player__x + ImproveTube.mini_player__width - ImproveTube.miniPlayer_resize_offset &&
		x <= ImproveTube.mini_player__x + ImproveTube.mini_player__width &&
		y >= ImproveTube.mini_player__y &&
		y <= ImproveTube.mini_player__y + ImproveTube.mini_player__height
	) {
		c = 'e-resize';
	} else if (
		x >= ImproveTube.mini_player__x &&
		x <= ImproveTube.mini_player__x + ImproveTube.mini_player__width &&
		y >= ImproveTube.mini_player__y + ImproveTube.mini_player__height - ImproveTube.miniPlayer_resize_offset &&
		y <= ImproveTube.mini_player__y + ImproveTube.mini_player__height
	) {
		c = 's-resize';
	} else if (
		x >= ImproveTube.mini_player__x &&
		x <= ImproveTube.mini_player__x + ImproveTube.miniPlayer_resize_offset &&
		y >= ImproveTube.mini_player__y &&
		y <= ImproveTube.mini_player__y + ImproveTube.mini_player__height
	) {
		c = 'w-resize';
	} else {
		c = '';
	}

	if (ImproveTube.mini_player__cursor !== c) {
		ImproveTube.mini_player__cursor = c;

		document.documentElement.setAttribute('it-mini-player-cursor', ImproveTube.mini_player__cursor);
	}
};

ImproveTube.miniPlayer_resize = function (event) {
	if (ImproveTube.mini_player__cursor !== '') {
		window.removeEventListener('mousemove', ImproveTube.miniPlayer_cursorUpdate);
		window.addEventListener('mouseup', ImproveTube.miniPlayer_resizeMouseUp);
		window.addEventListener('mousemove', ImproveTube.miniPlayer_resizeMouseMove);

		return true;
	}
};

ImproveTube.miniPlayer_resizeMouseMove = function (event) {
	if (ImproveTube.mini_player__cursor === 'n-resize') {
		ImproveTube.elements.player.style.transform = 'translate(' + ImproveTube.mini_player__x + 'px, ' + event.clientY + 'px)';
		ImproveTube.mini_player__setSize(ImproveTube.mini_player__width, ImproveTube.mini_player__y + ImproveTube.mini_player__height - event.clientY);
	} else if (ImproveTube.mini_player__cursor === 'e-resize') {
		ImproveTube.mini_player__setSize(event.clientX - ImproveTube.mini_player__x, ImproveTube.mini_player__height);
	} else if (ImproveTube.mini_player__cursor === 's-resize') {
		ImproveTube.mini_player__setSize(ImproveTube.mini_player__width, event.clientY - ImproveTube.mini_player__y);
	} else if (ImproveTube.mini_player__cursor === 'w-resize') {
		ImproveTube.elements.player.style.transform = 'translate(' + event.clientX + 'px, ' + ImproveTube.mini_player__y + 'px)';
		ImproveTube.mini_player__setSize(ImproveTube.mini_player__x + ImproveTube.mini_player__width - event.clientX, ImproveTube.mini_player__height);
	} else if (ImproveTube.mini_player__cursor === 'ne-resize') {
		ImproveTube.elements.player.style.transform = 'translate(' + ImproveTube.mini_player__x + 'px, ' + event.clientY + 'px)';
		ImproveTube.mini_player__setSize(event.clientX - ImproveTube.mini_player__x, ImproveTube.mini_player__y + ImproveTube.mini_player__height - event.clientY, true);
	} else if (ImproveTube.mini_player__cursor === 'se-resize') {
		ImproveTube.mini_player__setSize(event.clientX - ImproveTube.mini_player__x, event.clientY - ImproveTube.mini_player__y, true);
	} else if (ImproveTube.mini_player__cursor === 'sw-resize') {
		ImproveTube.elements.player.style.transform = 'translate(' + event.clientX + 'px, ' + ImproveTube.mini_player__y + 'px)';
		ImproveTube.mini_player__setSize(ImproveTube.mini_player__x + ImproveTube.mini_player__width - event.clientX, event.clientY - ImproveTube.mini_player__y, true);
	} else if (ImproveTube.mini_player__cursor === 'nw-resize') {
		ImproveTube.elements.player.style.transform = 'translate(' + event.clientX + 'px, ' + event.clientY + 'px)';
		ImproveTube.mini_player__setSize(ImproveTube.mini_player__x + ImproveTube.mini_player__width - event.clientX, ImproveTube.mini_player__y + ImproveTube.mini_player__height - event.clientY, true);
	}
};

ImproveTube.miniPlayer_resizeMouseUp = function (event) {
	var bcr = ImproveTube.elements.player.getBoundingClientRect();

	ImproveTube.mini_player__x = bcr.left;
	ImproveTube.mini_player__y = bcr.top;
	ImproveTube.mini_player__width = bcr.width;
	ImproveTube.mini_player__height = bcr.height;

	window.dispatchEvent(new Event('resize'));

	var strg = JSON.parse(localStorage.getItem('ImproveTube-mini-player')) || {};

	strg.width = ImproveTube.mini_player__width;
	strg.height = ImproveTube.mini_player__height;

	localStorage.setItem('ImproveTube-mini-player', JSON.stringify(strg));

	window.addEventListener('mousemove', ImproveTube.miniPlayer_cursorUpdate);
	window.removeEventListener('mouseup', ImproveTube.miniPlayer_resizeMouseUp);
	window.removeEventListener('mousemove', ImproveTube.miniPlayer_resizeMouseMove);
};

ImproveTube.miniPlayer = function () {
	if (this.storage.mini_player === true) {
		var data = localStorage.getItem('ImproveTube-mini-player');

		try {
			if (this.isset(data)) {
				data = JSON.parse(data);
			} else {
				data = {};
			}
		} catch (error) {
			data = {};
		}

		data.x = data.x || 16;
		data.y = data.y || 16;
		data.width = data.width || 200;
		data.height = data.height || 150;

		this.mini_player__x = data.x;
		this.mini_player__y = data.y;
		this.mini_player__width = data.width;
		this.mini_player__height = data.height;

		window.removeEventListener('scroll', this.miniPlayer_scroll);
		window.addEventListener('scroll', this.miniPlayer_scroll);
	} else {
		this.mini_player__mode = false;
		this.elements.player.classList.remove('it-mini-player');
		this.mini_player__move = false;

		this.elements.player.style.width = '';
		this.elements.player.style.height = '';
		this.elements.player.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';

		this.elements.player.classList.remove('it-mini-player');

		this.mini_player__cursor = '';
		document.documentElement.removeAttribute('it-mini-player-cursor');

		window.dispatchEvent(new Event('resize'));

		window.removeEventListener('mousedown', this.miniPlayer_mouseDown);
		window.removeEventListener('mousemove', this.miniPlayer_mouseMove);
		window.removeEventListener('mouseup', this.miniPlayer_mouseUp);
		window.removeEventListener('click', this.miniPlayer_click);
		window.removeEventListener('scroll', this.miniPlayer_scroll);
		window.removeEventListener('mousemove', this.miniPlayer_cursorUpdate);
	}
};
