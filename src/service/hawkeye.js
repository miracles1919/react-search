import request from 'utils/request'
import { API_PATH } from 'utils/config'

export async function getSelected () {
  return request({
    url: `${API_PATH}/get_local_search_history`,
    method: 'get',
  })
}

export async function searchResumeList (params) {
  return request({
    url: `${API_PATH}/search_resume_list`,
    method: 'post',
    params,
  })
}

export async function modLocation (params) {
  return request({
    url: `${API_PATH}/mod_location`,
    method: 'post',
    params,
  })
}


export async function leftList(params){
  return request({
    url: `${API_PATH}/list_job`,
    method: 'post',
    params
  })
}
export async function localJob(params){
  return request({
    url:`${API_PATH}/get_local_resume_list`,
    method: 'post',
    params
  })
}
export async function deleteResume(params){
  return request({
    url:`${API_PATH}/del_local_resume`,
    method: 'post',
    params
  })
}
export async function activeTalent(params){
  return request({
    url:`${API_PATH}/batch_deal_resume`,
    method: 'post',
    params
  })
}

export async function getLeftNumber(params){
  return request({
    url:`${API_PATH}/view_contact_info`,
    method: 'post',
    params
  })
}
export async function isConfiger(params){
  return request({
    url:`${API_PATH}/resume_zy`,
    method: 'post',
    params
  })
}
