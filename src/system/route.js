/**
 * @typedef {import('../../loader.v3.js').ExportsDef} ExportsDef
 */

/**
 * @typedef {object} RouteClassDef
 * @property {DefineCallback} define
 */

/**
 * @callback DefineCallback
 * @param {string} route
 * @param {(Array | String)} definition
 */
defineClass('system', (cl) => {
  class RouteData {
    /** @type {string} */ namespace;
    /** @type {string} */ fn;
  }

  cl.Route = class Route {
    /** @param {ExportsDef} exports */
    constructor(routes) {
      this.routes = routes;
    }

    /** @type {DefineCallback} */
    define(route, definition) {
      const routeData = new RouteData();
      if (Array.isArray(definition) && definition.length == 2) {
        routeData.namespace = definition[0];
        routeData.fn = definition[1];
      } else if (typeof definition == 'string') {
        routeData.namespace = definition;
        routeData.fn = 'main';
      }
      this.routes[route] = routeData;
    }

    //   var r = { a:1, b: {b1:11, b2: 99}};
    // var s = "b.b2";

    // var value = s.split('.').reduce((a, b) => a[b], r);
  };
});
