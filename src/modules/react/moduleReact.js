defineClass('modules.react', (cl) => {
  cl.ModuleReact = class {
    async main({ service }) {
      const frame = service.Frame();

      await frame.setup({
        key: 'react',
        src: './view/modules/react/react.view.html',
        route: (action) => {
          action.route('init', (data) => {
            return 'test';
          });
        },
      });
    }
  };
});
