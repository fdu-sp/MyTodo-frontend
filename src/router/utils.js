import {router} from "src/router/index";

/**
 * @description 跳转到任务详情页
 * @param {number} taskListId 任务列表ID
 * @param {number} taskId 任务ID
 * */
function gotoTaskDetailPage(taskListId, taskId) {
  // taskListId 和 taskId 作为query参数
  router.push({
    path: '/todo',
    query: {
      taskListId: taskListId,
      taskId: taskId
    }
  }).then(r => console.log(r));
}

export {gotoTaskDetailPage};
