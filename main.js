const loader = new LoaderV3();

const registerScript = loader.registerScript;
registerScript.setup((action) => {
  // System Script
  action.add('src/system/route.js');
  action.add('src/system/dependency.js');
  action.add('src/system/element.js');
  action.add('src/system/frame.js');

  // System Provider Script
  action.add('src/system/providers/systemProvider.js');

  // App
  action.add('src/providers/routeServiceProvider.js');

  // Module
  action.add('src/modules/quasar/quasar.js', false);
});

const { defineClass } = loader.registerClass;
const { defineProvider } = loader.registerProvider.setup((action) => {
  action.register([
    'system.providers.SystemProvider',
    'providers.RouteServiceProvider',
  ]);
});

loader.event.autoload();
window.onload = () => {
  loader.event.boot();
  loader.event.dispatch();
  console.log(loader.exports);
};
