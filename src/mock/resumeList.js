import { API } from 'utils/config'

const Mock = require('mockjs')

let resumeList = [1, 2, 3]

console.log('resume', resumeList)

module.exports = {
  [`GET ${API}/resumeList`] (req, res) {
    res.json({ code: 0, data: { resumeList } })
  },
}
