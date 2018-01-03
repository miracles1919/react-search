/**
 * Created by zhangxy on 2017/12/20.
 */
import request from 'utils/request'
import { API_PATH } from 'utils/config'
export async function talent(params) {
  return request({
    url:`${API_PATH}/super_talent_periodicals`,
    method: 'post',
    params,
  })
}

export async function is_sign(params) {
  return request({
    url: `${API_PATH}/sign_new_info`,
    method: 'post',
    params,
  })
}

export async function sign_new(params) {
  return request({
    url: `${API_PATH}/sign_new`,
    method: 'post',
    params,
  })
}

export async function magnifier_list(params) {
  return request({
    url:  `${API_PATH}/magnifier_list_messages`,
    method: 'post',
    params
  })
}

export async function hasVerify(params){
  return request({
    url:  `${API_PATH}/resume_zy`,
    method: 'post',
    params,
  })
}

export async function list_channel(params){
  return request({
    url:  `${API_PATH}/list_channel`,
    method: 'post',
    params,
  })
}
