import { GET_USER_INFO } from '../action/user'

const initState = {
  has_approve_company: 0, // 是否进行过公司认证
  has_company_info: 0, // 公司信息是否完善
  has_publish_job: 0, // 是否发不过职位
  true_compamy_name: '', // 真实的公司名称
  can_beichoo_super_talent: false, // 人才期刊能否看到简历
  have_money_exchange: false, // 20块新手红包是否兑换过
  have_signed_this_month: 0, // 本月签到的次数
  is_old_user: false, // 是否是老用户（2017年10月之前算老用户）
  signed: false, // 今天是否签到
};

export const userInfo = (state = initState, { type, payload }) => {
  switch(type){
    case GET_USER_INFO:
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
}
