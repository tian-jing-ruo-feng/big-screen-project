import { reactive, ref, type CSSProperties, defineComponent, type Prop, type PropType, nextTick, onMounted, onUnmounted, onActivated, h } from "vue"

// 防抖函数
function debounce(fn: Function, delay: number) {
  let timer: NodeJS.Timeout | null  = null
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(
      () => {
        fn.apply(null, args)
      },
      delay > 0 ? delay : 100
    )
  }
}

interface IState {
  designWidth: string | number; // 设计高宽度
  designHeight: string | number; // 设计高度
  width: string | number; // 当前宽度
  height: string | number; // 当前高度
  observer: null | MutationObserver; //  DOM 变换观察器
}

// 缩放配置
type IAutoScale = 
  | boolean // 是否启用自动缩放
  | {
    x?: boolean; // 是否启用 x 轴缩放
    y?: boolean; // 是否启用 y 轴缩放
  }

export default defineComponent({
  name: "ScaleScreen",
  props: {
    // 设计稿基准宽度
    width: {
      type: [String, Number],
      default: 1920
    },
    // 设计稿基准高度
    height: {
      type: [String, Number],
      default: 1080
    },
    // 是否全屏拉伸
    fullScreen: {
      type: Boolean,
      default: false
    },
    // 缩放配置
    autoScale: {
      type: [Object, Boolean] as PropType<IAutoScale>,
      default: true
    },
    // 防抖延迟时间
    dealy: {
      type: Number,
      default: 100
    },
    // 外层容器样式
    contianerStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    // 内层容器样式
    wrapperStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    // 是否隐藏页面滚动条
    bodyOverflow: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { slots }) {
    const state = reactive<IState>({
      designWidth: props.width,
      designHeight: props.height,
      width: `100vw`,
      height: `100vh`,
      observer: null
    })

    // 基础样式配置：外层容器样式 + 内层容器样式
    const styles: Record<string, CSSProperties> = {
      container: {
        width: "100vw",
        height: "100vh",
        overflow: 'hidden',
        ...props.contianerStyle
      },
      wrapper: {
        width: `${state.width}px`,
        height: `${state.height}px`,
        transformOrigin: "0 0",
        overflow: "hidden",
        transition: "all 0.3s",
        ...props.wrapperStyle
      }
    }

    const el = ref<HTMLElement>()

    // 初始化容器尺寸
    const initSize = () => {
      return new Promise<void>((resolve) => {
        // 等待DOM 渲染更新，确保获取到的是最新数据
        // 如果数据加载过慢，肯能导致 clientWidth = 0
        nextTick(() => {
          // 获取容器尺寸
          if (props.width && props.height) {
            state.width = props.width
            state.height = props.height
          } else {
            state.width = el.value?.clientWidth || 0
            state.height = el.value?.clientHeight || 0
          }

          // 获取屏幕分辨率
          if (!state.designHeight || !state.designWidth) {
            state.designHeight = window.screen.height
            state.designWidth = window.screen.width
          }
          resolve()
        })
      })
    }

    // 初始化 body 滚动条样式
    const initBodyStyle = () => {
      if (props.bodyOverflow) {
        document.body.style.overflow = "hidden"
      }
    }

    // 更新容器尺寸
    const updateSize = () => {
        if (state.width && state.height) {
          el.value!.style.width = `${state.width}px`
          el.value!.style.height = `${state.height}px`
        } else {
          el.value!.style.width = `${state.designWidth}`
          el.value!.style.height = `${state.designHeight}`
        }
    }

    // 容器缩放
    const autoScale = (scale: number) => {
      if (!props.autoScale) return
      const { clientWidth: domWidth, clientHeight:domHeight } = el.value!
      const { clientWidth: screenWidth, clientHeight: screenHeight} = document.documentElement
      el.value!.style.transform = `scale(${scale}, ${scale})`
      // 计算居中偏移量
      let mx = Math.max(0, (screenWidth - domWidth * scale) / 2)
      let my = Math.max(0, (screenHeight - domHeight * scale) / 2)
      // 处理轴向锁定配置
      if(typeof props.autoScale === 'object') {
        !props.autoScale.x && (mx = 0)
        !props.autoScale.y && (my = 0)
      }
      // 设置偏移量
      el.value!.style.margin = `${my}px ${mx}px`
    }

    // 计算并更新缩放比例
    const updateScale = () => {
      // 获取真实视口尺寸
      const { clientWidth: screenWidth, clientHeight: screenHeight } = document.documentElement
      // 获取大屏幕尺寸
      const realWidth = state.width || state.designWidth
      const realHeight = state.height || state.designHeight
      // 计算缩放比例
      const scaleX = screenWidth / +realWidth
      const scaleY = screenHeight / +realHeight

      // 全屏铺满，则区各自缩放比例
      if (props.fullScreen) {
        el.value!.style.transform = `scale(${scaleX}, ${scaleY})`
      } else {
        // 否则，保持比例缩放(按照最小比例缩放)
        autoScale(Math.min(scaleX, scaleY))
      }
    }

    // 防抖处理重置函数
    const onResize = debounce(async() => {
      await initSize()
      updateSize()
      updateScale()
    }, props.dealy)

    // 初始化 DOM 观察器
    const initMutationObserver = () => {
      const observer = (state.observer = new MutationObserver(() => {
        onResize()
      }))
      observer.observe(el.value!, {
        attributes: true, // 监听属性变化
        attributeFilter: ["style"], // 只监听 style 属性变化
        attributeOldValue: true, // 监听属性变化前的值
      })
    }

    onMounted(async () => {
      initBodyStyle()
      nextTick(async () => {
        await initSize()
        updateSize()
        updateScale()
        window.addEventListener("resize", onResize)
        initMutationObserver()
      })
      console.log(el.value, 'el.value');
    })

    onUnmounted(() => {
      window.removeEventListener('resize', onResize)
      if (state.observer) {
        state.observer.disconnect()
        state.observer = null
      }
      if (props.bodyOverflow) {
        document.body.style.overflow = "auto"
      }
    })

    onActivated(updateScale)

    // 渲染函数

    return () => {
      return h(
        'div',
        {
          className: 'v-screen-container',
          style: {...styles.container, ...props.contianerStyle },
        },
        [
          h(
            'div',
            {
              className: 'screen-wrapper',
              style: { ...styles.wrapper, ...props.wrapperStyle },
              ref: el
            },
            slots.default?.()
          )
        ]
      )
    }
  }
})