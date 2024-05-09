import {api} from 'boot/axios';

// 创建新的任务
// const taskCreateReq = {
//   title: "title", // 任务标题, 必填, 非null, 非空字符串
//   tagNames: [], // 任务标签, 必填, List<String>, 可以为空列表
//   completed: null, // 任务是否已完成, 选填, Boolean
//   description: "", // 任务描述, 必填, String, 可以为空字符串
//   taskListId: null, // 任务所属清单id, 选填, Long,
//   inMyDay: null, // 是否在我的一天中, 选填, Boolean
//   // 优先级信息
//   isImportant: null, // 是否重要, 选填, Boolean
//   isUrgent: null,  // 是否紧急, 选填, Boolean
//   // 时间信息：均选填
//   endDate: null,
//   endTime: null,
//   reminderTimestamp: null,
//   activateCountdown: null,
//   expectedExecutionDate: null,
//   expectedExecutionStartPeriod: null,
//   expectedExecutionEndPeriod: null
// };
export function createNewTask(taskCreateReq) {
  return api.post('/task/create-new-task', taskCreateReq);
}

// /api/task/simple/get-info/{task-id}
// 获取指定id的task信息(简洁)
export function getSimpleTaskInfo(taskId) {
  return api.get(`/task/simple/get-info/${taskId}`);
}

/*
const TaskDetailResp = {
  id: 123,
  title: "Complete the project",
  completed: false,
  completedTime: null,
  archived: false,
  tags: [
    {
      id: 1,
      tagName: "Urgent",
      tagPath: "/tags/urgent"
    },
    {
      id: 2,
      tagName: "Home",
      tagPath: "/tags/home"
    }
  ],
  taskListId: 101,
  taskListName: "Work",
  inMyDay: false,
  taskContentInfo: {
    description: "Complete the project deliverables as outlined.",
    createTime: "2024-04-15T08:00:00Z",
    updateTime: "2024-04-16T09:00:00Z"
  },
  taskPriorityInfo: {
    isImportant: true,
    isUrgent: true
  },
  taskTimeInfo: {
    endDate: "2024-04-20",
    endTime: "17:00:00",
    reminderTimestamp: "2024-04-20T15:00:00Z",
    activateCountdown: true,
    expectedExecutionDate: "2024-04-18",
    expectedExecutionStartPeriod: "09:00:00",
    expectedExecutionEndPeriod: "11:00:00"
  },
  createTime: "2024-04-10T07:30:00Z",
  updateTime: "2024-04-15T18:45:00Z"
};
* */
// /api/task/detail/get-info/{task-id}
// 获取指定id的task信息(详细)
export function getDetailTaskInfo(taskId, config = {}) {
  return api.get(`/task/detail/get-info/${taskId}`, config);
}

// /api/task/simple/get-all-tasks
// 简洁-获取所有task信息
export function getAllTasksWithSimpleInfo() {
  return api.get('/task/simple/get-all-tasks');
}

// /api/task/detail/get-all-tasks
// 详细-获取所有task信息
export function getAllTasksWithDetailInfo() {
  return api.get('/task/detail/get-all-tasks');
}

// /api/task/complete/{task-id}
// 标记任务已完成
export function completeTask(taskId) {
  return api.post(`/task/complete/${taskId}`);
}

// /api/task/un-complete/{task-id}
// 标记任务未完成
export function unCompleteTask(taskId) {
  return api.post(`/task/un-complete/${taskId}`);
}

// /api/task/delete/{task-id}
// 删除指定id的task
export function deleteTask(taskId) {
  return api.post(`/task/delete/${taskId}`);
}

// /api/task/simple/get-all-tasks-by-list/{list-id}
// 简洁-获取指定清单中的所有task(简洁信息)
export function getAllTasksWithSimpleInfoByListId(listId) {
  return api.get(`/task/simple/get-all-tasks-by-list/${listId}`);
}

// /api/task/simple/get-all-tasks/{tag-id}
// 简洁-获取指定tag下的所有task信息
export function getAllTasksWithSimpleInfoByTagId(tagId) {
  return api.get(`/task/simple/get-all-tasks/${tagId}`);
}

// /api/task/simple/get-all-tasks-by-tags
// 根据标签过滤（同时具有多个标签的）待办事项
const tags = {
  tagIds: [] // 标签id列表, 必填, List<Long>, 不能为NULL，不可以为空列表
}

export function getAllTasksByTags(tags) {
  return api.post('/task/simple/get-all-tasks-by-tags', tags);
}
