import { CHANGE_PARAMS, EQUEST_RESUMES, RECEIVE_RESUMES, TALENT_RESUME } from '../action/dailyRecommend'

const dailyRecommendParams = {
  job_id: '', // 职位id
  search_key: '', // 关键字搜索
  talent: '', // 是否是优选人才
}

export const resumeParams = (state = dailyRecommendParams, { type, payload }) => {
  switch(type){
    case CHANGE_PARAMS:
      return {
        ...state,
        ...payload
      }
    default:
      return state;
  }
}

export const dailyRecommendResumes = (state = {
  isFetching: true,
  resumes: [],
  pages: {
    page_max: ''
  }
}, { type, payload }) => {
  switch(type){
    case CHANGE_PARAMS:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_RESUMES:
      return {
        isFetching: false,
        resumes: [...payload[0]]
      };
    case TALENT_RESUME:
      return {
        isFetching: false,
        resumes: [...payload[0]],
        pages: payload[1]
      };
    default:
      return state;
  }
}
