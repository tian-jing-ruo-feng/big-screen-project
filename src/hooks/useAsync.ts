import { shallowRef, ref, watchEffect, unref, type Ref } from 'vue'
interface UseAsyncOptions<T, Params extends any[]> {
  immediate?: boolean
  shallow?: boolean
  params?: Params
  onError?: (error: unknown) => void
  onSuccess?: (data: T) => void
  onBefore?: () => void
}
interface useAsyncReturn<T, Params extends any[]> {
  data: Ref<T | undefined>
  loading: Ref<boolean>
  error: Ref<unknown>
  execute: (...args: Params) => Promise<T | undefined>
}


export function useAsync<T, Params extends any[] = []>(
  fn: (...args: Params) => Promise<T>,
  options?: UseAsyncOptions<T, Params>
): useAsyncReturn<T, Params> {

  const { 
    immediate = true, 
    shallow = false, 
    params, 
    onError, 
    onSuccess,
    onBefore 
  } = options || {}

  const data = shallow ? shallowRef<T>() : ref<T>()
  const loading = ref(false)
  const error = ref<unknown>()
  
  const execute = async (...args: any) => {
    try {
      loading.value = true
      error.value = null
      onBefore && onBefore()
      const res = await fn(...args)
      data.value = res
      onSuccess && onSuccess(res)
      return res
    } catch (error: any) {
      error.value = error 
      onError && onError(error)
      return undefined
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    watchEffect(() => {
      if (params) {
        execute(...unref(params))
      } else {
        execute()
      }   
    })
  }

  return {
    data,
    loading,
    error,
    execute
  }
}

