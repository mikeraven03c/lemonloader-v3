defineClass('system', (cl) => {
  cl.Development = class Development {
    test(test = 'development') {
      console.log('test ' + test);
    }
  };
  cl.Dev = class {
    constructor(development) {
      /** @type {Development} */
      this.development = development;
    }
    test() {
      this.development.test('devi');
      console.log('test dev');
    }
  };
});
