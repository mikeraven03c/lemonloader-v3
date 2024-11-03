/**
 * @typedef {object} ElementDef
 * @property {createScript} createScript
 */

/**
 * @callback createScript
 * @returns  {HTMLScriptElement}
 */
defineClass('system', (cl) => {
  cl.Element = class Element {
    create(e) {
      return document.createElement(e);
    }

    createScript() {
      return this.create('script');
    }

    createFrame(src, config = {}) {
      const frame = document.createElement('iframe');
      frame.src = src;

      return frame;
    }
  };
});
