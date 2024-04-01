import {api} from 'boot/axios';

// /api/task-list/create-new
// 新增清单
const taskListCreateReq = {
  name: null, // 清单名称, 必填, String, 不能为null
  description: null, // 清单描述, 必填, String, 可以为空字符串
  taskGroupId: null, // 所属分组id, 选填, Long, 可以为null
};
export function createNewTaskList(taskListCreateReq){
    return api.post('/task-list/create-new', taskListCreateReq);
}

// /api/task-list/detail/find-by-id/{id}
// 获取指定清单的task信息(关于清单的详细信息)
export function getTaskListDetailInfo(taskListId){
    return api.get(`/task-list/detail/find-by-id/${taskListId}`);
}

// /api/task-list/simple/my-day
// 获取我的一天清单信息(简洁-获取我的一天的TaskListSimpleResp)
export function getMyDayTaskListSimpleInfo(){
    return api.get('/task-list/simple/my-day');
}

// /api/task-list/update-info
// 更新清单信息
/*
* {
    "id": 1,
    "name": "收集箱",
    "description": "inbox",
    "taskGroupId": 1
}
* */
const taskListUpdateReq = {
    id: null, // 清单id, 必填, Long, 不能为null
    name: null, // 清单名称, 必填, String, 不能为null, 不能重名, 不能为空字符串
    description: null, // 清单描述, 必填, String, 可以为空字符串
    taskGroupId: null, // 所属分组id, 必填, Long, 不能为null
};
export function updateTaskListInfo(taskListUpdateReq){
    return api.post('/task-list/update-info', taskListUpdateReq);
}
