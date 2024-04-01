import {api} from 'boot/axios';

// /api/task/my-day/add/{task-id}
// 添加任务到我的一天
export function addTaskToMyDay(taskId){
    return api.post(`/task/my-day/add/${taskId}`);
}

// /api/task/my-day/remove/{task-id}
// 从我的一天移除任务
export function removeTaskFromMyDay(taskId){
    return api.post(`/task/my-day/remove/${taskId}`);
}

// /api/task/my-day/clear
// 清空我的一天
export function clearMyDay(){
    return api.post('/task/my-day/clear');
}

// /api/task/my-day/simple/list
// 我的一天-获取所有任务(简洁信息)
export function getMyDayTasksWithSimpleInfo(){
    return api.get('/task/my-day/simple/list');
}

// /api/task/my-day/recommend
// 我的一天-推荐
export function getRecommendOfMyDay(){
    return api.get('/task/my-day/recommend');
}
