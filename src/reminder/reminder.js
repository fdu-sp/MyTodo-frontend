import {getRecentReminders} from "src/api/reminder";
import {getDetailTaskInfo} from "src/api/task";
import {Notify} from "quasar";
import RouterUtils from "src/router/utils";

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

function formatTaskDetails(taskDetailResp) {
  const title = taskDetailResp.title || "No Title";
  const description = taskDetailResp.taskContentInfo?.description || "无描述";
  const endDate = taskDetailResp.taskTimeInfo?.endDate || "";
  const endTime = taskDetailResp.taskTimeInfo?.endTime || "";
  const endStr = endDate + " " + endTime;
  const showEnd = endDate && endDate !== "" && endTime && endTime !== "";
  const endHtml = showEnd ? `<span>截止：${endStr}</span>` : "";
  const isImportant = taskDetailResp.taskPriorityInfo?.isImportant || false;
  const importantHtml = isImportant ? `<q-icon name="star" class="text-warning q-ml-sm"/>` : "";
  return {
    message: `
    <div class="q-mb-sm">
      <span>${title}</span>
      ${importantHtml}
    </div>
   `,
    caption: `
      <span>${description}</span>
      <br/>
      ${endHtml}
    `,
  };
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
      getDetailTaskInfo(taskId, {silent: true}).then(data => {
        const taskDetailResp = data.object;
        const taskListId = taskDetailResp.taskListId;
        const formatHtml = formatTaskDetails(taskDetailResp);
        Notify.create({
          html: true,
          message: formatHtml.message,
          caption: formatHtml.caption,
          timeout: 0,
          color: 'secondary',
          actions: [
            {
              label: '查看',
              color: 'yellow',
              handler: () => {
                RouterUtils.gotoTaskDetailPage(taskListId, taskId);
              }
            },
            {
              label: '忽略',
              color: 'white',
              handler: () => {
                console.log(`Reminder ignored for taskId: ${taskId}`);
                // TODO: 后端记录忽略了提醒（silent）
              }
            }
          ],
          position: 'top-right',
        });
      }).catch(err => {
        console.error("Error in local reminder: ", err);
      });
    }, diff);
  }
}

export default reminderInit;
export {addLocalReminder};

