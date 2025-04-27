export interface Result {
  code: number;
  msg: string;
  success: boolean;
}

export interface ResultData<T=any> extends Result {
  data?: T
}

export interface Sales {
  _id: string;
  name: string;
  value: number;
}

export interface Trends {
  _id: string;
  name: string;
  data: number[];
}

export interface Wether {
  _id: string;
  name: string;
  value: number;
}