import { ADVANCE_TRIGGLE, ADD_SELECT, DELETE_SELECT, CLEAR_ALL_SELECT, CHANGE_INFO, SET_RESUME_LIST, SET_MULTI_SELECT, SET_INFO_LIST, ADD_LOCATION, CLEAR_LOCATION, SET_MULTI_INFO, ADVANCE_HIDE } from '../action/hawkeye'
// import { changeState } from '../action/hawkeye'

const hawkeyeSelected = (state = {}, action = {}) => {
  switch (action.type) {
    case ADD_SELECT:
      return { ...state, ...action.payload }
    case DELETE_SELECT:
      delete state[action.payload]
      return { ...state }
    case CLEAR_ALL_SELECT:
      return {}
    default:
      return state
  }
}

const advanceShow = (state = false, action) => {
  switch (action.type) {
    case ADVANCE_TRIGGLE:
      return !state
    case ADVANCE_HIDE:
      return false
    default:
      return state
  }
}


const initInfo = {
  residenceCheck: [],
  locationCheck: [],
  degreeCheck: [],
  lightCheck: [],
  residenceList: ['北京', '上海', '广州', '杭州', '深圳', '成都', '苏州'],
  degreeList: ['高中', '大专', '本科', '硕士', '博士'],
  locationList: ['北京', '上海', '广州', '杭州', '深圳', '成都', '苏州'],
  lightList: ['优选人才', '总监／主管', '知名院校', '副总裁/合伙人', '总裁/创始人', '海外名校'],
  residenceAdd: [],
  locationAdd: [],
  jobNameList: [],
  jobName: [],
}
const selectedInfo = (state = initInfo, action) => {
  switch (action.type) {
    case CHANGE_INFO:
      return { ...state, ...action.payload }
    case SET_INFO_LIST:
      return {
        ...state,
        ...{ residenceList: initInfo.residenceList.concat(action.residenceList) },
      }
    case ADD_LOCATION:
      return { ...state, ...{ [action.key]: [...state[action.key], ...action.val] } }
    case CLEAR_LOCATION:
      return { ...state, ...{ [action.key]: [] } }
    default:
      return state
  }
}

const resumeData = (state = [], action) => {
  switch (action.type) {
    case SET_RESUME_LIST:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const initMulti = {
  residence: false,
  location: false,
  degree: false,
  light: false,
}
const multiSelect = (state = initMulti, action) => {
  switch (action.type) {
    case SET_MULTI_SELECT:
      return { ...state, ...action.payload }
    case SET_MULTI_INFO:
      return initMulti
    default:
      return state
  }
}

module.exports = {
  hawkeyeSelected,
  advanceShow,
  selectedInfo,
  resumeData,
  multiSelect,
}
