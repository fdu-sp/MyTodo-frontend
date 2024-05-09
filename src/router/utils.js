import {router} from "src/router/index";

const RouterUtils = {
  /**
   * @description 跳转到任务详情页
   * @param {number} listId 任务列表ID
   * @param {number} taskId 任务ID
   * */
  gotoTaskDetailPage(listId, taskId) {
    // taskListId 和 taskId 作为query参数
    return router.push({
      path: '/todo',
      query: {
        listId: listId,
        taskId: taskId
      }
    });
  },
  updateTaskDetailPage(listId, taskId) {
    return this.gotoTaskDetailPage(listId, taskId);
  },
};

export default RouterUtils;
