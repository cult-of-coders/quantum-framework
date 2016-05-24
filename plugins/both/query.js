/**
 * Basic Usage:
 * Q('query app_userProfile', {
 *      'user': {
 *          $filter({filters, options, metaFilters, metaOptions, params}) {
 *
 *          }
 *          profile: 1,
 *          avatar: 1,
 *          comments: {
 *              text: 1,
 *              files: {$mixin: 'file'} // Q('query-mixin file', { path: 1 })
 *          }
 *      }
 * });
 *
 * let query = Q('query app_userProfile').create({
 *      params: {
 *          'userId': '12345' // or a ReactiveVar()
 *      }
 * });
 *
 * query.for('user').find().fetch();
 *
 * @type {$ES6_ANONYMOUS_CLASS$}
 */
let plugin = class extends Quantum.Model.Plugin {
    build(atom) {

    }
};