import request from '@/axios'

export const tableUrl = '/server/page'

export function getAllNetwork() {
  return request.post(`/server/page`, { pageNum: 1, pageSize: 10000, condition: [] })
}

export function getNetwork(id) {
  return request.get(`/server/${id}`)
}

export function editNetwork(data) {
  return request.put(`/server`, data)
}

export function addNetwork(data) {
  return request.post(`/server`, data)
}

export function removeNetwork(id) {
  return request.delete(`/server/${id}`)
}
