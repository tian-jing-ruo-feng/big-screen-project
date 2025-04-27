import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import event from './eventEmiter'
import type { ResultData } from "./interface";

class Request {
  private service: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config)
    // 请求拦截器
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 这里可以添加请求头等操作
        const token = localStorage.getItem('token')
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        // 这里可以添加其他请求配置
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )
    // 响应拦截器
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { status, data } = response
        if (data.code === RequestEnums.LOGINTIMEOUT) {
          event.emit('API:SESSION_EXPIRED')
          return Promise.reject(data)
        }
        if (data.code !== RequestEnums.SUCCESS) {
          event.emit('API:INVALID')
          return Promise.reject(data)
        }
        return data
      },
      (error) => {
        event.emit("API:NETWORK_ERROR")
        return Promise.reject(error) 
      }
    )
  }

  get<T>(url: string, params?: object): Promise<ResultData<T>> { 
    return this.service.get(url, { params })
  }
  
  post<T>(url: string, params?: object): Promise<ResultData<T>> { 
    return this.service.post(url, params)
  }
  
  put<T>(url: string, params?: object): Promise<ResultData<T>> { 
    return this.service.put(url, params)
  }
   
  delete<T>(url: string, params?: object): Promise<ResultData<T>> { 
    return this.service.delete(url, { params })
  }
  
}


enum RequestEnums {
  TIMEOUT = 10000, // 请求超时
  FAIL = 500, // 服务器异常
  INVALID= 400, // 参数错误
  LOGINTIMEOUT = 401, // 登录超时
  SUCCESS = 200, // 成功
}

const config:AxiosRequestConfig = {
  // baseURL: '/api',
  baseURL: import.meta.env.VITE_APP_API_URL as string,
  timeout: RequestEnums.TIMEOUT as number,
  withCredentials: true,
}

const request = new Request(config)
export default request