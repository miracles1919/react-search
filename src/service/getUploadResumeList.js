/**
 * Created by zhangxy on 2017/12/20.
 */
import request from 'utils/request'

export async function getUploadResumeList (params) {
  return request({
    url: 'https://api-dev.beichoo.com/1.0/get_upload_resume_list',
    method: 'post',
    params,
  })
}
