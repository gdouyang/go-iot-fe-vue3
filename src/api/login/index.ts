import request from '@/axios'
import type { UserType } from './types'

export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/login', data })
}

export const getInfo = () => {
  return request.get({
    url: '/user-info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export const sysConfig = () => {
  return request.get({
    url: '/anon/system/config',
    method: 'get'
  })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.post({ url: '/logout' })
}
