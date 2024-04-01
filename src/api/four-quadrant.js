import {api} from 'boot/axios';

export function getFourQuadrantDataByList(taskListId){
    return api.get(`/four-quadrant/get-by-list/${taskListId}`);
}

export function getFourQuadrantDataOfMyDay(){
    return api.get('/four-quadrant/get-by-my-day');
}
