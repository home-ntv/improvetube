/*--------------------------------------------------------------
>>> INITIALIZATION
--------------------------------------------------------------*/

ImproveTube.messages.create();
ImproveTube.messages.listener();

if (document.body) {
	ImproveTube.childHandler(document.body);
}

ImproveTube.observer = new MutationObserver(function (mutationList) {
	for (var i = 0, l = mutationList.length; i < l; i++) {
		var mutation = mutationList[i];

		if (mutation.type === 'childList') {
			for (var j = 0, k = mutation.addedNodes.length; j < k; j++) {
				ImproveTube.childHandler(mutation.addedNodes[j]);
			}
		}
	}
}).observe(document.documentElement, {
	attributes: false,
	childList: true,
	subtree: true
});

new MutationObserver(function (mutationList) {
	for (var i = 0, l = mutationList.length; i < l; i++) {
		var mutation = mutationList[i];

		if (mutation.type === 'attributes') {
			ImproveTube.channelDefaultTab(mutation.target);
		}
	}
}).observe(document.documentElement, {
	attributeFilter: ['href'],
	attributes: true,
	childList: true,
	subtree: true
});

ImproveTube.init = function () {
	window.addEventListener('yt-page-data-updated', function () {
		ImproveTube.pageType();
	});
	ImproveTube.pageType();
	var yt_player_updated = function () {
		document.dispatchEvent(new CustomEvent('ImproveTube-player-loaded'));

		window.removeEventListener('yt-player-updated', yt_player_updated);
	};

	window.addEventListener('yt-player-updated', yt_player_updated);

	this.playerOnPlay();
	this.playerSDR();
	this.shortcuts();
	this.onkeydown();
	this.onmousedown();
	this.youtubeLanguage();

	if (ImproveTube.elements.player && ImproveTube.elements.player.setPlaybackRate) {
		ImproveTube.videoPageUpdate();
		ImproveTube.initPlayer();
	}
	
	if (window.matchMedia) {
		document.documentElement.dataset.systemColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}  ImproveTube.myColors();
};

document.addEventListener('yt-navigate-finish', function () {
	ImproveTube.pageType();
	ImproveTube.commentsSidebar();
	
	if (ImproveTube.elements.player && ImproveTube.elements.player.setPlaybackRate) {
		ImproveTube.videoPageUpdate();
		ImproveTube.initPlayer();
	}

	ImproveTube.channelPlayAllButton();
});

document.addEventListener('yt-page-data-updated', function (event) {
	if (document.documentElement.dataset.pageType === 'video' && /[?&]list=([^&]+).*$/.test(location.href)) {
		ImproveTube.playlistRepeat();
		ImproveTube.playlistShuffle();
		ImproveTube.playlistReverse();
	}
});

window.addEventListener('load', function () {
	ImproveTube.elements.masthead = {
		start: document.querySelector('ytd-masthead #start'),
		end: document.querySelector('ytd-masthead #end'),
		logo: document.querySelector('ytd-masthead a#logo')
	};

	ImproveTube.elements.app_drawer = {
		start: document.querySelector('tp-yt-app-drawer #header'),
		logo: document.querySelector('tp-yt-app-drawer a#logo')
	};

	ImproveTube.ImproveTubeYoutubeIcon();
});
