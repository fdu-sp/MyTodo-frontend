import EventEmitter from "src/event/EventEmitter";

const TASK_EVENTS = Object.freeze({
  TASK_CREATED: Symbol("task_created"),
  TASK_UPDATED: Symbol('task_updated'),
});

class TaskEventEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

export {TASK_EVENTS};
export default new TaskEventEmitter();
