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

function gotoTaskDetailPage(id) {
  // TODO: 跳转到任务详情页
  // this.$router.push(`/todo/${id}`);
}

export default routes;
export {gotoTaskDetailPage};
