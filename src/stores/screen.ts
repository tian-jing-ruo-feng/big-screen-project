import { defineStore } from 'pinia';

interface ScreenState {
  title: string;
  theme: 'dark' | 'light';
}
export const useScreenStore = defineStore('screen', {
  state: (): ScreenState => {
    return {
      title: '大屏数据可视化',
      theme: 'dark'
    }
  },
})