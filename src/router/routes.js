import ToDoList from "pages/TodoPage.vue";

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/IndexPage.vue')},
      {path: '/todo', component: (ToDoList)}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

/**
 * @description 跳转到任务详情页
 * @param {number} taskListId 任务列表ID
 * @param {number} taskId 任务ID
 * */
function gotoTaskDetailPage(taskListId, taskId) {
  // TODO: 跳转到任务详情页
  // taskListId 和 taskId 作为query参数
}

export default routes;
export {gotoTaskDetailPage};
