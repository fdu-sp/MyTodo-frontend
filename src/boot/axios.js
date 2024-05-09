import {boot} from 'quasar/wrappers'
import axios from 'axios'
import {LoadingBar, Notify} from 'quasar'

const api = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 20000, // 超时设置为20秒
  headers: {
    'Content-Type': 'application/json',
  },
})

// request拦截器
api.interceptors.request.use(
  config => {
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
  },
  error => {
    console.error(error);
    Promise.reject(error).then(r => console.error(r));
  }
);

// 响应拦截器
api.interceptors.response.use(
  res => {
    LoadingBar.stop();
    // 未设置状态码则默认 服务器内部错误
    const code = res.data.code || 500;
    // 获取错误信息
    const msg = res.data.msg;
    if (code === 401) {
      // 未授权
      Notify.create({
        message: '您需要登录以访问这个页面。',
        type: 'warning',
        position: 'top',
        timeout: 3000,
        actions: [{label: '前往登录', color: 'white', handler: () => router.push('/login')}]
      });
    } else if (code === 500) {
      // 服务器内部错误
      if (!res.config.silent) {
        Notify.create({
          message: msg,
          type: 'warning',
          position: 'top',
          timeout: 3000,
        });
      }
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      // 请求失败
      if (!res.config.silent) {
        Notify.create({
          message: msg,
          type: 'warning',
          position: 'top',
          timeout: 3000,
        });
      }
      return Promise.reject(new Error(msg));
    } else {
      // code = 200 时
      if (res.data.uxApi) {
        if (res.data.success) { // 业务成功
          return res.data;
        } else { // 业务失败
          if (!res.config.silent) {
            Notify.create({
              message: msg,
              type: 'warning',
              position: 'top',
              timeout: 3000,
            });
          }
          console.error(res);
          return Promise.reject(res);
        }
      } else {
        return res.data;
      }
    }
  },
  error => {
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
    if (!error.config.silent) {
      Notify.create({
        message: message,
        type: 'negative',
        position: 'top',
        timeout: 3000,
      });
    }
    return Promise.reject(error);
  }
);

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
