import  {type AxiosResponse} from 'axios';
import axios from "axios";

// Create an instance of Axios
const baseApi = axios.create({
 baseURL: import.meta.env.VITE_SERVER_URL,
 // Other configurations
});


// Add a request interceptor
baseApi.interceptors.request.use(
 async (config) => {
    
  return config;
 },
 (error) => {
  return Promise.reject(error);
 },
);

// Add a response interceptor
baseApi.interceptors.response.use(
 (response: AxiosResponse) => {
  return response;
 },
 (error) => {
  return Promise.reject(error);
 },
);

export default baseApi;


