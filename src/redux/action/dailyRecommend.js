import { dailyFreeResume } from 'service/beiLib'
import { talent } from 'service/talent'

/*
* action
* */
export const CHANGE_PARAMS = 'CHANGE_PARAMS' // 改变每日推荐中简历的参数
export const EQUEST_RESUMES = 'REQUEST_RESUMES' // 请求简历
export const RECEIVE_RESUMES = 'RECEIVE_RESUMES' // 获取简历

export const TALENT_RESUME = 'TALENT_RESUME' // 人才期刊

/*
* action creator
* */

export const changeParams = params => {
  return {
    type: CHANGE_PARAMS,
    payload: params
  }
}

export const requestResumes = () => {
  return {
    type: EQUEST_RESUMES
  }
}

export const receiveResumes = json => {
  return {
    type: RECEIVE_RESUMES,
    payload: json
  }
}

export const fetchDailyResumes = params => {
  return dispatch => {
    dispatch(changeParams(params))
    return dailyFreeResume(params).then(res => {
      const { success, data } = res
      success && dispatch(receiveResumes(data))
    })
  }
}

export const talentResume = json => {
  return {
    type: TALENT_RESUME,
    payload: json
  }
}

export const fetchTalentResumes = params => {
  return dispatch => {
    dispatch(changeParams(params))
    return talent(params).then(res => {
      const { success, data } = res
      success && dispatch(talentResume(data))
    })
    
  }
}
