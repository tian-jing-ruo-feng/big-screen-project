import { onBeforeMount, onMounted, ref } from 'vue'

// 默认适配的宽高
export const width = 1920
export const height = 1080

type ResizeType = {
  w?: number;
  h?: number;
  fullScreen?: boolean;
  delay?: number;
}

// 防抖函数
function debounce(fn: Function, delay: number) {
  let timer: NodeJS.Timeout | null = null
  return function (...args: any[]): void {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      typeof fn === 'function' && fn.apply(null, args)
      clearTimeout(timer as NodeJS.Timeout)
      timer = null
    }, delay > 0 ? delay : 100)
  }
}

export const useResize = (options: ResizeType = {}) => {
  const { w = width, h = height, fullScreen = false, delay = 100 }: ResizeType = options || {}
  const screenRef = ref()
  const scale = ref(1)

  function resize() {
    // 获取浏览器的宽高
    const {clientWidth, clientHeight} = document.documentElement
    // 计算缩放比例
    const scaleX = clientWidth / w
    const scaleY = clientHeight / h
    scale.value = Math.min(scaleX, scaleY)

    if (fullScreen) {
      // 不在乎缩放失真的情况，可以直接全屏
      screenRef.value.style.transform = `scale(${scaleX}, ${scaleY})`
    } else {
      screenRef.value.style.transform = `scale(${scale.value})`
      // 设置居中
      screenRef.value.style.left = `${(clientWidth - w * scale.value) / 2}px`
      screenRef.value.style.top = `${(clientHeight - h * scale.value) / 2}px`
    }

  }
  const resizeDelay = debounce(resize, delay)
  onMounted(() => {
    if (screenRef.value) {
      resize()
      window.addEventListener('resize', resizeDelay)
    }
  })
  onBeforeMount(() => window.removeEventListener('resize', resizeDelay))

  return { screenRef, scale }
}