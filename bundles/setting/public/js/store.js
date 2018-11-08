
// require dependencies
const store  = require ('default/public/js/store');
const Events = require ('events');
const socket = require ('socket/public/js/bootstrap');

/**
 * create form store
 */
class SettingStore extends Events {
  /**
   * construct riot store
   */
  constructor () {
    // set observable
    super(...arguments);

    // set values
    (store.get('settings') || []).forEach((setting) => {
      // set name and value
      this[setting.name] = setting.value;
    });

    // bind methods
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);

    // bind private methods
    this._setting = this._setting.bind(this);

    // listen to socket for setting
    socket.on('setting', this._setting);
  }

  /**
   * gets setting value
   *
   * @param  {String} name
   *
   * @return {*}
   */
  get (name) {
    // return value
    return this[name];
  }

  /**
   * sets setting value
   *
   * @param  {String} name
   * @param  {*} value
   */
  set (name, value) {
    // get value
    let old = this[name];

    // set setting
    this[name] = value;

    // trigger update
    if (old !== value) {
      // trigger update
      this.emit('update');

      // emit setting
      socket.emit('setting', {
        'name'  : name,
        'value' : value
      });
    }
  }

  /**
   * on socket setting change
   *
   * @param {Object} setting
   *
   * @private
   */
  _setting (setting) {
    // get value
    let old = this[setting.name];

    // set setting
    this[setting.name] = setting.value;

    // update if different
    if (old !== setting.value) this.emit('update');
  }
}

/**
 * export built settings store
 *
 * @type {SettingStore}
 */
exports = module.exports = new SettingStore();
