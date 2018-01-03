import lodash from 'lodash'
import { getSelected, searchResumeList, modLocation } from 'service/hawkeye'

/*
 * action
 */
export const CHANGE_STATE = 'CHANGE_STATE'
export const ADVANCE_TRIGGLE = 'ADVANCE_TRIGGLE'
export const ADVANCE_HIDE = 'ADVANCE_HIDE'

export const ADD_SELECT = 'ADD_SELECT'
export const DELETE_SELECT = 'DELETE_SELECT'
export const CLEAR_ALL_SELECT = 'CLEAR_ALL_SELECT'

export const CHANGE_INFO = 'CHANGE_INFO'
export const SET_INFO_LIST = 'SET_INFO_LIST'

export const SET_RESUME_LIST = 'SET_RESUME_LIST'
export const SET_MULTI_SELECT = 'SET_MULTI_SELECT'
export const SET_MULTI_INFO = 'SET_MULTI_INFO'
export const CLEAR_CHECK = 'CLEAR_CHECK'

export const ADD_LOCATION = 'ADD_LOCATION'
export const CLEAR_LOCATION = 'CLEAR_LOCATION'

/*
 * action 生成函数
 */
export const changeState = (params) => {
  return {
    type: CHANGE_STATE,
    payload: params,
  }
}

// 设置简历数据
const setResumeList = (params) => {
  return {
    type: SET_RESUME_LIST,
    payload: params,
  }
}

// 增加选择
const addSelectLabel = (params) => {
  return {
    type: ADD_SELECT,
    payload: params,
  }
}

const deleteSelectLabel = (params) => {
  return {
    type: DELETE_SELECT,
    payload: params,
  }
}

const clearSelectLabel = () => {
  return {
    type: CLEAR_ALL_SELECT,
  }
}

// 处理选择字段
const dealMyJob = (myjob) => {
  let jobFilter =
    ['age_to', 'age_from', 'area_txt', 'degree_from', 'gender', 'residence',
      'salary_from', 'salary_to', 'work_year', 'degree_from']
  let jobParams = {}

  jobFilter.forEach((key) => {
    let val = myjob[key]
    if (val && val !== '不限') {
      jobParams[key] = val
    }
  })

  let { salary_from, salary_to, age_from, age_to, gender, area_txt, work_year, degree_from } = jobParams

  if (salary_from) {
    jobParams.salary_begin = `salary_begin>=${salary_from}`
    delete jobParams.salary_from
  }

  if (salary_to) {
    jobParams.salary_end = `salary_begin>=${salary_to}`
    delete jobParams.salary_to
  }

  if (age_from && age_to) {
    jobParams.age = `age>=${age_from} AND age<=${age_to}`
  } else if (age_from) {
    jobParams.age = `age>=${age_from} AND age<=${age_from}`
  } else if (age_to) {
    jobParams.age = `age>=${age_to} AND age<=${age_to}`
  }

  delete jobParams.age_from
  delete jobParams.age_to

  if (gender) {
    let str2int = {
      男: '0',
      女: '1',
    }
    jobParams.gender = `gender=${str2int[gender]}`
  }

  if (area_txt) {
    jobParams.location = area_txt
    delete jobParams.area_txt
  }

  if (work_year) {
    let match = work_year.match(/\d+/g)
    if (match.length === 1) {
      if (work_year.indexOf('以上') !== -1) {
        jobParams.seniority = `seniority>=${match[0]}`
      } else if (work_year.indexOf('一下') !== -1) {
        jobParams.seniority = `seniority<=${match[0]}`
      }
    } else if (match.length === 2) {
      jobParams.seniority = `${match[0]}<=seniority AND seniority<=${match[1]}`
    }
    delete jobParams.work_year
  }

  if (degree_from) {
    let str2int = {
      高中: '21',
      大专: '24',
      本科: '30',
      硕士: '40',
      博士: '41',
    }
    jobParams.degree = str2int[degree_from]
    delete jobParams.degree_from
  }

  return jobParams
}

