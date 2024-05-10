import {api} from 'boot/axios';

/**
 * @description 获取当前正在计时的任务
 * */
export function getTheTaskCurrentlyBeingTimed(){
    return api.get('/timer/get-current-timer')
}

/**
 * @description 新建计时器
 * @param {number} taskId 任务id
 */
export function createNewTimer(taskId){
    return api.post('/timer/create-new-timer', {taskId})
}

/***
  * @description 停止计时时更新计时器
 * @param {number} timerId 计时器id
  */
export function updateTimer(timerId) {
    return api.post('/timer/update-timer', {timerId})
}
