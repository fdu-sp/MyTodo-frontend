import {api} from 'boot/axios';

// /api/task-group/create
// 新增分组
const taskGroupCreateReq = {
    name: null, // 分组名称, 必填, String, 不能为null, 不能重名, 不能为空字符串
    description: null, // 分组描述, 必填, String, 可以为空字符串
};
export function createNewTaskGroup(taskGroupCreateReq){
    return api.post('/task-group/create', taskGroupCreateReq);
}

// /api/task-group/simple/get-all
// 简洁-获取所有分组，每个分组包括：统计、拥有的清单（简洁信息），清单下的任务数
export function getAllTaskGroupsWithSimpleInfo(){
    return api.get('/task-group/simple/get-all');
}
