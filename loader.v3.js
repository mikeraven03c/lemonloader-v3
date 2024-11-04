/**
 * @typedef {object} ExportsDef
 * @property {object} classes
 * @property {object} namespace
 * @property {object} service
 * @property {object} app
 * @property {object} routes
 * @property {object} search
 * @property {string} search.app
 * @property {string} search.route
 */
class LoaderV3 {
  registerScript;
  registerClass;
  registerProvider;

  exports = {
    namespace: {},
    classes: {},
    service: {},
    app: {},
    routes: {},
    search: {
      app: undefined,
      route: undefined,
    },
  };

  event = {
    autoload: () => {
      this.registerScript.loadScripts();
    },
    boot: () => {
      this.registerProvider.instanceService();
      this.registerProvider.onRegister();

      this.registerProvider.onBoot();
    },
    dispatch: () => {
      this.router.onDispatch();
    },
  };

  constructor() {
    const config = __loaderConfiguration(this.exports);
    this.registerScript = new config.RegisterSript();
    this.registerClass = new config.RegisterClass();
    this.registerProvider = new config.RegisterServiceProvider();
    this.router = new config.Router();

    const searchParams = new URLSearchParams(window.location.search);
    this.exports.search.app = searchParams.get('app');
    this.exports.search.route = searchParams.get('route');
  }

  /**
   *
   * @param {string} eventName
   * @param {function} callback
   * @deprecated
   */
  addEvent(eventName, callback) {
    this.lifecycle[eventName].push(callback);
  }

  /**
   *
   * @param {string} eventName
   * @deprecated
   */
  triggerEvent(eventName) {
    this.lifecycle[eventName].forEach((e) => e());
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
    /** @type {string} */ filename;

    /** @type {Boolean} */ isRegister;

    constructor(src, isRegister = true) {
      this.src = src;
      this.filename = src.split('/').pop().split('.')[0];
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
        const searchApp = exports.search.app;
        if (
          e.isRegister ||
          (searchApp != undefined && searchApp == e.filename)
        ) {
          const script = this.createScript(e.src);
          this.append(script);
        }
      });
    }

    /**
     *
     * @param {function(RegisterSript) : void} actions
     */
    setup(actions) {
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
        }, exports.namespace);
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
    /** @type {String} */ fullPath;
    /** @type {String} */ namespace;
    /** @type {String} */ className;
    /** @type {ObjectConstructor} */ classObj;
    /**
     *
     * @param {string} namespace
     * @param {string} className
     * @param {ObjectConstructor} classVal
     * @returns
     */
    static from(namespace, className, classObj) {
      const providerData = new ProviderData();
      providerData.fullPath = namespace.concat(`.${className}`);
      providerData.classObj = classObj;
      providerData.className = className;
      providerData.namespace = namespace;
      return providerData;
    }
  }

  class RegisterServiceProvider {
    /** @type {ProviderData[]} */
    providers = [];

    /** @type {ObjectConstructor} */
    registeredProvider = [];

    /** @type {string[]} */
    providerList = [];

    constructor() {
      /**
       *
       * @param {string} namespace
       * @param {function(object): void} classesFn
       */
      this.defineProvider = (namespace, classesFn) => {
        const providerClasses = this.#getProvider(classesFn);

        providerClasses.forEach((e) => {
          const [className, classVal] = e;

          this.providers.push(
            ProviderData.from(namespace, className, classVal)
          );
        });
      };
    }

    /**
     * @param {function(obj)} action
     * @returns {Array<[string, Object]>}
     */
    #getProvider(action) {
      /** @type {object.<string, function>} */
      const classObj = {};

      action(classObj);

      return Object.entries(classObj);
    }

    /**
     *
     * @param {string[]} providerList
     */
    register(providerList) {
      this.providerList = this.providerList.concat(providerList);
    }

    /**
     *
     * @param {function(RegisterServiceProvider) : void} action
     */
    setup(action) {
      action(this);

      return this;
    }

    instanceService() {
      const hasList = this.providerList.length > 0;

      if (!hasList) {
        this.providers.forEach((e) => {
          if (this.providerList.includes(e.fullPath)) {
            this.registeredProvider.push(new e.classObj());
          }
        });
      } else {
        this.providerList.forEach((e) => {
          const provider = this.providers.find(
            (provider) => provider.fullPath == e
          );

          if (provider) {
            this.registeredProvider.push(new provider.classObj());
          }
        });
      }
    }

    onRegister() {
      this.registeredProvider.forEach((e) => {
        if ('register' in e) {
          e.register(exports);
        }
      });
    }

    onBoot() {
      this.registeredProvider.forEach((e) => {
        if ('boot' in e) {
          e.boot(exports);
        }
      });
    }
  }

  class Router {
    onDispatch() {
      const route = exports.search.route;

      if (route != undefined) {
        if (route in exports.routes) {
          const { namespace, fn } = exports.routes[route];
          this.instanceClass(namespace, fn);
        } else {
          throw Error('Can not found routes');
        }
      }
    }

    /**
     *
     * @param {string} namespace
     * @returns
     */
    getClassFromNamespace(namespace) {
      const classObj = namespace.split('.').reduce((previous, current) => {
        return previous[current];
      }, exports.namespace);

      return classObj;
    }

    /**
     *
     * @param {string} namespace
     * @param {string} fn
     * @returns {ObjectConstructor}
     */
    instanceClass(namespace, fn) {
      const classObj = this.getClassFromNamespace(namespace);
      const instance = new classObj();
      instance[fn](exports);
      return instance;
    }
  }

  //   var r = { a:1, b: {b1:11, b2: 99}};
  // var s = "b.b2";

  // var value = s.split('.').reduce((a, b) => a[b], r);

  return {
    RegisterSript,
    RegisterClass,
    RegisterServiceProvider,
    Router,
  };
}
