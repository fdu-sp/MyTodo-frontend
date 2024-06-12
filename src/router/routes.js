import ToDoList from "pages/TodoPage.vue";

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/todo', component: (ToDoList) },
      { path: '/statistic', component: () => import('pages/StatisticPage.vue') },
      { path: '/today', component: () => import('pages/TodayPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes;
