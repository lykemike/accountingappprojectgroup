import axiosInstance from 'axios';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import axios from '../libs/axios';
// import { reject } from 'lodash/collection';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const Interceptors = ({ children }) => {
  const history = useHistory();
  useEffect(() => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (err) => {
        const originalConfig = err.config;
        if (err.response?.status === 401 && !originalConfig._retry) {
          if (isRefreshing) {
            try {
              const token = await new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
              });
              originalConfig.headers['Authorization'] = 'Bearer ' + token;
              return await axiosInstance(originalConfig);
            } catch (err_1) {
              return await Promise.reject(err_1);
            }
          }
          originalConfig._retry = true;
          isRefreshing = true;
          return new Promise(function (resolve, reject) {
            const token = new FormData();
            token.append('refresh_token', localStorage.getItem('_RuvTpQv'));
            axiosInstance
              .post(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/refresh`,
                // 'http://localhost/btnsmart-v3-main/api/v1/auth/refresh',
                token,
                {
                  headers: { 'Content-Type': 'application/json' }
                }
              )
              .then((response) => {
                localStorage.removeItem('_TuVbwpW');
                localStorage.removeItem('_RuvTpQv');
                localStorage.setItem(
                  '_TuVbwpW',
                  response.data?.data?.access_token
                );
                localStorage.setItem(
                  '_RuvTpQv',
                  response.data?.data?.refresh_token
                );
                axiosInstance.defaults.headers.common['Authorization'] =
                  'Bearer ' + response.data?.data?.access_token;
                originalConfig.headers['Authorization'] =
                  'Bearer ' + response.data?.data?.access_token;
                processQueue(null, response.data?.data?.access_token);
                resolve(axiosInstance(originalConfig));
              })
              .catch((err) => {
                processQueue(err, null);
                localStorage.removeItem('_TuVbwpW');
                localStorage.removeItem('_RuvTpQv');
                history.push('/auth/login');
                reject(err);
              })
              .then(() => {
                isRefreshing = false;
              });
          });
        } else {
          return Promise.reject(err);
        }
      }
    );
  }, []);

  return children;
};

export default Interceptors;
