/* EnhanceLinks Plugin for Vanilla Forums by Seon-Wook Park | CC BY-NC-SA */

(function ($, undefined) {

	$(document).ready(function() {
		setTimeout(init, 100);
	});

	function init() {
		$('.Message a').each(inspect);

		// Listen for new comments
		$('.MessageList').live('DOMNodeInserted', function(e) {
			if ($(e.target).hasClass('Comment')) {
				$('.Message a', e.target).each(inspect);
			}
		});
	}

	function inspect() {
		var $this = $(this),
			urlo = parseURL($this.prop('href'))
			host = urlo.host;
		checkFavicon(host, $this);
		applyThumbnail($this, urlo.full);
	}

	var faviconCheckCache = {};
	function checkFavicon(host, $el) {
		if (host == parseURL(window.location.href).host) return;
		if ($el.children().length > 0) return;

		if (host in faviconCheckCache) {
			faviconCheckCache[host].push($el);
			return;
		}

		faviconCheckCache[host] = [$el];
		var favurl = "http://getfavicon.appspot.com/http://"+host+"?defaulticon=none",
			yql = "http://query.yahooapis.com/v1/public/yql?q=use%20%22https%3A%2F%2Fgist.github.com%2Fraw%2F4582385%2Fc702921ed41d7d95b0735cf66a214cf507ebbb7c%2Fhttpstatus.xml%22%3Bselect%20*%20from%20httpstatus%20where%20url%3D%22";
		yql += encodeURIComponent(favurl);
		yql += "%22&format=json&callback=";
		$.getJSON(yql,null,function(data){
			data = data.query;
			if (!("result" in data.results) ||
				data.results.result.status != "200")
				return;

			$.each(faviconCheckCache[host], function(i, v) {
				applyFavicon(v,favurl)
			});
			delete faviconCheckCache[host];
		});
	}

	function applyFavicon($a, favurl) {
		// Set favicon height
		var lh = parseInt($a.css('line-height')),
			fh = lh < 18 ? lh - 2 : 16;
		var ficon = $("<img>").prop("src", favurl).css({
			"height": fh,
			"margin-top": (lh-fh)/2
		}).addClass("favicon");
		$a.addClass("EnhanceLinks").prepend(ficon);
		setTimeout(function() {
			ficon.css("width", fh)
		},0);
	}

	function applyThumbnail($a, url) {
		$a.hover(function(e) {
			destroyThumbnails();
			var img = $('<img>').addClass('thumbnail');
			img.prop("src", "http://free.pagepeeker.com/v2/thumbs.php?size=s&url="+encodeURIComponent(url));
			img.css("top", $a.height()+$a.position().top+2);
			img.load(function() {
				$a.addClass('EnhanceLinks').prepend(img);
			});
		}, destroyThumbnails);
	}
	function destroyThumbnails() {
		$('a.EnhanceLinks img.thumbnail').fadeOut(function() {
			$(this).remove()
		});
	}

	var urlcache = {};
	function parseURL(url) {
		if (!url) url = document.URL;
		if (url in urlcache) return urlcache[url];
		var urlo = (url == document.URL) ? document.location : $('<a href="'+url+'"/>')[0],
			urlp = {
				protocol: urlo.protocol.slice(0, urlo.protocol.length - 1),
				host: urlo.hostname,
				port: urlo.port,
				path: urlo.pathname,
				query: urlo.search,
				params: urlo.search.length ? (function() {
						var param = [], params = {};
						$.each(urlo.search.slice(1).split('&'), function(i, e) {
							if (e.length) {
								param = e.split('=');
								if (param.length > 1 && param[1].length) params[param[0]] = param[1];
							}
						});
						return params;
					}()) : {},
				file: urlo.pathname.match(/\/([^\/?&]*)[^\/]*$/)[1],
				hash: urlo.hash.length ? urlo.hash.slice(1) : '',
				relative: urlo.href.match(/:\/\/[^\/]+(.*)$/)[1],
				full: urlo.href.match(/([^#]*)/)[1],
				full_hash: urlo.href
			};
		if (url == urlo.href) urlcache[url] = urlp;
		if (urlo instanceof jQuery) urlo.remove();
		return urlp;
	}

}(jQuery));
