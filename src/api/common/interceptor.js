import {LoadingBar} from "quasar";
import apiEmitter, {API_ERROR_EVENTS} from "src/event/ApiErrorEventEmitter";

export function requestFulfilled(config) {
  LoadingBar.start();
  // get请求映射params参数
  if (config.method === "get" && config.params) {
    let url = config.url + "?";
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      const part = encodeURIComponent(propName) + "=";
      if (value !== null && typeof value !== "undefined") {
        if (typeof value === "object") {
          for (const key of Object.keys(value)) {
            let params = propName + "[" + key + "]";
            const subPart = encodeURIComponent(params) + "=";
            url += subPart + encodeURIComponent(value[key]) + "&";
          }
        } else {
          url += part + encodeURIComponent(value) + "&";
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  return config;
}

export function requestRejected(error) {
  console.error(error);
  Promise.reject(error).then(r => console.error(r));
}

// 如果没有设置silent属性，则显示错误提示
export function responseFulfilled(res) {
  LoadingBar.stop();
  // 未设置状态码则默认 服务器内部错误
  const code = res.data.code || 500;
  const silent = res.config.silent || false;
  // 获取错误信息
  const msg = res.data.msg;
  if (code === 401) {
    apiEmitter.emit(API_ERROR_EVENTS.UN_AUTH, msg);
    return Promise.reject(new Error(msg));
  } else if (code === 500) {
    // 服务器内部错误
    apiEmitter.emit(API_ERROR_EVENTS.INTERNAL_ERROR, msg, silent);
    return Promise.reject(new Error(msg));
  } else if (code !== 200) {
    // 请求失败 但未区分状态码
    apiEmitter.emit(API_ERROR_EVENTS.OTHER_ERROR, msg, silent);
    return Promise.reject(new Error(msg));
  } else {
    // code = 200 时
    if (res.data.uxApi) {
      if (res.data.success) { // 业务成功
        return res.data;
      } else { // 业务失败
        apiEmitter.emit(API_ERROR_EVENTS.OTHER_ERROR, msg, silent);
        return Promise.reject(res);
      }
    } else { // 非 uxApi，直接返回res
      return res;
    }
  }
}

export function responseRejected(error) {
  LoadingBar.stop();
  console.error("err: " + error);
  let {message} = error;
  if (message.includes("Network Error")) {
    message = "服务器连接异常";
  } else if (message.includes("timeout")) {
    message = "请求超时";
  } else if (message.includes("Request failed with status code")) {
    message = "请求异常";
  }
  apiEmitter.emit(API_ERROR_EVENTS.NETWORK_ERROR, message, error.config.silent);
  return Promise.reject(error);
}
