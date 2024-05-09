import {router} from "src/router/index";

/**
 * @description 跳转到任务详情页
 * @param {number} listId 任务列表ID
 * @param {number} taskId 任务ID
 * */
function gotoTaskDetailPage(listId, taskId) {
  // taskListId 和 taskId 作为query参数
  return router.push({
    path: '/todo',
    query: {
      listId: listId,
      taskId: taskId
    }
  });
}

function updateTaskDetailPage(listId, taskId) {
  return gotoTaskDetailPage(listId, taskId);
}

export {gotoTaskDetailPage, updateTaskDetailPage};
