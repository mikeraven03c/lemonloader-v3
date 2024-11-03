defineClass('system', (cl) => {
  cl.Frame = class Frame {
    /** @type {string} */ key;
    /** @type {string} */ src;
    /** @type {HTMLIFrameElement} */ frame;
    /** @type {HTMLIFrameElement} */ routes;
    /** @type {RouteFrame} */ routeFrame;
    constructor() {
      this.eventHandle = this.frameEvent.bind(this);
    }

    createFrame(src, config = {}) {
      const { height = '100%', width = '100%' } = config;
      const frame = document.createElement('iframe');
      frame.src = src;
      frame.style.height = height;
      frame.style.width = width;
      frame.style.border = 'none';
      frame.style.margin = '0';
      // frame.style.display = 'none';
      frame.id = this.key;

      return frame;
    }

    /** @param {MessageEvent} event */
    frameEvent(event) {
      if ('key' in event.data) {
        const frameEvent = new FrameEvent(this.key, this.routeFrame);
        frameEvent.listen(event, (response) => {
          const eventData = new EventData();
          eventData.data = response;

          this.frame.contentWindow.postMessage(eventData, '*');
        });
      }
    }

    onEvent(loadEvent = true) {
      window.addEventListener('message', this.eventHandle);
    }

    offEvent() {
      window.removeEventListener('message', this.eventHandle);
    }

    mountFrame() {
      return new Promise((res) => {
        document.body.prepend(this.frame);
        this.frame.onload = () => res();
      });
    }

    unmountFrame() {
      document.body.removeChild(this.frame);
    }

    /**
     *
     * @param {{ key: string, src: string, config: object, route: function(RouteFrame) }} config
     */
    async setup(config) {
      const { key, src, config: frameConfig, route } = config;
      this.key = key;
      this.src = src;
      this.frame = this.createFrame(src, frameConfig);
      this.routeFrame = new RouteFrame();

      if (typeof route == 'function') {
        route(this.routeFrame);
      }
      await this.mounted();
    }

    async mounted() {
      this.onEvent();
      await this.mountFrame();
    }

    async unmounted() {
      this.offEvent();
      this.unmountFrame();
    }
  };

  class EventData {
    event;
    key;
    data;

    /**
     *
     * @param {{ event: string, key: string, data: any }} data
     */
    static fromEvent(data) {
      const eventData = new EventData();
      eventData.event = data.event;
      eventData.key = data.key;
      eventData.data = data.data;
      return eventData;
    }
  }

  class FrameEvent {
    events = [];
    constructor(key, routeFrame) {
      this.key = key;

      /** @type {RouteFrame} */
      this.routeFrame = routeFrame;
    }

    /**
     *
     * @param {MessageEvent} event
     */
    listen(event, responseCallback) {
      const { data } = event;

      if (this.validEvent(data)) {
        const eventData = EventData.fromEvent(data);

        const routeFrameData = this.routeFrame.get(eventData.event);

        const response = routeFrameData.callback(eventData.data);

        if (responseCallback != undefined && routeFrameData.response) {
          responseCallback(response);
        }

        return true;
      }

      return false;
    }

    /**
     *
     * @param {object} data
     */
    validEvent(data) {
      if (
        'key' in data &&
        'event' in data &&
        'data' in data &&
        this.key == data.key
      ) {
        return true;
      }

      return false;
    }
  }

  class RouteFrameData {
    route;
    callback;
    /** @type {boolean} */
    response;
  }

  class RouteFrame {
    /** @type {RouteFrameData[]} */
    routes = [];
    route(route, callback) {
      const routeFrameData = new RouteFrameData();
      routeFrameData.route = route;
      routeFrameData.callback = callback;
      routeFrameData.response = true;
      this.routes.push(routeFrameData);
    }

    get(route) {
      const routeFrame = this.routes.find((e) => e.route == route);

      if (routeFrame == undefined) {
        throw Error('Route does not exist for ' + route);
      }

      return routeFrame;
    }
  }
});
