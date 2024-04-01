import ToDoList from "pages/TodoListPage.vue";

const routes = [
  {
    path: '/',
    component: () => import('layouts/GooglePhotosLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/todo', component: (ToDoList) }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
