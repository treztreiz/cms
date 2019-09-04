var buttonClass = '.toggle-editor';
var fieldClass = '.field-editor';
var wrapperClass = '.editor-wrapper';

var styles = [
'../lib/materialize/css/materialize.min.css',
'https://fonts.googleapis.com/icon?family=Material+Icons',
'../css/root.css',
'../css/main.css',
'../css/canvas.css'
];

var scripts = [
'../lib/jquery/jquery.min.js',
'../lib/materialize/js/materialize.min.js',
'../bundles/fosjsrouting/js/router.min.js',
'/js/routing?callback=fos.Router.setData',
'../js/editor/canvas.js',
];

var editorFields = document.querySelectorAll( fieldClass );
var CURRENT_FIELD = null, CURRENT_EDITOR = null, BASE_HTML = null;
var linkOptions = [];

$(function(){
	if(!editorFields.length) return;
	initialize();
});

/* ________________________________________________________________ */

function initEditor(){

	var storageDOM = CURRENT_FIELD.querySelector('.form-widget textarea');
	var storage = retrieveStorage( storageDOM );
	var editor = grapesjs.init({

		container: CURRENT_FIELD.querySelector('.canvas'),
		height: '100%',
		width: 'auto',
		noticeOnUnload: false,
		components: storage.components,
		style: storage.style,

		plugins: ['commands', 'storage', 'assets', 'basic-blocks', 'extra-blocks'],

		canvas: {
			styles: styles,
			scripts: scripts,
		},
		panels: { defaults: [] },

		storageManager: {
			type: 'customStorage',
			storeAssets: true,
			autosave: false,
			autoload: false
		},

		assetManager: {
			assets: storage.assets,
			upload: Routing.generate('admin.asset_upload'),
			uploadName: 'files'
		},

		avoidInlineStyle: 1,

		styleManager: getStyleConfig(),
		blockManager: { appendTo:     CURRENT_FIELD.querySelector('.blocks-container') },
		layerManager: { appendTo:     CURRENT_FIELD.querySelector('.layers-container') },
      	traitManager: { appendTo:     CURRENT_FIELD.querySelector('.traits-container') },
      	stylesManager: { appendTo:    CURRENT_FIELD.querySelector('.styles-container') },

      	deviceManager: {
      		devices : [{
      			name: 'Desktop',
      			width: ''
      		},{
      			name: 'Mobile',
      			width: '320px',
      			widthMedia: '480px'
      		}]
      	}

      });

	initPanels(editor);
	initPaste(editor);

	editor.on('load', () => {
		CURRENT_FIELD.querySelector('.gjs-frame').contentWindow.initMaterialize();
	});

	CURRENT_EDITOR = editor;

}

/* ________________________________________________________________ */

function initialize(){

	var url = Routing.generate('admin.pages_link');
	$.post(url,function( response ){
		linkOptions = response;
		initEditorTrigger();
	});
	
}

/* ________________________________________________________________ */

function initEditorTrigger(){

	for(var i = 0; i < editorFields.length; i++){

		if( BASE_HTML == null ) BASE_HTML = editorFields[i].querySelector( wrapperClass ).innerHTML;

		editorFields[i].querySelector( buttonClass ).addEventListener('click',function(e){

			editorField = e.target.closest( fieldClass );
			var wrapper = editorField.querySelector( wrapperClass );
			wrapper.style.display = 'block';

			if( CURRENT_FIELD == editorField) return;
			else if( CURRENT_FIELD !== null ){
				CURRENT_EDITOR.destroy();
				wrapper.innerHTML = BASE_HTML;
			}
			CURRENT_FIELD = editorField;

			initEditor();

		});

	}

}

/* ________________________________________________________________ */

function retrieveStorage(storageDOM){
	var components = null, style  = null, assets = null, data = storageDOM.value;
	if("" !== data){
		try {

			data = JSON.parse(data);
			components = JSON.parse(data['gjs-components']);
			style = JSON.parse(data['gjs-styles']);
			assets = JSON.parse(data['gjs-assets']);

		} catch(e) { console.warn("Error while parsing JSON : " + e.message) }
	}

	return { components : components, style: style, assets: assets, data: data };
}

/* ________________________________________________________________ */

function getStyleConfig(){

	var config = {
		appendTo:  CURRENT_FIELD.querySelector('.styles-container'),
		sectors : [{
			name: 'General',
			buildProps: ['text-align','color','background-color']
		},{
			name: 'Typography',
			buildProps: ['font-family','font-weight','font-size','text-transform'],
			properties: [{
				property: 'font-family',
				name: 'Font',
				list: [
				{ name: 'Questrial', value: 'Questrial, sans-serif' },
				{ name: 'Optane', value: 'Optane, sans-serif' },
				{ name: 'Trajan', value: 'Trajan, sans-serif' },
				]
			},{
				type: 'select',
				property: 'text-transform',
				name: 'Text transform',
				list: [
				{ name: 'Auto', value: 'initial' },
				{ name: 'Uppercase', value: 'uppercase' },
				{ name: 'Capitalize', value: 'capitalize' },
				{ name: 'Lowercase', value: 'lowercase' }
				]
			}]
		},{
			name: 'Space',
			buildProps: ['margin','padding']
		},{
			name: 'Border',
			buildProps: ['border','border-radius']
		}]
	};

	return config;

}

/* ________________________________________________________________ */

function initPaste(editor) {

	var iframeBody = editor.Canvas.getBody();

	$(iframeBody).on("paste", '[contenteditable="true"]', function(e) {
		e.preventDefault();
		var text = e.originalEvent.clipboardData.getData('text');
		text = text.replace(/(\r\n|\n|\r)/gm, "");
		e.target.ownerDocument.execCommand("insertText", false, text);
	});
	editor.SelectorManager.getAll().each(selector => selector.set('private', 1));
	editor.on('selector:add', selector => selector.set('private', 1));

	$(iframeBody).on("keydown", "[contenteditable]", e => {
		if (e.keyCode === 13) {
			e.preventDefault();
			e.target.ownerDocument.execCommand("insertHTML", false, "<br>");
			return false;
		}
	});

}