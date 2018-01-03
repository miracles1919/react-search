/**
 * Created by zhangxy on 2017/12/20.
 */
import request from 'utils/request'
import { API_PATH } from 'utils/config'
export async function uploadResume (params) {
  return request({
    url: `${API_PATH}/upload_resume`,
    method: 'post',
    params,
  })
}

export async function getUploadResumeList (params) {
  return request({
    url: `${API_PATH}/get_upload_resume_list`,
    method: 'post',
    params,
  })
}

export async function getJobList (params) {
  return request({
    url:`${API_PATH}/get_local_job_list`,
    method: 'post',
    params,
  })
}
