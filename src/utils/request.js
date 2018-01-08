import { fGetUrl } from './common'

const request = (options) => {
  let { url, method = 'get', params } = options

  url = fGetUrl(options.url, params)

  return fetch(url, {
    method,
    body: JSON.stringify(params),
  }).then(res => { console.log(res); return res.json() }).then((res) => {
    const [code, ...data] = [...res]

    if (code === 0) {
      return Promise.resolve({
        success: true,
        data,
      })
    } else if (code === -2 || code === -3) {
      window.location.href = `${location.host}/login.html`
    }

    return Promise.resolve({
      success: false,
      message: data,
    })
  })
}


export default request
