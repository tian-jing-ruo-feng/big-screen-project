import type { Wether } from "../interface"
import request from "../request"

export const getWetherList = () => {
  return request.get<Wether[]>('/wether/list')
}