/*--------------------------------------------------------------
>>> CORE:
----------------------------------------------------------------
# Global variable
# Messages
	# Create element
	# Listener
	# Send
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GLOBAL VARIABLE
--------------------------------------------------------------*/

var ImproveTube = {
	messages: {
		queue: []
	},
	storage: {},
	elements: {
		buttons: {},
		masthead: {},
		app_drawer: {},
		playlist: {},
		livechat: {},
		related: {},
		comments: {},
		collapse_of_subscription_sections: [],
		mark_watched_videos: [],
		blacklist_buttons: []
	},
	regex: {
		channel: new RegExp('\/@|((channel|user|c)\/)'),
		channel_home_page: new RegExp('\/@|((channel|user|c)\/)[^/]+(\/featured)?\/?$'),
		channel_home_page_postfix: new RegExp('\/(featured)?\/?$'),
		thumbnail_quality: new RegExp('(default\.jpg|mqdefault\.jpg|hqdefault\.jpg|hq720\.jpg|sddefault\.jpg|maxresdefault\.jpg)+'),
		video_id: new RegExp('[?&]v=([^&]+)'),
		channel_link: new RegExp('https:\/\/www.youtube.com\/@|((channel|user|c)\/)')
	},
	video_src: false,
	initialVideoUpdateDone: false,
	latestVideoDuration: 0,
	video_url: '',
	focus: false,
	played_before_blur: false,
	played_time: 0,
	ignore_autoplay_off: false,
	mini_player__mode: false,
	mini_player__move: false,
	mini_player__cursor: '',
	mini_player__x: 0,
	mini_player__y: 0,
	mini_player__max_x: 0,
	mini_player__max_y: 0,
	mini_player__original_width: 0,
	mini_player__original_height: 0,
	mini_player__width: 200,
	mini_player__height: 160,
	miniPlayer_mouseDown_x: 0,
	miniPlayer_mouseDown_y: 0,
	mini_player__player_offset_x: 0,
	mini_player__player_offset_y: 0,
	miniPlayer_resize_offset: 16,
	playlistReversed: false,
	status_timer: false,
	defaultApiKey: 'AIzaSyCXRRCFwKAXOiF1JkUBmibzxJF1cPuKNwA'
};

/*--------------------------------------------------------------
CODEC || 30FPS
----------------------------------------------------------------
    Do not move, needs to be on top of first injected content
    file to patch HTMLMediaElement before YT player uses it.
--------------------------------------------------------------*/
if (localStorage['it-codec'] || localStorage['it-player30fps']) {
	function overwrite(self, callback, mime) {
        if (localStorage['it-codec']) {
            var re = new RegExp(localStorage['it-codec']);
            // /webm|vp8|vp9/av01/
            if (re.test(mime)) return '';
        }
        if (localStorage['it-player30fps']) {
            var match = /framerate=(\d+)/.exec(mime);
            if (match && match[1] > 30) return '';
        }
		return callback.call(self, mime);
	}

	if (window.MediaSource) {
		var isTypeSupported = window.MediaSource.isTypeSupported;
		window.MediaSource.isTypeSupported = function (mime) {
			return overwrite(this, isTypeSupported, mime);
		}
	}
	var canPlayType = HTMLMediaElement.prototype.canPlayType;
	HTMLMediaElement.prototype.canPlayType = function (mime) {
		return overwrite(this, canPlayType, mime);
	}
};

/*--------------------------------------------------------------
# MESSAGES
----------------------------------------------------------------
	Designed for messaging between contexts of extension and
	website.
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# CREATE ELEMENT
--------------------------------------------------------------*/

ImproveTube.messages.create = function () {
	this.element = document.createElement('div');

	this.element.id = 'it-messages-from-youtube';

	this.element.style.display = 'none';

	document.documentElement.appendChild(this.element);
};

/*--------------------------------------------------------------
# LISTENER
--------------------------------------------------------------*/

ImproveTube.messages.listener = function () {
	document.addEventListener('it-message-from-youtube--readed', function () {
		ImproveTube.messages.queue.pop();

		if (ImproveTube.messages.queue.length > 0) {
			ImproveTube.messages.element.textContent = message;

			document.dispatchEvent(new CustomEvent('it-message-from-youtube'));
		}
	});
};

