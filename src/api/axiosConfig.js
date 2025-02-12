import axios from 'axios';

export default axios.create({
    baseURL: 'https://enthusiastic-encouragement-production.up.railway.app', // Replace with your Railway backend URL
    headers: {
        "ngrok-skip-browser-warning": "true", // Only needed if using ngrok
        "Content-Type": "application/json" // Ensure the correct content type
    }
});