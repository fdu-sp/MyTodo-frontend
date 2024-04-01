import {api} from 'boot/axios';

const taskCreateReq = {
  title: null,
  tagNames: [],
  completed: null,
  description: null,
  taskListId: null,
  inMyDay: null,
  isImportant: null,
  isUrgent: null,
  endDate: null,
  endTime: null,
  reminderTimestamp: null,
  activateCountdown: null,
  expectedExecutionDate: null,
  expectedExecutionStartPeriod: null,
  expectedExecutionEndPeriod: null
};

export function createNewTask(taskCreateReq){
    return api.post('/task/create-new-task', task);
}

// /api/task/simple/get-info/{task-id}
// 获取指定id的task信息(简洁)
export function getSimpleTaskInfo(taskId){
    return api.get(`/task/simple/get-info/${taskId}`);
}

// /api/task/detail/get-info/{task-id}
// 获取指定id的task信息(详细)
export function getDetailTaskInfo(taskId){
    return api.get(`/task/detail/get-info/${taskId}`);
}

// /api/task/simple/get-all-tasks
// 简洁-获取所有task信息
export function getAllTasksWithSimpleInfo(){
    return api.get('/task/simple/get-all-tasks');
}

// /api/task/detail/get-all-tasks
// 详细-获取所有task信息
export function getAllTasksWithDetailInfo(){
    return api.get('/task/detail/get-all-tasks');
}

// /api/task/complete/{task-id}
// 标记任务已完成
export function completeTask(taskId){
    return api.post(`/task/complete/${taskId}`);
}

// /api/task/un-complete/{task-id}
// 标记任务未完成
export function unCompleteTask(taskId){
    return api.post(`/task/un-complete/${taskId}`);
}

// /api/task/delete/{task-id}
// 删除指定id的task
export function deleteTask(taskId){
    return api.delete(`/task/delete/${taskId}`);
}

// /api/task/simple/get-all-tasks-by-list/{list-id}
// 简洁-获取指定清单中的所有task(简洁信息)
export function getAllTasksWithSimpleInfoByListId(listId){
    return api.get(`/task/simple/get-all-tasks-by-list/${listId}`);
}

// /api/task/simple/get-all-tasks/{tag-id}
// 简洁-获取指定tag下的所有task信息
export function getAllTasksWithSimpleInfoByTagId(tagId){
    return api.get(`/task/simple/get-all-tasks/${tagId}`);
}
