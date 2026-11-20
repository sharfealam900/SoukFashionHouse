
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.soukfashionhouse.com/api/v1",
  withCredentials: true,
});

export default api;






    //  baseURL: "http://localhost:8000/api/v1",