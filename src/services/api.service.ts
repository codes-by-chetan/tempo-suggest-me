import config from "@/config/env.config";
import axios from "axios";

const HOST_URL = config.API_URL;

const api = axios.create({
  baseURL: HOST_URL,
});

export default api;
