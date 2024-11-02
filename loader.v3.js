/**
 * @typedef {object} ExportsDef
 * @property {object} classes
 * @property {object} service
 */
class LoaderV3 {
  registerScript;
  RegisterClass;
  /** @type {object.<String, Function[]>} */
  lifecycle = {
    autoload: [],
  };

  constant = {
    AUTOLOAD: 'autoload',
  };

  exports = {
    classes: {},
    service: {},
  };

  event = {
    autoload: () => {
      this.triggerEvent('autoload');
    },
  };

  constructor() {
    const config = __loaderConfiguration(this.exports);
    this.registerScript = new config.RegisterSript();
    this.registerClass = new config.RegisterClass();

    this.setup();
  }

  /**
   *
   * @param {string} eventName
   * @param {function} callback
   */
  addEvent(eventName, callback) {
    this.lifecycle[eventName].push(callback);
  }

  /**
   *
   * @param {string} eventName
   */
  triggerEvent(eventName) {
    this.lifecycle[eventName].forEach((e) => e());
  }

  setup() {
    this.addEvent(this.constant.AUTOLOAD, () => {
      this.registerScript.loadScripts();
    });
  }
}

/**
 *
 * @param {ExportsDef} exports
 * @returns
 */
function __loaderConfiguration(exports) {
  const element = {
    script: () => document.createElement('script'),
  };

  class ScriptData {
    /** @type {string} */ src;

    /** @type {Boolean} */ isRegister;

    constructor(src, isRegister = true) {
      this.src = src;
      this.isRegister = isRegister;
    }
  }

  class RegisterSript {
    /** @type {ScriptData[]} */
    scripts = [];
    /**
     *
     * @param {string} src
     * @returns {HTMLScriptElement}
     */
    createScript(src) {
      const script = element.script();
      script.src = src;

      return script;
    }

    /**
     * @param {HTMLScriptElement} script
     */
    append(script) {
      document.body.append(script);
    }

    /**
     *
     * @param {String} src
     * @param {Boolean} isRegister
     * @returns {RegisterSript}
     */
    add(src, isRegister) {
      this.scripts.push(new ScriptData(src, isRegister));
      return this;
    }

    loadScripts() {
      this.scripts.forEach((e) => {
        if (!e.isRegister) {
          return;
        }
        const script = this.createScript(e.src);
        this.append(script);
      });
    }

    /**
     *
     * @param {function(RegisterSript) : void} actions
     */
    setup(actions) {
      console.log(this);
      actions(this);
    }
  }

  class RegisterClass {
    classes = [];
    constructor() {
      /**
       *
       * @param {string} namespace
       * @param {function(object): void} classesFn
       */
      this.defineClass = (namespace, classesFn) => {
        const namespaceArr = namespace.split('.');
        const lastIndex = namespaceArr.length - 1;

        const classes = this.getClasses(classesFn);

        namespaceArr.reduce((classObj, current, index) => {
          if (typeof classObj[current] == 'undefined') {
            classObj[current] = {};
          }

          if (lastIndex == index) {
            classes.forEach((e) => {
              const [className, classVal] = e;
              classObj[current][className] = classVal;
            });
          }

          return classObj[current];
        }, exports.classes);
      };
    }

    /**
     * @param {function(obj)} action
     * @returns {Array<[string, Object]>}
     */
    getClasses(action) {
      /** @type {object.<string, function>} */
      const classObj = {};

      action(classObj);

      return Object.entries(classObj);
    }
  }

  class ProviderData {
    /** @type {String} */ name;
    /** @type {ObjectConstructor} */ classObj;
  }

  class RegisterServiceProvider {
    /** @type {ProviderData[]} */
    providers = [];

    /** @type {ObjectConstructor} */
    registeredProvider = [];

    constructor() {
      this.defineProvider = (name, classObj) => {
        const providerData = new ProviderData();
        providerData.name = name;
        providerData.classObj = classObj;
        this.providers.push(providerData);
      };
    }

    setup() {
      this.providers.forEach((e) => {
        this.registeredProvider.push(new e.classObj());
      });
    }

    register() {
      this.registeredProvider.forEach((e) => {
        if ('register' in e) {
          e.register();
        }
      });
    }

    boot() {
      this.registeredProvider.forEach((e) => {
        if ('boot' in e) {
          e.boot();
        }
      });
    }
  }

  //   var r = { a:1, b: {b1:11, b2: 99}};
  // var s = "b.b2";

  // var value = s.split('.').reduce((a, b) => a[b], r);

  return {
    RegisterSript,
    RegisterClass,
    RegisterServiceProvider,
  };
}
