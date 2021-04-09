import {request} from "@/network/request";

export function getHomeMultiData() {
  return request({
    url: "/multidata"
  })
}

export function getHomeGoods(type) {
  return request({
    url: "/getcloth",
    params: {
      type
    }
  })
}