import EventEmitter from "src/event/EventEmitter";

const API_ERROR_EVENTS = Object.freeze({
  UN_AUTH: Symbol("un_authorized"),
  VALIDATE_ERROR: Symbol("validate_error"),
  INTERNAL_ERROR: Symbol("internal_error"),
  NETWORK_ERROR: Symbol("network_error"),
  // 其他错误
  OTHER_ERROR: Symbol("other_error"),
});

class ApiErrorEventEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

export {API_ERROR_EVENTS};
export default new ApiErrorEventEmitter();
