import axios from "axios";

const HOST_URL = "http://192.168.0.39:3200/api/";

const api = axios.create({
  baseURL: HOST_URL,
});

export default api;

