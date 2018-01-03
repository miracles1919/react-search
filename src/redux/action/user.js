import { hasVerify, isSign } from 'service/user'

export const GET_USER_INFO = 'GET_USER_INFO'

export const getUserinfo = json => {
  return {
    type: GET_USER_INFO,
    payload: json
  }
}

export const fetchUserinfo = (params) =>{
  return dispatch => {
    hasVerify(params).then(res => {
      const { success, data } = res
      success && dispatch(getUserinfo(data[0]))
    })
  }
}

export const fetchSign = params => {
  return dispatch => {
    isSign(params).then(res => {
      const { success, data } = res
      success && dispatch(getUserinfo(data[0]))
    })
  }
}
