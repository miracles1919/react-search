/**
 * Created by zhangxy on 2017/12/20.
 */
import request from 'utils/request'

export async function getJobList (params) {
  return request({
    url: 'https://api-dev.beichoo.com/1.0/get_local_job_list',
    method: 'post',
    params,
  })
}