const dealSearchParams = (select) => {
  let newSelect = lodash.cloneDeep(select)
  let jobParams = {}
  let myjob = newSelect.jobdetails

  if (myjob) {
    jobParams = dealMyJob(myjob)
  }

  let {
    seniority, salary, gender, degree, light, age,
  } = select

  if (seniority) {
    let match = seniority.match(/\d+/g)
    if (match.length === 1) {
      if (seniority.indexOf('以上') !== -1) {
        newSelect.seniority = `seniority>=${match[0]}`
      } else if (seniority.indexOf('以下') !== -1) {
        newSelect.seniority = `seniority<=${match[0]}`
      }
    } else if (match.length === 2) {
      newSelect.seniority = `${match[0]}<=seniority AND seniority<=${match[1]}`
    }
  }

  if (salary) {
    let match = salary.match(/\d+/g)
    if (match.length === 1) {
      if (salary.indexOf('以上') !== -1) {
        newSelect.salary_begin = `salary_begin>=${match[0] * 1000}`
      } else if (salary.indexOf('以下') !== -1) {
        newSelect.salary_end = `salary_end<=${match[0] * 1000}`
      }
    } else if (match.length === 2) {
      newSelect.salary_begin = `salary_begin>=${match[0] * 1000}`
      newSelect.salary_end = `salary_end<=${match[1] * 1000}`
    }

    delete newSelect.salary
  }

  if (age) {
    let match = age.match(/\d+/g)
    console.log('arr', age)

    if (match.length === 1) {
      if (age.indexOf('以上') !== -1) {
        newSelect.age = `age>=${match[0]}`
      } else if (age.indexOf('以下') !== -1) {
        newSelect.age = `age<=${match[0]}`
      }
    } else if (match.length === 2) {
      newSelect.age = `${match[0]}<=age AND age<=${match[1]}`
    }
  }

  if (gender) {
    let str2int = {
      男: '0',
      女: '1',
    }
    newSelect.gender = `gender=${str2int[gender]}`
  }

  if (degree) {
    let arr = degree.split(',')
    let str2int = {
      高中: '21',
      大专: '24',
      本科: '30',
      硕士: '40',
      博士: '41',
    }
    arr = arr.map(item => str2int[item])
    newSelect.degree = arr.join('|')
  }

  if (light) {
    let lightArr = newSelect.light.split(',')

    let select2search = {
      优选人才: { feedback_time: `feedback_time>${parseInt(new Date().getTime() / 1000)}` },
      '总监／主管': { function_level: 'function_level=2' },
      '副总裁/合伙人': { function_level: 'function_level=3' },
      '总裁/创始人': { function_level: 'function_level=4' },
      海外名校: { school_level: '2' },
      知名院校: { school_level: '1' },
    }

    let function_arr = lightArr.filter(item => ['总监／主管', '副总裁/合伙人', '总裁/创始人'].indexOf(item) !== -1)
    let school_arr = lightArr.filter(item => ['海外名校', '知名院校'].indexOf(item) !== -1)

    if (function_arr.length > 0) {
      function_arr = function_arr.map(item => select2search[item].function_level)
      newSelect.function_level = function_arr.join(' OR ')
    }

    if (school_arr.length > 0) {
      school_arr = school_arr.map(item => select2search[item].school_level)
      newSelect.school_level = school_arr.join('|')
    }

    if (lightArr.indexOf('优选人才') !== -1) {
      newSelect.feedback_time = select2search['优选人才'].feedback_time
    }


    newSelect.light = light
  }

  delete newSelect.jobdetails

  return { ...newSelect, ...jobParams }
}

const searchToSelect = (params) => {
  let {
    age, area_txt, salary_begin, salary_end,
    location, residence, seniority, gender, degree,
    light,
  } = params
  let select = {}
  if (age) {
    let match = age.match(/\d+/g)
    select.age = `${match[0]}-${match[1]}岁`
  }

  if (salary_begin && salary_end) {
    select.salary = `${salary_begin.match(/\d+/g)[0] / 1000}~${salary_end.match(/\d+/g)[0] / 1000}k`
  } else if (salary_begin) {
    select.salary = `${salary_begin.match(/\d+/g)[0] / 1000}k以上`
  } else if (salary_end) {
    select.salary = `${salary_end.match(/\d+/g)[0] / 1000}k以下`
  }

  if (area_txt) {
    select.location = area_txt
  }

  if (residence) {
    select.residence = residence
  }

  if (location) {
    select.location = location
  }

  if (seniority) {
    let match = seniority.match(/\d+/g)
    if (match.length === 1) {
      if (seniority.indexOf('>=') !== -1) {
        select.seniority = `${match[0]}年以上`
      } else if (seniority.indexOf('<=') !== -1) {
        select.seniority = `${match[0]}年以下`
      }
    } else if (match.length === 2) {
      select.seniority = `${match[0]}-${match[1]}年`
    }
  }

  if (age) {
    let match = age.match(/\d+/g)
    if (match.length === 1) {
      if (age.indexOf('>=') !== -1) {
        select.age = `${match[0]}岁以上`
      } else if (age.indexOf('<=') !== -1) {
        select.age = `${match[0]}岁以下`
      }
    } else if (match.length === 2) {
      select.age = `${match[0]}-${match[1]}岁`
    }
  }

  if (gender) {
    let int2str = {
      0: '男',
      1: '女',
      男: '男',
      女: '女',
    }
    let arr = gender.split('=')
    select.gender = int2str[arr[1]]
  }

  if (degree) {
    let arr = degree.split('|')
    let int2str = {
      21: '高中',
      24: '大专',
      30: '本科',
      40: '硕士',
      41: '博士',
    }
    arr = arr.map(item => int2str[item])
    select.degree = arr.join(',')
  }

  if (light) {
    select.light = light
  }

  return select
}

