/**
 * Simple EventEmitter for socket connect/disconnect (browser).
 */

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }

  off(event, listener) {
    if (!this.events[event]) return;
    if (listener) {
      this.events[event] = this.events[event].filter((l) => l !== listener);
    } else {
      delete this.events[event];
    }
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => {
      try {
        listener(...args);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }
}

export const Event = new EventEmitter();
