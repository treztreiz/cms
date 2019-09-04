/****************************************************************************************************/
/****************************************** COMMANDS *************************************************/
/****************************************************************************************************/

grapesjs.plugins.add('commands', editor => {

  editor.Commands.add('show-blocks', {
    getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
    getBlocksEl(row) { return row.querySelector('.blocks-container') },

    run(editor, sender) {
      const lmEl = this.getBlocksEl(this.getRowEl(editor));
      lmEl.style.display = '';
    },
    stop(editor, sender) {
      const lmEl = this.getBlocksEl(this.getRowEl(editor));
      lmEl.style.display = 'none';
    },
  });

  editor.Commands.add('show-layers', {
    getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
    getLayersEl(row) { return row.querySelector('.layers-container') },

    run(editor, sender) {
      const lmEl = this.getLayersEl(this.getRowEl(editor));
      lmEl.style.display = '';
    },
    stop(editor, sender) {
      const lmEl = this.getLayersEl(this.getRowEl(editor));
      lmEl.style.display = 'none';
    },
  });

  editor.Commands.add('show-config', {
    getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
    getStyleEl(row) { return row.querySelector('.config-container') },

    run(editor, sender) {
      const smEl = this.getStyleEl(this.getRowEl(editor));
      smEl.style.display = '';
    },
    stop(editor, sender) {
      const smEl = this.getStyleEl(this.getRowEl(editor));
      smEl.style.display = 'none';
    },
  });

  editor.Commands.add('set-device-desktop', {
    run: editor => editor.setDevice('Desktop')
  });
  editor.Commands.add('set-device-mobile', {
    run: editor => editor.setDevice('Mobile')
  });

  editor.Commands.add('set-fullscreen',{
    isEnabled() {
      var d = document;
      if (
        d.fullscreenElement ||
        d.webkitFullscreenElement ||
        d.mozFullScreenElement
        )
        return 1;
      else return 0;
    },
    enable(el) {
      var pfx = '';
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) {
        pfx = 'webkit';
        el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        pfx = 'moz';
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) el.msRequestFullscreen();
      else console.warn('Fullscreen not supported');
      return pfx;
    },
    disable() {
      const d = document;
      if (this.isEnabled()) {
        if (d.exitFullscreen) d.exitFullscreen();
        else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
        else if (d.mozCancelFullScreen) d.mozCancelFullScreen();
        else if (d.msExitFullscreen) d.msExitFullscreen();
      }
    },
    fsChanged(pfx, e) {
      var d = document;
      var ev = (pfx || '') + 'fullscreenchange';
      if (!this.isEnabled()) {
        this.stop(null, this.sender);
        document.removeEventListener(ev, this.fsChanged);
      }
    },
    run(editor, sender, opts = {}) {
      this.sender = sender;
      const { target } = opts;
      const targetEl = document.querySelector('.editor-wrapper');
      const pfx = this.enable(targetEl || editor.getContainer());
      this.fsChanged = this.fsChanged.bind(this, pfx);
      document.addEventListener(pfx + 'fullscreenchange', this.fsChanged);
      editor.trigger('change:canvasOffset');
    },
    stop(editor, sender) {
      if (sender && sender.set) sender.set('active', false);
      this.disable();
      if (editor) editor.trigger('change:canvasOffset');
    }
  });

  editor.Commands.add('set-close',{
    run(editor){
      var fullscreenCommand = editor.Commands.get('set-fullscreen');
      if( fullscreenCommand.isEnabled() ) fullscreenCommand.stop();
      CURRENT_FIELD.querySelector( wrapperClass ).style.display = 'none';
      editor.store();
    }
  });

});