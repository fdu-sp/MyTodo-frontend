import {getRecentReminders} from "src/api/reminder";
import {getSimpleTaskInfo} from "src/api/task";
import {Notify} from "quasar";
import {gotoTaskDetailPage} from "src/router/routes";

const RECENT_HOUR = 1;

/**
 * @description 初始化提醒器
 * */
function reminderInit() {
  getRecentReminders(RECENT_HOUR).then(data => {
    const reminderRespList = data.object;
    // 遍历提醒信息，设置定时器
    reminderRespList.forEach(reminderResp => {
      addLocalReminder(reminderResp.taskId, reminderResp.reminderTimestamp)
    });
    // 设置 RECENT_HOUR 小时后再次获取提醒信息
    setTimeout(() => {
      reminderInit();
    }, RECENT_HOUR * 60 * 60 * 1000);
  }).catch(err => {
    console.error(err);
  })
}

// TODO 如果用户新增了一个提醒，需要调用该函数
/**
 * @description 添加本地提醒
 * @param {number} taskId 任务ID
 * @param {string} reminderTimestamp 提醒时间戳
 * */
function addLocalReminder(taskId, reminderTimestamp) {
  const reminderTime = new Date(reminderTimestamp);
  const now = new Date();
  const diff = reminderTime - now;
  if (diff > 0) {
    setTimeout(() => {
      getSimpleTaskInfo(taskId).then(data => {
        const taskSimpleResp = data.object;
        console.log(taskSimpleResp);
        Notify.create({
          message: taskSimpleResp.title,
          caption: taskSimpleResp.description,
          timeout: 0,
          color: 'secondary',
          actions: [
            {
              label: '查看',
              color: 'white',
              handler: () => {
                gotoTaskDetailPage(taskId);
              }
            }
          ],
          position: 'top-right',
        });
      }).catch(err => {
        console.error(err);
      });
    }, diff);
  }
}

export default reminderInit;
export {addLocalReminder};

