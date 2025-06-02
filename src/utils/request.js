import axios from "axios";

// 创建axios实例对象
const request = axios.create({
  baseURL: "/api",
  timeout: 600000,
});

// ✅ 添加请求拦截器：自动携带token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 你在登录成功后存入的 JWT
    if (token) {
      config.headers.token = token; // 后端接口要求 header 名是 "token"
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
