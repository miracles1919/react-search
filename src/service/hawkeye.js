import request from 'utils/request'
import requestMock from 'utils/requestMock'

import { API_PATH, API } from 'utils/config'

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

export async function getResume () {
  return requestMock(({
    url: `${API}/resumeList`,
    method: 'get',
  }))
}
