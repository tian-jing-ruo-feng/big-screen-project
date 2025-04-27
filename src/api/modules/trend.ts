import request from "../request";
import type { Trends } from "../interface";

export const getTrendsList = () => {
  return request.get<Trends[]>('/trend/list')
}
