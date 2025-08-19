import axios from "axios";

// CRA는 REACT_APP_* 만 인식합니다.
const baseURL = process.env.REACT_APP_API_BASE || "/api";

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