document.addEventListener('it-message-from-extension', function () {
	var provider = document.querySelector('#it-messages-from-extension');

	if (provider) {
		var message = provider.textContent;

		document.dispatchEvent(new CustomEvent('it-message-from-extension--readed'));

		try {
			message = JSON.parse(message);
		} catch (error) {
			console.log(error);
		}

		if (message.action === 'storage-loaded') {
			ImproveTube.storage = message.storage;
            
            if (ImproveTube.storage.player_h264) {
             localStorage['it-codec'] = "/webm|vp8|vp9|av01/";
            } else {
                localStorage.removeItem('it-codec');
            }
            if (!ImproveTube.storage.player_60fps) {
             localStorage['it-player30fps'] = true;
            } else {
                localStorage.removeItem('it-player30fps');
            }

//    FEEDBACK WHEN THE USER CHANGED A SETTING
			ImproveTube.init();
		} else if (message.action === 'storage-changed') {
			var camelized_key = message.camelizedKey;

			ImproveTube.storage[message.key] = message.value;
            if(message.key==="player_h264"){
                if (ImproveTube.storage.player_h264) {
                localStorage['it-codec'] = "/webm|vp8|vp9|av01/";
                } else {
                    localStorage.removeItem('it-codec');
                }
            }
            if(message.key==="player_60fps"){
                if (!ImproveTube.storage.player_60fps) {
                localStorage['it-player30fps'] = true;
                } else {
                    localStorage.removeItem('it-player30fps');
                }
            }
			if(ImproveTube.storage[message.key]==="when_paused"){
				ImproveTube.whenPaused();
			};
			if (camelized_key === 'blacklistActivate') {
				camelized_key = 'blacklist';
			} else if (camelized_key === 'playerForcedPlaybackSpeed') {
				camelized_key = 'playerPlaybackSpeed';
			} else if (camelized_key === 'theme') {
				ImproveTube.myColors();
				ImproveTube.setTheme();
			} else if (camelized_key === 'description') {
				if (ImproveTube.storage.description === "expanded" || ImproveTube.storage.description === "classic_expanded" )
			    {try{document.querySelector("#more").click() || document.querySelector("#expand").click() ;} catch{} }
				if (ImproveTube.storage.description === "normal" || ImproveTube.storage.description === "classic" )
				{try{document.querySelector("#less").click() || document.querySelector("#collapse").click();} catch{}}
				ImproveTube.ImproveTubeYoutubeButtonsUnderPlayer();
			}
 			  else if (camelized_key === 'transcript') {
   				  if (ImproveTube.storage.transcript === true) {try{document.querySelector('*[target-id*=transcript]').removeAttribute('visibility');}catch{}
				} if (ImproveTube.storage.transcript === false){try{document.querySelector('*[target-id*=transcript] #visibility-button button').click();}catch{}}
			  }
			  else if (camelized_key === 'chapters') {
					 if (ImproveTube.storage.chapters === true){try{document.querySelector('*[target-id*=chapters]').removeAttribute('visibility');}catch{}
				} if (ImproveTube.storage.chapters === false){try{document.querySelector('*[target-id*=chapters] #visibility-button button').click();}catch{}}
			  }
			    else if (camelized_key === 'commentsSidebar') {
				 if(ImproveTube.storage.comments_sidebar === false)
				 {document.querySelector("#below").appendChild(document.querySelector("#comments"));
				  document.querySelector("#secondary").appendChild(document.querySelector("#related"));	}
						else{ImproveTube.commentsSidebar();}
			  }

			if (ImproveTube[camelized_key]) {
				try{ImproveTube[camelized_key]()}catch{};
			}
		} else if (message.focus === true && ImproveTube.elements.player) {
			ImproveTube.focus = true;

			ImproveTube.pageOnFocus();
		} else if (message.blur === true && ImproveTube.elements.player) {
			ImproveTube.focus = false;

			ImproveTube.pageOnFocus();

			document.dispatchEvent(new CustomEvent('ImproveTube-blur'));
		} else if (message.pause === true) {
			if (ImproveTube.elements.player) {
				ImproveTube.played_before_blur = ImproveTube.elements.player.getPlayerState() === 1;
				ImproveTube.elements.player.pauseVideo();
			}
		} else if (message.hasOwnProperty('setVolume')) {
			if (ImproveTube.elements.player) {
				ImproveTube.elements.player.setVolume(message.setVolume);
			}
		} else if (message.hasOwnProperty('setPlaybackSpeed')) {
			if (ImproveTube.elements.player) {
				ImproveTube.elements.player.setPlaybackRate(message.setPlaybackSpeed);
			}
		} else if (message.deleteCookies === true) {
			ImproveTube.deleteYoutubeCookies();
		} else if (message.hasOwnProperty('responseOptionsUrl')) {
			var iframe = document.querySelector('.it-button__iframe');

			if (iframe) {
				iframe.src = message.responseOptionsUrl;
			}
		} /* else if (message.hasOwnProperty('mixer')) {
			if (ImproveTube.elements.player) {
				  document.documentElement.setAttribute('it-response', JSON.stringify({
					mixer: true,
					url: location.href.match(/(\?|\&)v=[^&]+/)[0].substr(3),
					volume: ImproveTube.elements.player.getVolume(),
					playbackRate: ImproveTube.elements.player.getPlaybackRate(),
					title: document.title
				}));
			}
		} */
	}
});

/*--------------------------------------------------------------
# SEND
--------------------------------------------------------------*/

ImproveTube.messages.send = function (message) {
	if (typeof message === 'object') {
		message = JSON.stringify(message);
	}

	this.queue.push(message);

	if (this.queue.length === 1) {
		this.element.textContent = message;

		document.dispatchEvent(new CustomEvent('it-message-from-youtube'));
	}
};
