import { io, Socket } from 'socket.io-client'
import { ref } from 'vue';

interface WebsocketOptions {
  autoConnect?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

type WebsocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error'
type EventCallback<T = any> = (data: T) => void

export const useWebsocket = (url: string, options: WebsocketOptions = {}) => {
  const { autoConnect, reconnectionAttempts, reconnectionDelay } = options
  // 响应式状态
  const socket = ref<Socket | null>(null)
  const connectionStatus = ref<WebsocketStatus>('disconnected')

  const lastError = ref<Error | null>(null)
  const eventCallbacks = new Map<string, EventCallback>()

  // 初始化 socket.io
  const initSocket = () => {
    socket.value = io(url, { autoConnect, reconnectionAttempts, reconnectionDelay})

    socket.value.on('connect', () => {
      connectionStatus.value = 'connected'
      lastError.value = null
    })

    socket.value.on('connected', () => {
      
    })

    socket.value.on('disconnected', () => {
      connectionStatus.value = 'disconnected'
    })

    socket.value.on('error', (error: Error) => {
      connectionStatus.value = 'error'
      lastError.value = error
    })

    // 通用的消息处理
    socket.value.onAny((eventName: string, data: any) => {
      const callback = eventCallbacks.get(eventName)
      if (callback) {
        callback(data)
      }
    })
  }
  
  // 订阅事件
  const subscribe = <T>(eventName: string, callback: EventCallback<T>) => {
    eventCallbacks.set(eventName, callback)
  }

  // 取消订阅
  const unSubscribe = (eventName: string) => {
    eventCallbacks.delete(eventName)
  }
  
  // 手动连接
  const connect = () => {
    if (!socket.value) {
      initSocket()
    }
    socket.value?.connect()
  }

  // 取消连接
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      eventCallbacks.clear()
    }
  }

  if (autoConnect) {
    initSocket()
  }

  return {
    socket,
    connectionStatus,
    lastError,
    subscribe,
    unSubscribe,
    disconnect,
    connect
  }
}