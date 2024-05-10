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
  // TODO 改为使用真实请求
  // 模拟提醒信息
  return new Promise((resolve, reject) => {
    const now = new Date();
    const two_seconds_later = new Date(now);
    const three_seconds_later = new Date(now);
    const four_seconds_later = new Date(now);
    two_seconds_later.setSeconds(now.getSeconds() + 2);
    three_seconds_later.setSeconds(now.getSeconds() + 3);
    four_seconds_later.setSeconds(now.getSeconds() + 4);
    resolve({
      code: 200,
      message: 'success',
      object: [
        {
          taskId: 1,
          reminderTimestamp: two_seconds_later.toISOString(),
        },
        {
          taskId: 2,
          reminderTimestamp: two_seconds_later.toISOString(),
        },
        {
          taskId: 3,
          reminderTimestamp: three_seconds_later.toISOString(),
        },
        {
          taskId: 5,
          reminderTimestamp: later.toISOString(),
        },
      ]
    });
  });
}