
// create mixin
riot.mixin('settings', {
  /**
   * on init function
   */
  'init' : function () {
    // set value
    this.settings = {};

    // set values
    (this.eden.get('settings') || []).forEach((setting) => {
      // set name and value
      this.settings[setting.name] = setting.value;
    });

    // on mount update
    if (typeof window === 'undefined') return;

    // set this store
    this.settings = require('settings/public/js/store');

    // on form change
    this.settings.on('update', this.update);
  }
});
