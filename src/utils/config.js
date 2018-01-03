const cookieName = {
  uid: 'uid',
  token: 'token',
}


const HOSTS = () => {
  let { location } = window
  if (location.host.indexOf('pin-dev.beichoo.com') !== -1) {
    return 'https://api-dev.beichoo.com'
  } else if (location.host.indexOf('pin-test.beichoo.com') !== -1) {
    return 'https://api-test.beichoo.com'
  } else if (location.host.indexOf('pin-stage.beichoo.com') !== -1) {
    return 'https://api-stage.beichoo.com'
  } else if (location.host.indexOf('pin.beichoo.com') !== -1) {
    return 'https://api.beichoo.com'
  }

  return 'https://api-test.beichoo.com'
}

const API_HOST = HOSTS()

const VERSION_B = '/1.0/'

const API_PATH = `${API_HOST}/1.0`

module.exports = {
  cookieName,
  API_PATH,
  HOSTS,
  VERSION_B,
}
