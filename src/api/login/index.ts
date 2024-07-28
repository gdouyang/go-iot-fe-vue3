import request from '@/axios'
import type { UserType } from './types'

export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post('/login', data)
}

export const getInfo = () => {
  return request.get('/user-info', {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export const sysConfig = () => {
  return request.get('/anon/system/config')
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.post('/logout')
}
