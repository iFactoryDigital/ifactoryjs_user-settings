// Require dependencies
const Model = require('model');

/**
 * Create landlord model
 */
class Setting extends Model {
  /**
   * construct landlord model
   *
   * @param attrs
   * @param options
   */
  constructor () {
    // run super
    super(...arguments);

  }

  /**
   * sanitises settings
   *
   * @return array
   */
  async sanitise () {
    // return
    return {
      'id'    : this.get('_id').toString(),
      'name'  : this.get('name'),
      'value' : this.get('value')
    };
  }
}

/**
 * Export setting model
 *
 * @type {setting}
 */
module.exports = Setting;
