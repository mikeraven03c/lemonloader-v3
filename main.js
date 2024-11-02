const loader = new LoaderV3();

const registerScript = loader.registerScript;
registerScript.setup((action) => {
  action.add('src/system/development.js');
  action.add('src/modules/quasar/quasar.js');
});

const { defineClass } = loader.registerClass;

loader.event.autoload();
