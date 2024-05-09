import {api} from 'boot/axios';

// /api/reminder/get-all
// 获取所有提醒信息
export function getAllReminders() {
  return api.get('/reminder/get-all');
}

// /api/reminder/get-recent/{hour}
// const resp = [{
//   taskId: 1,
//   reminderTimestamp: "2021-08-01T00:00:00",
// }]
/**
 * @description 获取最近一段时间的提醒信息
 * @param {number} hour 小时数
 * */
export function getRecentReminders(hour) {
  // return api.get(`/reminder/get-recent/${hour}`);
  return new Promise((resolve, reject) => {
    const now = new Date();
    now.setSeconds(now.getSeconds() + 2);
    resolve({
      code: 200,
      message: 'success',
      object: [
        {
          "taskId": 1,
          "reminderTimestamp": now.toISOString(),
        },
      ]
    });
  });
}
