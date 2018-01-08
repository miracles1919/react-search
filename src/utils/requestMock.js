import axios from 'axios'
import lodash from 'lodash'

const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
  } = options

  const cloneData = lodash.cloneDeep(data)

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      })
    case 'post':
      return axios.post(url, cloneData)
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}

const requestMock = (options) => {
  return fetch(options).then((response) => {
    console.log('response', response)
    const { statusText, status } = response
    const { code, data, error_msg } = response.data
    if (code === 0) {
      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...data,
      })
    }

    return Promise.reject({
      success: false,
      statusCode: status,
      message: error_msg,
    })
  }).catch((error) => {
    const { response } = error
    let msg
    let statusCode
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      msg = data.message || statusText
    } else {
      statusCode = 600
      msg = error.message || 'Network Error'
    }
    return Promise.reject({ success: false, statusCode, message: msg })
  })
}

export default requestMock
