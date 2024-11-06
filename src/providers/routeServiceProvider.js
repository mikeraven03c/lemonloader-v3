/**
 * @typedef {import('../system/route.js').RouteClassDef} RouteClassDef
 */
defineProvider('providers', (cl) => {
  cl.RouteServiceProvider = class {
    boot({ service }) {
      /** @type {RouteClassDef} */
      const route = service.Route();
      route.define('quasar', ['modules.quasar.Quasar', 'setup']);
      route.define('react', ['modules.react.ModuleReact', 'main']);
    }
  };
});
