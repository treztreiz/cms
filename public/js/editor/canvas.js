window.initMaterialize = function() {
	M.AutoInit();
}

function loadBlockScript( path, func, element ) {

	if(typeof window[func] === "function") return execScript();
	
	var script = document.createElement('script');
	script.onload = execScript;
	script.src = path;
	document.body.appendChild(script);

	function execScript(){
		eval(func)( element );
	}

}