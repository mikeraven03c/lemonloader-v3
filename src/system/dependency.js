/** @typedef {import('./element.js').ElementDef} ElementDef */
/**
 * @typedef {object} DependencyDef
 * @property {Function} importScript
 */
defineClass('system', (cl) => {
  cl.Load = class Load {
    /**
     *
     * @param {ElementDef} element
     */
    constructor() {
      this.script = this.importScript;
    }

    /**
     *
     * @param {string} src
     * @returns {Promise<HTMLScriptElement>}
     */
    importScript(src) {
      return new Promise((res) => {
        const script = document.createElement('script');
        script.src = src;

        script.onload = () => res(script);
        document.body.append(script);
      });
    }
  };
});
