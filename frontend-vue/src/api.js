import axios from 'axios';

const api = axios.create({
    baseURL: '/api' //'http://localhost:8080/api', //
});

export default api;