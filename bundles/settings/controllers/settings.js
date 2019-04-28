
// Require dependencies
const config     = require('config');
const socket     = require('socket');
const Controller = require('controller');

// require local dependencies
const Setting = model('setting');

/**
 * Create settings controller
 */
class SettingsController extends Controller {
  /**
   * construct user controller
   */
  constructor() {
    // Run super
    super();

    // bind methods
    this.build = this.build.bind(this);
    this.settingAction = this.settingAction.bind(this);

    // Run
    this.build();
  }

  /**
   * build settings controller
   *
   * @param {router} router
   */
  build() {
    // on render
    this.eden.pre('view.render', async (data) => {
      // set render values
      const user    = data.req.user;
      const session = data.req.sessionID;

      // set settings
      data.render.settings = (await Setting.or({
        session,
      }, {
        'user.id' : user ? user.get('_id').toString() : 'false',
      }).find()).map((setting) => {
        // return Object
        return {
          name  : setting.get('name'),
          value : setting.get('value'),
        };
      });
    });
  }

  /**
   * sets setting event
   *
   * @param {String} name
   * @param {*} value
   *
   * @call setting.set
   */
  async settingAction(name, value, opts) {
    // emit setting
    socket[opts.user ? 'user' : 'session'](opts.user || opts.sessionID, 'setting', data);

    // check setting exists
    const setting = await Setting.or({
      session : opts.sessionID,
    }, {
      'user.id' : opts.user ? opts.user.get('_id').toString() : 'false',
    }).where({
      name : data.name,
    }).findOne() || new setting({
      name : data.name,
    });

    // check session/user
    setting.set('user', opts.user);
    setting.set('session', opts.sessionID);

    // set setting
    setting.set('value', data.value);

    // save setting
    await setting.save();
  }
}

/**
 * eport settings controller
 *
 * @type {SettingsController}
 */
module.exports = SettingsController;
