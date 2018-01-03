import { ADD_SEARCH_KEY, CHANGE_TITLE_NUM } from '../action/myTalent'

export function localTalentSearchKey(state = {
  search_key: '',
  titleNum: {
    local_resume_num: '', // 本地简历
    talent_up_resume_num: '', // 人才跟进
    p_job_list_num: '', // 职位架构
  }
}, { type, payload }){
  switch(type){
    case ADD_SEARCH_KEY:
      return {
        ...state,
        search_key: payload
      };
    case CHANGE_TITLE_NUM:
      return {
        ...state,
        titleNum: payload
      }
    default:
      return state;
  }
}
