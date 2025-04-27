import  { type MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'
import util from '../util'

export default [
  {
    url: '/api/sales/list',
    method: 'get',
    response: () => {
      const json = util.getJsonFile('./data/salesInfo.json')
      return Mock.mock(json)
    }
  },
  {
    url: '/api/trend/list',
    method: 'get',
    response: () => {
      const json = util.getJsonFile('./data/trendInfo.json')
      return Mock.mock(json)
    }
  },
  {
    url: '/api/wether/list',
    method: 'get',
    response: () => {
      const json = util.getJsonFile('./data/wether.json')
      return Mock.mock(json)
    }
  }
] as MockMethod[]