grapesjs.plugins.add('basic-blocks', editor => {

	var dc = editor.DomComponents;
	var bm = editor.BlockManager;
	var ec = editor.Commands;
	var tm = editor.TraitManager;
	var cat = null;

	editor.on('component:selected', function(model) {
		if(model.get('selectBehavior')){
			model.get('selectBehavior')(editor, model);
		}
	});

	ec.add('tlb-new-child', (editor, sender, options = {}) => {
		var component = editor.getSelected();
		component.append({ type: options.type });
	});

/*************************************************************************************/
	// LAYOUT
/*************************************************************************************/
	
	CAT = 'Layout';

/* ________________________________________________________________ */

	dc.addType('container',{
		model: {
			defaults: {
				classes: ['container', 'row'],
				draggable: ['#wrapper','.wrapper-container','.parallax-inner-section','.col-fullwidth'],
				droppable: '.col',
				stylable: ['text-align','background-color'],
				traits: [{
					type: 'checkbox',
					name: 'verticalCenter',
					label: 'Vertical center',
					changeProp: 1
				},{
					type: 'checkbox',
					name: 'marginBottom',
					label: 'Margin bottom',
					changeProp: 1
				},{
					type: 'checkbox',
					name: 'print',
					label: 'PDF export',
					changeProp: 1
				}],
				verticalCenter: false,
				marginBottom: true,
				print: false
			},
			init() {
				this.listenTo(this, 'change:verticalCenter', this.handleVerticalCenterChange );
				this.handleMarginBottomChange().listenTo(this, 'change:marginBottom', this.handleMarginBottomChange );
				this.listenTo(this, 'change:print', this.handlePrintChange );
			},
			handleVerticalCenterChange() {
				this.get('verticalCenter') ? this.addClass('container-vertical-center') : this.removeClass('container-vertical-center');
			},
			handleMarginBottomChange() {
				this.get('marginBottom') ? this.removeClass('container-no-margin') :this.addClass('container-no-margin');
				return this;
			},
			handlePrintChange() {
				this.get('print') ? this.addClass('print-item') :this.removeClass('print-item');
				return this;
			}
		}
	});

/* ________________________________________________________________ */

	dc.addType('col-12',{
		model: {
			defaults: {
				name: Translator.trans('cms.column'),
				classes: ['col', 's12'],
				draggable: false,
				removable: false,
				selectBehavior: function(editor, model){
					editor.select(model.parent());
				}
			}
		}
	});

	bm.add('col-12-block', {
		label: '1 ' + Translator.trans('cms.column'),
		category: CAT,
		attributes: {class:'gjs-fonts gjs-f-b1'},
		content: {
			type: 'container',
			components: { type: 'col-12' }
		}
	});

/* ________________________________________________________________ */

	dc.addType('col-6',{
		extend: 'col-12',
		model: { defaults: { classes: ['col', 's12', 'm6'] }}
	});

	bm.add('col-6-block', {
		label: '2 ' + Translator.trans('cms.column') + 's',
		category: CAT,
		attributes: {class:'gjs-fonts gjs-f-b2'},
		content: {
			type: 'container',
			components: [
				{ type: 'col-6' },
				{ type: 'col-6' },
			]
		}
	});

	bm.add('col-8-4-block', {
		label: '2 ' + Translator.trans('cms.column') + 's 1/3',
		category: CAT,
		attributes: {class:'gjs-fonts gjs-f-b37'},
		content: {
			type: 'container',
			components: [
				{ type: 'col-6', classes: ['col','s12','m4'] },
				{ type: 'col-6', classes: ['col','s12','m8'] },
			]
		}
	});

/* ________________________________________________________________ */

	dc.addType('col-4',{
		extend: 'col-12',
		model: { defaults: { classes: ['col', 's12', 'm4'] }}
	});

	bm.add('col-4-block', {
		label: '3 ' + Translator.trans('cms.column') + 's',
		category: CAT,
		attributes: {class:'gjs-fonts gjs-f-b3'},
		content: {
			type: 'container',
			components: [
				{ type: 'col-4' },
				{ type: 'col-4' },
				{ type: 'col-4' },
			]
		}
	});

/* ________________________________________________________________ */

	dc.addType('wrapper-container',{
		model: {
			defaults: {
				classes: ['wrapper-container'],
				draggable: '#wrapper',
				droppable: ['.container','.spacer','.divider-container'],
				stylable: ['background-color']
			}
		}
	});

	bm.add('wrapper-block',{
		label: Translator.trans('cms.wrapper'),
		category : CAT,
		attributes: {class:'gjs-fonts gjs-f-b1'},
		content: {
			type: 'wrapper-container'
		}
	});

/* ________________________________________________________________ */

	dc.addType('col-fullwidth',{
		model: {
			defaults: {
				name: Translator.trans('cms.fullwidth_column'),
				classes: ['col-fullwidth'],
				draggable: '.container-fullwidth',
				droppable: ['img','.container'],
				traits: [{
					type: 'select',
					name: 'position',
					label: Translator.trans('cms.position'),
					changeProp: 1,
					options: [
						{ value: 'fullwidth-top', name: 'Top' },
						{ value: '', name: 'Center' },
						{ value: 'fullwidth-bottom', name: 'Bottom' },
					]
				},{
					type: 'select',
					name: 'shadow',
					label: Translator.trans('cms.shadow'),
					changeProp: 1,
					options: [
						{ value: '', name: Translator.trans('cms.none') },
						{ value: 'z-depth-1', name: Translator.trans('cms.depth') + ' 1' },
						{ value: 'z-depth-2', name: Translator.trans('cms.depth') + ' 2' },
						{ value: 'z-depth-3', name: Translator.trans('cms.depth') + ' 3' },
						{ value: 'z-depth-4', name: Translator.trans('cms.depth') + ' 4' },
						{ value: 'z-depth-5', name: Translator.trans('cms.depth') + ' 5' }
					]
				}],
				position: '',
				shadow: '',
				
			},
			init() {
				this.addClass( this.get('shadow') );
				this.listenTo( this, 'change:shadow', this.handleStyleChange );
				this.addClass( this.get('position') );
				this.listenTo(this, 'change:position', this.handleStyleChange);
			},
			handleStyleChange( component ) {

				var changed = component.changed;
				var property = Object.keys(changed)[0], value = changed[property];
				var options = this.getTrait( property ).attributes.options;

				for(var i = 0; i<options.length; i++){
					if(options[i].value != value) this.removeClass( options[i].value );
				}
				this.addClass( value );
				return this;
			}
		}
	});

	bm.add('col-fullwidth-block',{
		label: Translator.trans('cms.fullwidth_column'),
		attributes: {class:'gjs-fonts gjs-f-b2'},
		category: CAT,
		content: {
			name: Translator.trans('cms.fullwidth_container'),
			droppable: '.col-fullwidth',
			classes: ['container-fullwidth'],
			draggable: '#wrapper',
			resizable: { minDim: 50, tl: 0, tr: 0, cl: 0, cr: 0, bl: 0, br: 0},
			components: [
				{ type: 'col-fullwidth'},
				{ type: 'col-fullwidth'}
			]
		}
	});


/*************************************************************************************/
	// BASIC
/*************************************************************************************/

	CAT = 'Basic';

/* ________________________________________________________________ */

	dc.addType('text',{
		extend: 'text',
		model: { 
			defaults: { 
				name: Translator.trans('cms.text'),
				icon: '<i class="fa fa-paragraph"></i>',
				style: { 'text-align' : 'justify' },
				content: Translator.trans('cms.edit_this_text'),
				draggable: ['.col'],
				translatable: true,
				traits: [{
					type: 'checkbox',
					name: 'important',
					label: 'Important',
					changeProp: 1
				}],
				important: false
			},
			init() {
				this.handleImportantChange().listenTo(this, 'change:important', this.handleImportantChange );
			},
			handleImportantChange() {
				this.get('important') ? this.addClass('important') : this.removeClass('important');
				return this;
			},
		}
	});

	bm.add('text-block', {
	    label: Translator.trans('cms.text'),
	    category: CAT,
	    attributes: { class:'fa fa-paragraph' },
	    content: { 
	    	type: 'text', 
	    	content: Translator.trans('cms.lorem'),
		},
	    select: true, activate: true
  	});

/* ________________________________________________________________ */

	dc.addType('title',{
		extend: 'text',
		model: { 
			defaults: { 
				icon: '<i class="fa fa-font"></i>',
				content: Translator.trans('cms.edit_this_title'),
				tagName: 'h3',
				traits: [{
					type: 'select',
					name: 'tagName',
					label: 'Size',
					changeProp: 1,
					options: [
						{ value: 'h1', name: Translator.trans('cms.heading') + ' 1' },
						{ value: 'h2', name: Translator.trans('cms.heading') + ' 2' },
						{ value: 'h3', name: Translator.trans('cms.heading') + ' 3' },
						{ value: 'h4', name: Translator.trans('cms.heading') + ' 4' },
						{ value: 'h5', name: Translator.trans('cms.heading') + ' 5' },
						{ value: 'h6', name: Translator.trans('cms.heading') + ' 6' },
					]			
				},{
					type: 'checkbox',
					name: 'line',
					label: Translator.trans('cms.line_behind'),
					changeProp: 1
				}],
				line: false,
				translatable: true 
			},
			init() {
				this.handleLineChange().listenTo(this, 'change:line', this.handleLineChange);
			},
			handleLineChange() {
				this.get('line') ? this.addClass('line-behind') : this.removeClass('line-behind');
				return this;
			}
		}
	});

	bm.add('title-block', {
	    label: Translator.trans('cms.title'),
	    category: CAT,
	    attributes: { class:'fa fa-font' },
	    content: { type: 'title' },
	    select: true, activate: true
  	});

/* ________________________________________________________________ */

	bm.add('headline-block',{
		label: Translator.trans('cms.headline'),
		category: CAT,
		attributes: {class:'fa fa-heading'},
		content: {
			type: 'container',
			droppable: false,
			style: { 'margin-bottom' : 0 },
			components: {
				type: 'col-12',
				classes: [ ...dc.getType('col-12').model.prototype.defaults.classes, 'headline' ],
				removable: false, copyable: false, draggable: false,
				droppable: ['.spacer','.divider-container'],
				propagate: ['removable','copyable','draggable'],
				components: [{
					type: 'text',
					content: Translator.trans('cms.discover'),
					classes: ['headline-top'],
					style: { 'text-align' : 'center' },
				},{
					type: 'title',
					content: Translator.trans('cms.beautiful_resort'),
					tagName: 'h2',
					line: true,
					classes: ['headline-title'],
				}]
			}
		}
	});

/* ________________________________________________________________ */

  	dc.addType('icon',{
		model: {
			defaults: {
				name: Translator.trans('cms.icon'),
				classes: ['material-icons'],
				content: 'keyboard_arrow_right',
				tagName: 'i',
				traits: [{
					type: 'select',
					name: 'position',
					label: Translator.trans('cms.position'),
					changeProp: 1,
					options: [
						{ value: '', name: Translator.trans('cms.auto') },
						{ value: 'left', name: Translator.trans('cms.left') },
						{ value: 'right', name: Translator.trans('cms.right') }
					]
				},{
					type: 'select',
					name: 'iconType',
					label: Translator.trans('cms.icon'),
					changeProp: 1,
					options: [
						{ value: 'keyboard_arrow_right', name: 'Arrow right' },
						{ value: 'keyboard_arrow_left', name: 'Arrow left' },
						{ value: 'keyboard_arrow_up', name: 'Arrow up' },
						{ value: 'keyboard_arrow_down', name: 'Arrow down' },
						{ value: 'local_dining', name: 'Dining' },
						{ value: 'restaurant', name: 'Restaurant' },
						{ value: 'hotel', name: 'Bed' },
						{ value: 'send', name: 'Send' },
						{ value: 'format_quote', name: 'Quote' },
						{ value: 'lock', name: 'Locker' },
						{ value: 'spa', name: 'Lotus' },
						{ value: 'chat_bubble_outline', name: 'Chat' },
						{ value: 'file_download', name: 'Download' },
						{ value: 'file_upload', name: 'Upload' },
						{ value: 'star', name: 'Star' },
						{ value: 'close', name: 'Close' },
						{ value: 'info', name: 'Info' },
						{ value: 'help', name: 'Help' },
						{ value: 'flight', name: 'Flight' },
						{ value: 'flight_land', name: 'Flight land' },
						{ value: 'flight_takeoff', name: 'Flight take off' },
						{ value: 'directions_boat', name: 'Boat' },
						{ value: 'directions_car', name: 'Car' },
						{ value: 'filter_hdr', name: 'Mountains' },
						{ value: 'favorite', name: 'Heart' },
					]
				},{
					type: 'select',
					name: 'size',
					label: Translator.trans('cms.size'),
					changeProp: 1,
					options: [
						{ value: '', name: Translator.trans('cms.auto') },
						{ value: 'tiny', name: 'Tiny' },
						{ value: 'small', name: 'Small' },
						{ value: 'medium', name: 'Medium' },
						{ value: 'large', name: 'Large' },
					]
				}],
				position: '',
				size: '',
				iconType: 'keyboard_arrow_right'
			},
			init() {

				this.addClass( this.get('position') );
				this.listenTo(this, 'change:position', this.handleStyleChange);

				this.addClass( this.get('size') );
				this.listenTo(this, 'change:size', this.handleStyleChange);

				this.handleIconTypeChange().listenTo(this, 'change:iconType', this.handleIconTypeChange);
			},
			handleStyleChange( component ) {

				var changed = component.changed;
				var property = Object.keys(changed)[0], value = changed[property];
				var options = this.getTrait( property ).attributes.options;

				for(var i = 0; i<options.length; i++){
					if(options[i].value != value) this.removeClass( options[i].value );
				}
				this.addClass( value );
				return this;
			},
			handleIconTypeChange() {
				this.set( { content: this.get('iconType') } );
				return this;
			}
		}
	});

  	bm.add('icon-block',{
  		label: Translator.trans('cms.icon'),
  		attributes: { class: 'fa fa-bolt' },
  		category: CAT,
  		content: { type: 'icon', draggable: ['.col'], droppable: false }
  	})

/* ________________________________________________________________ */
	
	//AMELIORER LA DESELECTION DU LIEN DANS LES TEXTES !

	//LIENS 
	dc.addType('link',{
		extend: 'link',
		model: {
			defaults: {
				name: Translator.trans('cms.link'),
				icon: '<i class="fa fa-link"></i>',
				content: Translator.trans('cms.edit_this_link'),
				draggable: ['.col'],
				traits: [
				{
					type: 'checkbox',
					name: 'external',
					label: Translator.trans('cms.external'),
					changeProp: 1
				},
				{	
					type: 'select',
					name: 'page',
					label: Translator.trans('cms.page'),
					changeProp: 1,
					options: linkOptions
				}, 'href', 'target', 'title'
				],
				page : 'none',
				external: false,
				translatable: true
			},
			init() {

			this.getTrait('href').set('attributes', {style: 'display: none'} );
			this.listenTo(this, 'change:external', this.handleExternalChange);
			this.listenTo(this, 'change:page', this.handlePageChange);

			},
			handlePageChange() {

				var traitHref = this.getTrait('href');
				this.get('page') == 'none' ? traitHref.set('value', '' ) : traitHref.set('value', this.get('page') );
 				tm.render();

			},
			handleExternalChange() {

				var external = this.get('external'), traitHref = this.getTrait('href'), traitPage = this.getTrait('page');
				if(external){
					traitPage.set('attributes', {style: 'display: none'} );
					traitHref.set('attributes', {style: 'display: flex'} );
					traitHref.set('value', '');
					tm.render();
				}else{
					traitPage.set('attributes', {style: 'display: flex'} );
					traitHref.set('attributes', {style: 'display: none'} );
					this.handlePageChange();
				}

			}
		},
		isComponent(el) {
	      var result;
	      var avoidEdit;

	      if (el.tagName == 'A') {
	        result = {
	          type: 'link',
	          editable: 0
	        };

	        // The link is editable only if, at least, one of its
	        // children is a text node (not empty one)
	        var children = el.childNodes;
	        var len = children.length;
	        if (!len) delete result.editable;

	        for (var i = 0; i < len; i++) {
	          const child = children[i];

	          if (child.nodeType == 3 && child.textContent.trim() != '') {
	            delete result.editable;
	            break;
	          }
	        }
	      }

	      return result;
    	}
	});

	bm.add('link-block', {
	    label: Translator.trans('cms.link'),
	    category: CAT,
	    attributes: { class:'fa fa-link' },
	    content: { type: 'link' },
	    select: true, activate: true
  	});

/* ________________________________________________________________ */

	dc.addType('btn',{
		extend: 'link',
		model: { 
			defaults: {
				name: Translator.trans('cms.button'),
				icon: '',
				classes: ['btn'],
				editable: false,
		      	droppable: true,
		      	content: '',
		      	components: [
		    		{ type: 'text', tagName: 'span', content: Translator.trans('cms.edit'), draggable: false, removable: false, copyable: false },
		    		{ type: 'icon', position: 'right', draggable: false, deletable: false, copyable: false },
		    	],
				traits: [
				...dc.getType('link').model.prototype.defaults.traits,
				{
					type: 'select',
					name: 'btnType',
					label: Translator.trans('cms.type'),
					changeProp: 1,
					options: [
						{ value: '', name: Translator.trans('cms.button') },
						{ value: 'btn-light', name: Translator.trans('cms.button_light') },
						{ value: 'btn-transparent', name: Translator.trans('cms.button_transparent') },
					]
				},{
					type: 'select',
					name: 'btnSize',
					label: Translator.trans('cms.size'),
					changeProp: 1,
					options: [
						{ value: 'btn-small', name: 'Small' },
						{ value: '', name: 'Normal' },
						{ value: 'btn-large', name: 'Large' },
					]
				},{
					type: 'checkbox',
					label: Translator.trans('cms.disabled'),
					name: 'disabled',
					changeProp: 1
				}],
				btnType: '',
				btnSize: '',
				disabled: false
			},
			init() {

				this.getTrait('href').set('attributes', {style: 'display: none'} );
				this.listenTo(this, 'change:external', this.handleExternalChange);
				this.listenTo(this, 'change:page', this.handlePageChange);

				this.addClass( this.get('btnType'));
				this.listenTo(this, 'change:btnType', this.handleStyleChange );

				this.addClass( this.get('btnSize') );
				this.listenTo(this, 'change:btnSize', this.handleStyleChange );

				this.listenTo(this, 'change:disabled', this.handleDisabledChange );
			},
			handleStyleChange( component ) {

				var changed = component.changed;
				var property = Object.keys(changed)[0], value = changed[property];
				var options = this.getTrait( property ).attributes.options;

				for(var i = 0; i<options.length; i++){
					if(options[i].value != value) this.removeClass( options[i].value );
				}
				this.addClass( value );
				return this;
			},
			handleDisabledChange() {
				var disabled = this.get('disabled');
				disabled ? this.addClass('disabled') : this.removeClass('disabled');
				return this;
			}
		}
	});


/* ________________________________________________________________ */

  	bm.add('btn-block', {
  		label: Translator.trans('cms.button'),
	    category: CAT,
	    attributes: { class: 'gjs-fonts gjs-f-button' },
	    content: { type:'btn' },
	});

	bm.add('btn-action-block',{
		label: Translator.trans('cms.call_to_action'),
		category: CAT,
		attributes: { class: 'fa fa-square' },
		content:{
			type: 'container',
			classes: ['call-to-action'],
			droppable: false,
			components: {
				type: 'col-12',
				droppable: false,
				components: [
					{ type: 'btn', btnType: 'btn-light', btnSize: 'btn-large', components : { type: 'text', tagName: 'span', content: Translator.trans('cms.some_link_here'), draggable: false, removable: false, copyable: false } },
					{ type: 'btn', btnSize: 'btn-large' }
				]
			}
		}
	})

/* ________________________________________________________________ */

	dc.addType('spacer',{
		model: { 
			defaults: { 
				name: Translator.trans('cms.spacer'),
				classes: ['spacer'],
				icon: '<i class="fa fa-sort"></i>',
				droppable: false, stylable: false,
				style: { height: '20px' },
				draggable: ['#wrapper','.wrapper-container','.col'],
				resizable: { minDim: 20, tl: 0, tr: 0, cl: 0, cr: 0, bl: 0, br: 0}
			}
		}
	});

	bm.add('spacer-block', {
	    label: Translator.trans('cms.spacer'),
	    category: CAT,
	    attributes: { class:'fa fa-sort' },
	    content: { type: 'spacer' },
	    select: true
  	});

/* ________________________________________________________________ */

	dc.addType('divider',{
		model: { 
			defaults: { 
				name: Translator.trans('cms.divider'),
				classes: ['divider-container'],
				icon: '<i class="fa fa-minus"></i>',
				droppable: false, stylable: false,
				style: { height: '20px' },
				draggable: ['#wrapper','.wrapper-container','.col'],
				resizable: { minDim: 20, tl: 0, tr: 0, cl: 0, cr: 0, bl: 0, br: 0},
				content: '<hr>'
			}
		}
	});

	bm.add('divider-block', {
	    label: Translator.trans('cms.divider'),
	    category: CAT,
	    attributes: { class:'fa fa-minus' },
	    content: { type: 'divider' },
	    select: true
  	});

/* ________________________________________________________________ */
	
	var listItemSwitcherTrait = {
		type : 'select',
		name : 'type',
		label: Translator.trans('cms.type'),
		changeProp: 1,
		options: [
			{ value: 'list-item-text', name: Translator.trans('cms.text') },
			{ value: 'list-item-text-icon', name: Translator.trans('cms.text_icon') },
			{ value: 'list-item-link', name: Translator.trans('cms.link') },
			{ value: 'list-item-link-icon', name: Translator.trans('cms.link_icon') }
		]
	};

	dc.addType('list-item-text',{
		extend: 'text',
		model: {
			defaults: {
				name: Translator.trans('cms.list_element'),
				classes: ['collection-item'],
				draggable: '.collection',
				traits: [ listItemSwitcherTrait ],
				type: 'list-item-text'
			},
			init() {
				this.listenTo(this, 'change:type', this.handleTypeChange);
			},
			handleTypeChange() {
				var component = this.replaceWith({ type: this.get('type') });
				editor.select(component);
			}
		}
	});

	dc.addType('list-item-text-icon',{
		model: {
			defaults: {
				name: Translator.trans('cms.list_element'),
				classes: ['collection-item'],
				draggable: '.collection',
				traits: [ listItemSwitcherTrait ],
				type: 'list-item-text-icon',
				components: [
					{ type: 'icon', classes: ['material-icons', 'collection-item-icon'], resizable: false, removable: false, draggable: false, copyable: false },
					{ type: 'text', classes: ['collection-item-text'], resizable: false, removable: false, draggable: false, copyable: false }
				]
			},
			init() {
				this.listenTo(this, 'change:type', this.handleTypeChange);
			},
			handleTypeChange() {
				var component = this.replaceWith({ type: this.get('type') });
				editor.select(component);
			}
		}
	});

	dc.addType('list-item-link',{
		extend: 'link',
		model: {
			defaults: {
				name: Translator.trans('cms.list_element'),
				classes: ['collection-item'],
				draggable: '.collection',
				traits: [ listItemSwitcherTrait,
						...dc.getType('link').model.prototype.defaults.traits ],
				type: 'list-item-link'
			},
			init() {
				this.listenTo(this, 'change:type', this.handleTypeChange);
			},
			handleTypeChange() {
				var component = this.replaceWith({ type: this.get('type') });
				editor.select(component);
			}
		}
	});

	dc.addType('list-item-link-icon',{
		model: {
			defaults: {
				name: Translator.trans('cms.list_element'),
				classes: ['collection-item'],
				draggable: '.collection',
				traits: [ listItemSwitcherTrait ],
				type: 'list-item-text-icon',
				components: [
					{ type: 'icon', classes: ['material-icons', 'collection-item-icon'], resizable: false, removable: false, draggable: false, copyable: false },
					{ type: 'link', classes: ['collection-item-link'], resizable: false, removable: false, draggable: false, copyable: false }
				]
			},
			init() {
				this.listenTo(this, 'change:type', this.handleTypeChange);
			},
			handleTypeChange() {
				var component = this.replaceWith({ type: this.get('type') });
				editor.select(component);
			}
		}
	});

	dc.addType('list',{
		extendFn: ['initToolbar'],
		model: {
			defaults: {
				name: Translator.trans('cms.list'),
				classes: ['collection'],
				draggable: '.col',
				droppable: '.collection-item'
			},
			initToolbar () {
				var tb = this.get('toolbar');
				tb.unshift({
				  attributes: { class: 'fa fa-plus' },
				  command: () => {
				  	ec.run('tlb-new-child', { type : 'list-item-text' });
				  }
				});
				this.set('toolbar', tb);
			}
		},
	});

	bm.add('list-block',{
		label: Translator.trans('cms.list'),
		category: CAT,
		attributes: {class:'fa fa-list'},
		content: {
			type: 'list',
			components: [{ type: 'list-item-text' }]
		}
	});


/*************************************************************************************/
	// MEDIAS
/*************************************************************************************/

	CAT = 'Medias';

	dc.addType('image',{
		model: {
			defaults: {
				name: Translator.trans('cms.image'),
				icon: '<i class="fa fa-image"></i>',
				traits: [
					...dc.getType('image').model.prototype.defaults.traits ,
					{
						type: 'checkbox',
						name: 'overlay',
						label: Translator.trans('cms.overlay'),
						changeProp: 1
					}
				],
				overlay: false
			},
			init() {
				this.handleOverlayChange().listenTo(this, 'change:overlay', this.handleOverlayChange);
			},
			handleOverlayChange() {
				this.get('overlay') ? this.addClass('img-overlay') : this.removeClass('img-overlay');
				return this;
			}
		}
	});

	bm.add('image-block', {
	    label: Translator.trans('cms.image'),
	    category: CAT,
	    attributes: {class:'fa fa-image'},
	    content: { type: 'image' },
	    select: true, activate: true
	});

/* ________________________________________________________________ */

	dc.addType('background-image',{
		extend: 'image',
		model: {
			defaults: {
				name: Translator.trans('cms.background_image'),
				icon: '<i class="fa fa-image"></i>',
				draggable: ['#wrapper'],
				classes: ['background-image'],
				copyable: false
			}
		}
	});

	bm.add('background-image-block', {
	    label: Translator.trans('cms.background_image'),
	    category: CAT,
	    attributes: {class:'fa fa-image'},
	    content: { type: 'background-image' },
	    select: true, activate: true
	});

/* ________________________________________________________________ */

	dc.addType('parallax-inner-section',{
		model: {
			defaults:{
				name: Translator.trans('cms.parallax_inner_section'),
				classes: ['parallax-inner-section'],
				draggable: false, removable: false, copyable: false,
				traits: [{
					type: 'select',
					name: 'position',
					label: Translator.trans('cms.position'),
					changeProp: 1,
					options: [
						{ value: 'parallax-top', name: 'Top' },
						{ value: '', name: 'Center' },
						{ value: 'parallax-bottom', name: 'Bottom' },
					]
				}],
				position: ''
			},
			init() {
				this.addClass( this.get('position') );
				this.listenTo(this, 'change:position', this.handleStyleChange);
			},
			handleStyleChange( component ) {

				var changed = component.changed;
				var property = Object.keys(changed)[0], value = changed[property];
				var options = this.getTrait( property ).attributes.options;

				for(var i = 0; i<options.length; i++){
					if(options[i].value != value) this.removeClass( options[i].value );
				}
				this.addClass( value );
				return this;
			}
		}
	});

	bm.add('parallax-block',{
	    label : Translator.trans('cms.parallax'),
	    attributes: {class: 'fa fa-camera-retro'},
	    category: CAT,
	    content: {
	      name: Translator.trans('cms.parallax_container'),
	      classes: ['parallax-container'],
	      resizable: { minDim: 20, tl: 0, tr: 0, cl: 0, cr: 0, bl: 0, br: 0},
	      components: [{
	        name: Translator.trans('cms.parallax_image_wrapper'),
	        classes: ['parallax'],
	        droppable: false, selectable: false,
	        components:[{
	          	type: 'image',
	          	name: Translator.trans('cms.parallax_image'),
	          	resizable: false, removable: false, draggable: false, copyable: false
	        }]
	      },{ type: 'parallax-inner-section' }]
	    }
	  });


/* ________________________________________________________________ */

	dc.addType('gallery',{
		extend: 'container',
		extendFn: ['initToolbar'],
		model:{
			defaults: {
				name: Translator.trans('cms.gallery'),
				classes: ['container','row','gallery'],
				droppable: ['.gallery-item'],
 				scriptPath: '/js/gallery/gallery.js',
 				scriptFunction: 'initGallery',
 				script: function(){
 					loadBlockScript( '{[ scriptPath ]}', '{[ scriptFunction ]}', this );
 				}

			},
			initToolbar () {
				var tb = this.get('toolbar');
				tb.unshift({
				  attributes: { class: 'fa fa-plus' },
				  command: () => {
				  	ec.run('tlb-new-child', { type : 'gallery-item' });
				  }
				});
				this.set('toolbar', tb);
			}
		}
	});

	dc.addType('gallery-item',{
		extend: 'link',
		editable: false,
		model: {
			defaults: {
				name: Translator.trans('cms.gallery_item'),
				classes: ['col','s12','m4','gallery-item'],
				content: '',
				components: [
					{ type: 'gallery-image' }
				]
			},
		}
	});

	dc.addType('gallery-image',{
		extend: 'image',
		extendFn: ['init'],
		model:{
			defaults: {
				name: Translator.trans('cms.gallery_image'),
				classes: ['gallery-image','z-depth-5'],
				draggable: false, removable: false, copyable: false 
			},
			init() {
				this.listenTo(this, 'change:src', this.handleSrcChange);
			},
			handleSrcChange() {
				this.parent().setAttributes({'href' : this.get('src'), 'data-fancybox' : 'group'});
			}
		}
	})

	bm.add('gallery-block',{
		label: Translator.trans('cms.gallery'),
		category: CAT,
		attributes: { class: 'fa fa-camera' },
		content: {
			type: 'gallery',
			components: [
				{ type: 'gallery-item' }
			]
		}
	});

/* ________________________________________________________________ */

	dc.addType('video-container',{
		model: {
			defaults: {
				name: Translator.trans('cms.video_container'),
				classes: ['video-container'],
				components: [{
					type: 'video'
				}]
			}
		}
	});

	bm.add('video-block',{
		label: Translator.trans('cms.video'),
		attributes: { class: 'fa fa-video-camera' },
		category: CAT,
		content: {
			type: 'video-container'
		}
	});

});