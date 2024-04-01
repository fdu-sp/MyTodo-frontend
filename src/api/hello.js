import {api} from 'boot/axios';

export function helloRequest(){
    return api.get('/hello');
}
