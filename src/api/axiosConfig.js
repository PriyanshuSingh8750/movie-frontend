import axios from 'axios';

export default axios.create({
    baseURL: ' https://1f56-2401-4900-1c5b-4080-9c9f-a75b-df92-f5c9.ngrok-free.app',
    headers: {"ngrok-skip-browser-warning":"true"}
});