defineClass('modules.quasar', (cl) => {
  cl.Quasar = class Quasar {
    async setup({ service }) {
      const load = service.Load();
      const { script } = load;

      await script('./src/modules/quasar/quasar.external.js');

      const frame = service.Frame();

      await frame.setup({
        key: 'quasar',
        src: './view/modules/quasar/quasar.view.html',
        route: (action) => {
          action.route('init', (data) => {
            return {
              message: 'hello from the other side',
            };
          });
        },
      });
    }
  };
});
