import request from 'utils/request'
import { API_PATH } from 'utils/config'

export async function hasVerify(params){
  return request({
    url: `${API_PATH}/resume_zy`,
    method: 'post',
    params
  })
}

export async function isSign(params) {
  return request({
    url: `${API_PATH}/sign_new_info`,
    method: 'post',
    params,
  })
}
