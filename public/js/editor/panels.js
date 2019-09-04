/****************************************************************************************************/
/****************************************** PANELS *************************************************/
/****************************************************************************************************/

function initPanels(editor){

	var ep = editor.Panels;

	ep.addPanel({
		id: 'panel-top',
		el: CURRENT_FIELD.querySelector('.panel__top'),
	});

	ep.addPanel({
		id: 'basic-actions',
		el: CURRENT_FIELD.querySelector('.panel__basic-actions'),
		buttons: [{
			active: true,
			id: 'sw-visibility',
			className: 'fas fa-eye',
			command: 'sw-visibility',
			attributes: { title: 'View components' }
		},{
			id: 'fullscreen',
			command: 'set-fullscreen',
			context: 'fullscreen',
			className: 'fas fa-expand',
		},{
			id: 'close',
			command: 'set-close',
			className: 'fas fa-save btn-save',
			context: 'close'
		}
		],
	});

	ep.addPanel({
		id: 'layers',
		el: CURRENT_FIELD.querySelector('.panel__right'),
		resizable: {
			maxDim: 350, minDim: 200,
			tc: 0, cl: 0,  cr: 1, bc: 0,
			keyWidth: 'flex-basis',
		}
	});

	ep.addPanel({
		id: 'panel-switcher',
		el: CURRENT_FIELD.querySelector('.panel__switcher'),
		buttons: [
		{
			id: 'show-blocks',
			active: true,
			className: 'fas fa-th-large',
			command: 'show-blocks',
			togglable: false
		},
		{
			id: 'show-config',
			className: 'fas fa-paint-brush',
			command: 'show-config',
			togglable: false
		},
		{
			id: 'show-layers',
			active: true,
			className: 'fab fa-buffer',
			command: 'show-layers',
			togglable: false
		}
		]
	});

	ep.addPanel({
		id: 'panel-devices',
		el: CURRENT_FIELD.querySelector('.panel__devices'),
		buttons: [{
			id: 'device-desktop',
			active: true,
			className: 'fas fa-desktop',
			command: 'set-device-desktop',
			togglable: false,
			context: 'devices'
		},{
			id: 'device-mobile',
			className: 'fas fa-mobile-alt',
			command: 'set-device-mobile',
			togglable: false,
			context: 'devices'
		}]
	});

}