const setInitMulti = () => {
  return {
    type: SET_MULTI_INFO,
  }
}

const setMulti = (multi) => {
  return {
    type: SET_MULTI_SELECT,
    payload: multi,
  }
}

export const advanceTriggle = () => {
  return {
    type: ADVANCE_TRIGGLE,
  }
}

const advanceHide = () => {
  return {
    type: ADVANCE_HIDE,
  }
}

export const setMultiSelect = (multi) => dispatch => {
  dispatch(setInitMulti())
  dispatch(advanceHide())
  dispatch(setMulti(multi))
}

export const changeInfo = (info) => {
  return {
    type: CHANGE_INFO,
    payload: info,
  }
}


export const addSelect = params => dispatch => {
  let searchParams = dealSearchParams(params)
  searchResumeList(searchParams)
    .then((result) => {
      let { success, data } = result
      if (success) {
        // dispatch 选择的字段
        let selectParams = searchToSelect(searchParams)

        delete selectParams.jobdetails
        dispatch(addSelectLabel(selectParams))

        // dispatch 简历数据
        dispatch(setResumeList(data))

        dispatch(setInitMulti())
        dispatch(advanceHide())

        dispatch(changeInfo({
          residenceCheck: [],
          locationCheck: [],
          degreeCheck: [],
          lightCheck: [],
        }))

        // let { residence, location, degree, light } = searchParams
        // if (residence) {
        //
        // }
        // if (location) {
        //   dispatch(changeInfo({ locationCheck: [] }))
        // }
        // if (degree) {
        //   dispatch(changeInfo({ degreeCheck: [] }))
        // }
        // if (light) {
        //   dispatch(changeInfo({ lightCheck: [] }))
        // }
      }
    })
}

export const deleteSelect = (key, selected) => dispatch => {
  delete selected[key]
  dispatch(addSelect(selected))
  dispatch(deleteSelectLabel(key))
}

// 获取简历
export const searchResume = (params) => dispatch => {
  searchResumeList(params)
    .then((result) => {
      let { success, data } = result
      if (success) {
        // dispatch 简历数据
        dispatch(clearSelectLabel())
        dispatch(setResumeList(data))

        dispatch(setInitMulti())
        dispatch(advanceHide())

        if (params && params.function) {
          dispatch(addSelectLabel({ function: params.function }))
        } else if (params && params.function_company) {
          dispatch(addSelectLabel({ function_company: params.function_company }))
        } else if (params && params.company) {
          dispatch(addSelectLabel({ company: params.company }))
        }
      }
    })
}

const dealJobNameList = (list = []) => {
  let arr = []
  list.forEach((item) => {
    arr.push(item.function)
  })
  return arr
}

const addLoaction = (key, val) => {
  return {
    type: ADD_LOCATION,
    key,
    val,
  }
}

const clearLocation = (key) => {
  return {
    type: CLEAR_LOCATION,
    key,
  }
}

export const getSelectInfo = () => dispatch => {
  getSelected()
    .then((json) => {
      let { success, data } = json
      if (success) {
        const jobNameList = data[0].job_name_list
        const jobName = dealJobNameList(jobNameList)
        const residenceAdd = data[0].residence_list
        const locationAdd = data[0].location_list
        dispatch(changeInfo({
          jobNameList,
          jobName,
        }))
        dispatch(addLoaction('residenceAdd', residenceAdd))
        dispatch(addLoaction('locationAdd', locationAdd))
      }
    })
}

export const modLocationReques = (params) => dispatch => {
  modLocation(params)
    .then((res) => {
      let { success } = res
      if (success) {
        let { action } = params
        let [actionType, type] = action.split('_')
        if (actionType === 'add') {
          let val
          if (type === 'residence') {
            val = params.residence_txt
          } else if (type === 'location') {
            val = params.location_txt
          }
          dispatch(addLoaction(`${type}Add`, [val]))
        } else if (actionType === 'del') {
          dispatch(clearLocation(`${type}Add`))
        }

        dispatch(setInitMulti())
        dispatch(advanceHide())
      }
    })
}

