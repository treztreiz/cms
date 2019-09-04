var FANCYBOX_INITIALIZED = false, FANCYBOX_LOADED = { css : false, script : false};

function initGallery( element ){

	if(FANCYBOX_INITIALIZED) return;
	else FANCYBOX_INITIALIZED = true;

	var css = document.createElement('link');
	css.href = "/lib/fancybox/fancybox.min.css";
	css.rel = "stylesheet";
	css.onload = function(){ FANCYBOX_LOADED.css = true; initFancybox(); };
	document.head.appendChild(css);

	var script = document.createElement('script');
	script.src = "/lib/fancybox/fancybox.min.js";
	script.onload = function(){ FANCYBOX_LOADED.script = true; initFancybox(); };
	document.body.appendChild(script);

}

function initFancybox(){

	if( !FANCYBOX_LOADED.css || ! FANCYBOX_LOADED.script ) return;

	var lightbox = "[data-fancybox]";
	$(lightbox).fancybox({
		loop	: 	true,
		protect	: 	true,
		zoom: false,
		buttons : [
	        'slideShow',
	        'fullScreen',
	        'close'
	   	]
	});

}