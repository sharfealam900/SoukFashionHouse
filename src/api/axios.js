import axios from "axios";

const api = axios.create({
  baseURL: "https://twin-lightcoral-weasel-41.hostingersite.com/api/v1",
    //  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

export default api;
