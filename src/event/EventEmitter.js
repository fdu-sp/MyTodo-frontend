import _ from 'lodash';

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    // 将监听器和它的引用存储在数组中
    this.events[event].push({listener});
    return this; // 返回EventEmitter实例，以便链式调用
  }

  /**
   * @description 为指定事件防抖的监听器
   * */
  onWithDebounce(event, listener, delay) {
    const debouncedListener = _.debounce(listener, delay);
    // 存储原始监听器和防抖后的监听器
    this.events[event] = this.events[event] || [];
    this.events[event].push({listener: debouncedListener, original: listener});
    return this;
  }

  /**
   * @description 为指定事件节流的监听器
   */
  onWithThrottle(event, listener, delay) {
    const throttledListener = _.throttle(listener, delay);
    // 存储原始监听器和节流后的监听器
    this.events[event] = this.events[event] || [];
    this.events[event].push({listener: throttledListener, original: listener});
    return this;
  }

  off(event, listener) {
    if (!this.events[event]) {
      return this;
    }
    this.events[event] = this.events[event].filter(
      ({listener: eventListener, original}) => eventListener !== listener && original !== listener
    );
    return this;
  }

  /**
   * @description 移除指定事件的防抖监听器
   */
  offWithDebounce(event, listener) {
    return this.off(event, listener);
  }

  /**
   * @description 移除指定事件的节流监听器
   */
  offWithThrottle(event, listener) {
    return this.off(event, listener);
  }

  emit(event, ...args) {
    const listeners = this.events[event];
    if (listeners) {
      listeners.forEach(({listener}) => listener(...args));
    }
  }
}

export default EventEmitter;
