import axios from 'axios';

const intance = axios.create();

export function get(path, params) {
    return intance.get(path, {
        params
    });
}

export function post(path, params) {
    return intance.post(path, params);
}

export default {
    get,
    post
}
