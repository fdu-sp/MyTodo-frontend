import {api} from 'boot/axios';

// /api/reminder/get-all
// 获取所有提醒信息
export function getAllReminders() {
	return api.get('/reminder/get-all');
}

// /api/reminder/get-recent/{hour}
/**
 * @description 获取最近一段时间的提醒信息
 * @param {number} hour 小时数
 * */
export function getRecentReminders(hour) {
	return api.get(`/reminder/get-recent/${hour}`);
}
