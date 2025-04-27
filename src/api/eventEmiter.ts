const eventNames = [
  "API:UN_AUTHORIZED",
  "API:INVALID",
  "API:NETWORK_ERROR",
  "API:SESSION_EXPIRED",
] as const

type EventName = typeof eventNames[number]

// 发布/订阅模式
class EventEmitter {
  private listeners: Record<EventName, Set<Function>> = {
    "API:UN_AUTHORIZED": new Set(),
    "API:INVALID": new Set(),
    "API:NETWORK_ERROR": new Set(),
    "API:SESSION_EXPIRED": new Set(),
  }

  // 监听事件，同dom注册事件一样，将来某个事件发上则运行哪个函数
  on(eventName: EventName, listener: Function) {
    this.listeners[eventName].add(listener)
  }

  // 触发事件，执行所有注册的函数
  emit(eventName: EventName, ...args: any[]) {
    this.listeners[eventName].forEach((listener) => {
      listener(...args)
    })
  }
  
}

export default new EventEmitter()