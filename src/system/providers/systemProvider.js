defineProvider('system.providers', (cl) => {
  cl.SystemProvider = class {
    register({ service, namespace, routes }) {
      service.Route = () => {
        return new namespace.system.Route(routes);
      };
      service.Load = () => {
        return new namespace.system.Load(routes);
      };

      service.Element = () => new namespace.system.Element();

      service.Frame = () => {
        return new namespace.system.Frame();
      };
    }
    boot() {}
  };
});
