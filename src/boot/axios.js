import {boot} from 'quasar/wrappers'
import axios from 'axios'
import {requestFulfilled, requestRejected, responseFulfilled, responseRejected} from "src/api/common/interceptor";
import apiEventEmitter, {API_EVENTS} from "src/event/ApiEventEmitter";
import {Notify} from "quasar";

const api = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 20000, // 超时设置为20秒
  headers: {
    'Content-Type': 'application/json',
  },
})

// request拦截器
api.interceptors.request.use(
  requestFulfilled, requestRejected
);

// 响应拦截器
api.interceptors.response.use(
  responseFulfilled, responseRejected
);

// 请求错误的全局事件处理器
// 在这里处理，可以只注册一遍
apiEventEmitter.on(API_EVENTS.INTERNAL_ERROR, (msg, silent) => {
  console.error("请求错误的全局事件处理器，INTERNAL_ERROR：", msg);
  const shouldSilent = silent || false;
  if (!shouldSilent) {
    Notify.create({
      message: msg,
      type: 'warning',
      position: 'top',
      timeout: 3000,
    });
  }
});
apiEventEmitter.on(API_EVENTS.OTHER_ERROR, (msg, silent) => {
  console.warn("请求错误的全局事件处理器，OTHER_ERROR：", msg);
  const shouldSilent = silent || false;
  if (!shouldSilent) {
    Notify.create({
      message: msg,
      type: 'warning',
      position: 'top',
      timeout: 3000,
    });
  }
});
apiEventEmitter.on(API_EVENTS.NETWORK_ERROR, (msg, silent) => {
  console.error("请求错误的全局事件处理器，NETWORK_ERROR：", msg);
  const shouldSilent = silent || false;
  if (!shouldSilent) {
    Notify.create({
      message: msg,
      type: 'negative',
      position: 'top',
      timeout: 3000,
    });
  }
});

export default boot(({app}) => {
  // 通过this.$axios和this.$API在Vue文件（Options API）内使用

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ 这将允许你使用this.$axios（Vue Options API形式）
  //       所以你不需要在每个vue文件中导入axios

  app.config.globalProperties.$api = api
  // ^ ^ ^ 这将允许您使用this.$api（Vue Options API形式）
  //       这样您就可以轻松地根据应用程序的api执行请求
})

export {axios, api}
