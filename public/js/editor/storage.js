/****************************************************************************************************/
/****************************************** STORAGE *************************************************/
/****************************************************************************************************/
grapesjs.plugins.add('storage', editor => {

	var EDITOR_UPDATED = false;
	var storageClass = '.form-widget textarea';

	editor.on('update', () => {
		EDITOR_UPDATED = true;
	});

	editor.on('component:add', (component) => {   
	    if( 'translatable' in component.attributes && component.attributes.translatable == true ) {
	    	var random = Math.floor(Math.random() * Math.floor(1000));
	    	component.attributes.translationId = random + '_' + component.cid;
	    }
	});

	editor.StorageManager.add('customStorage', {
		getTranslations(components) {

			var translations = {};
			for( var c = 0; c < components.length; c++ ){
				var component = components[c];
				if( 'translatable' in component && component.translatable == true ){
					translations[ component.translationId ] = component;
				} else {
					translations = Object.assign(translations, this.getTranslations( component.components ));
				}
			}
			return translations;

		},
		replaceTranslations(components, translations){

			for( var c = 0; c < components.length; c++ ){
				var component = components[c];
				if( 'translationId' in component && component.translationId in translations ){
					component.components = translations[component.translationId].components;
					component.content = translations[component.translationId].content;
				} else {
					this.replaceTranslations(component.components, translations );
				}
			}

		},
		store(data){

			if( !EDITOR_UPDATED ) return;

			var dataString = JSON.stringify( data );
			CURRENT_FIELD.querySelector( storageClass ).value = dataString;
			document.querySelector('.editor-css textarea').value = data['gjs-css'];

			for( var i = 0; i < editorFields.length; i++ ){

				var editorField = editorFields[i];
				if( editorField == CURRENT_FIELD ) continue;

				var translationStorage = editorField.querySelector( storageClass );

				if( translationStorage.value == '' ){
					translationStorage.value = dataString;
					continue;
				}

				var translations = this.getTranslations( JSON.parse( JSON.parse( translationStorage.value )['gjs-components'] ) );

				var translatedData = JSON.parse(JSON.stringify( data ));
				var components = JSON.parse( translatedData['gjs-components'] );
				var styles = JSON.parse( translatedData['gjs-styles'] );
				this.replaceTranslations( components, translations );
				translatedData['gjs-components'] = JSON.stringify( components );

				var editorTranslation = grapesjs.init({
					container: '.gjs-fake-canvas', components: components, style: styles,
					storageManager: { type: null, autosave: false, autoload: false },
					plugins: ['basic-blocks', 'extra-blocks']
				});
				translatedData['gjs-html'] = editorTranslation.getHtml();

				translationStorage.value = JSON.stringify( translatedData );

				editorTranslation.destroy();

				EDITOR_UPDATED = false;

			}

		}
	});

});