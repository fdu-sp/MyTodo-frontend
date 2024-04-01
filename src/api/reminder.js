import {api} from 'boot/axios';

// /api/reminder/get-all
// 获取所有提醒信息
export function getAllReminders(){
    return api.get('/reminder/get-all');
}
