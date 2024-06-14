import { api } from 'boot/axios';

export function getTimeWeekAnalyis() {
  return api.get('/timer/get-timer-week-analysis');
}

export function getTimeMonthAnalyis() {
  return api.get('/timer/get-timer-month-analysis');
}

export function getTask(period) {
  return api.get(`/task/analysis/get-task-analysis-by-period/${period}`);
}

export function getGroudName(id) {
  return api.get(`/task-list/simple/find-by-id/${id}`);
}
