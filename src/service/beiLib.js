import request from 'utils/request'
import { API_PATH } from 'utils/config'

export async function dailyFreeResume(params){
  return request({
    url: `${API_PATH}/daily_free_resume`,
    method: 'post',
    params
  })
}

export async function careers(params){
  return request({
    url: `${API_PATH}/list_job`,
    method: 'post',
    params
  })
}

export async function talentfollowup(params){
  return request({
    url: `${API_PATH}/talent_follow_up`,
    method: 'post',
    params: {
      type: 'local',
      from: 5,
      ...params
    }
  })
}
export async function noInterestResume(params){
  return request({
    url: `${API_PATH}/no_interest_resume`,
    method: 'post',
    params
  })
}

export async function hasVerify(params){
  return request({
    url: `${API_PATH}/resume_zy`,
    method: 'post',
    params
  })
}

export async function invite_intro(params){
  return request({
    url: `${API_PATH}/view_contact_info`,
    method: 'post'
  })
}

export async function completeInvite(params){
  return request({
    url: `${API_PATH}/batch_deal_resume`,
    method: 'post',
    params
  })
}

export async function recordResume(params){
  return request({
    url: `${API_PATH}/tap_resume`,
    method: 'post',
    params
  })
}

export async function batch_deal_resume(params){
  return request({
    url: `${API_PATH}/batch_deal_resume`,
    method: 'post',
    params
  })
}
