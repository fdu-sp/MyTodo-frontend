import EventEmitter from "src/event/EventEmitter";

const TASK_EVENTS = Object.freeze({
  // 参数：taskDetailResp
  TASK_CREATED: Symbol("task_created"),
  // 参数：taskDetailResp
  TASK_UPDATED: Symbol('task_updated'),
  // 参数：null
  TASK_DELETED: Symbol('task_deleted'),
  // 参数：taskId
  TASK_ADDED_TO_TODAY: Symbol('task_added_to_today'),
});

class TaskEventEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

export {TASK_EVENTS};
export default new TaskEventEmitter();
