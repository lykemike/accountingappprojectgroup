import axios from "axios";
import Cookie from "js-cookie";

let authTokens = Cookie.get("token") ? Cookie.get("token") : null;

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { Authorization: `Bearer ${authTokens}` },
  timeout: 10000000,
});

// axiosInstance.interceptors.request.use(
//   function (config) {
//     config.headers['Authorization'] = `Bearer ${localStorage.getItem(
//       '_TuVbwpW'
//     )}`;
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.request.use(async (req) => {
//   if (!authTokens) {
//     authTokens = Cookie.get("token") ? Cookie.get("token") : null;
//     req.headers.Authorization = `Bearer ${authTokens}`;
//   }
//   return req;
// });

export default axiosInstance;
