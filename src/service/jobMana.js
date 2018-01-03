/**
 * Created by zhangxy on 2017/12/20.
 */
import request from 'utils/request'
import { API_PATH } from 'utils/config'
export async function jabMana(params) {
  return request({
    url: `${API_PATH}/list_job`,
    method: 'post',
    params,
  })
}

export async function resume_zy(params) {
  return request({
    url: `${API_PATH}/resume_zy`,
    method: 'post',
    params,
  })
}

export async function stop_job(params) {
  return request({
    url: `${API_PATH}/stop_job`,
    method: 'post',
    params,
  })
}


