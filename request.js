function createRequest(key) {
  class RequestData {
    constructor(key, event, data) {
      this.key = key;
      this.event = event;
      this.data = data;
    }

    static fromEvent(data) {
      return new RequestData(data.key, data.event, data.data);
    }
  }

  function request(event, data) {
    return new Promise((resolve, reject) => {
      /** @type {MessageEvent} */
      const listener = (event) => {
        const result = RequestData.fromEvent(event.data);
        resolve(result.data);
        return;
      };
      window.addEventListener('message', listener, { once: true });
      parent.window.postMessage(new RequestData(key, event, data), '*');

      setTimeout(() => {
        reject('Timeout error');
      }, 5000);
    });
  }
  return { request };
}
