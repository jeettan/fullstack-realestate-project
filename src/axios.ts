import axios from 'axios'
import config from './config'

axios.defaults.baseURL = config.endpoint

axios.interceptors.request.use(

    config => {
        
      if (config.url?.includes("/login"))  return config;

      const token = localStorage.getItem("token");

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    err => {
      Promise.reject(err);
    }
);

axios.interceptors.response.use(
    response => {
        return response;
    },
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            return Promise.reject(err);
        }

        return Promise.reject(err);
    }
);

export default axios;