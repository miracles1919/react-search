import request from 'utils/request'

export async function login (params) {
  return request({
    url: 'https://api-dev.beichoo.com/1.0/super_talent_periodicals?user_id=1725600157&ts=1513822660&nonce=250380&sig=b7b6dcbbef1c69190963456d61448ad693a49edc',
    method: 'post',
    params,
  })
}
