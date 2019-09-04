/****************************************************************************************************/
/************************************ EDITOR ASSETS *************************************************/
/****************************************************************************************************/

grapesjs.plugins.add('assets', editor => {

	var UPLOAD_ERRORS = false;
	var am = editor.AssetManager;

	editor.on('asset:upload:response', (response) => {

		if(response.errors.length){

			var content = '';
			for(var i = 0; i < response.errors.length; i++){
				var error = response.errors[i];
				content += '<div class="alert alert-danger" role="alert">'
				content += '<h3>' + error.filename + '</h3>';
				content += '<ul>';
				for(var j = 0; j < error.violations.length; j ++){
					content += '<li>' + error.violations[j] + '</li>';
				}
				content += '</ul></div>';
			}

			UPLOAD_ERRORS = true;
			editor.Modal.setTitle('Error(s) while uploading file(s) :').setContent(content).open();

		}
		am.add((response.assets));

	});

	editor.on('modal:close', () => {

		if(UPLOAD_ERRORS){

			UPLOAD_ERRORS = false;
			setTimeout(function(){
				editor.runCommand('open-assets', {
					target: editor.getSelected()
				});
			}, 100);

		}

	});

});