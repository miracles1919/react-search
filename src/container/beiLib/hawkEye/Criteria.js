import React from 'react'
import PropTypes from 'prop-types'
import { RowItem } from 'component/hawkEye/criteria/RowItem'
import {
  Selected, LightLabel, WorkYear, UserArea, ExpectedArea, Degree, MyJob, Advance, Age, Salary, Sex, MultiBtn,
} from 'component/hawkEye/criteria/Row'
import { connect } from 'react-redux'
import {
  advanceTriggle, addSelect, deleteSelect, searchResume,
  getSelectInfo, setMultiSelect, changeInfo,
  modLocationReques,
} from 'action/hawkeye'
import lodash from 'lodash'

import styles from './Criteria.less'


/**
 * 搜索条件
 *
 */
const Criteria = ({
  dispatch,
  selected,
  advanceShow,
  info,
  multiSelect,
}) => {
  const {
    jobName, jobNameList,
    degreeList, lightList,
    residenceCheck, locationCheck, degreeCheck, lightCheck,
    residenceAdd, locationAdd,
  } = info
  const selectCol = lodash.cloneDeep(selected)
  delete selectCol.jobdetails
  delete selectCol.function
  delete selectCol.function_company
  delete selectCol.company

  const selectdKeys = Object.keys(selectCol)
  const isSelected = selectdKeys.length > 0

  const { residence, location, degree, light } = multiSelect

  const residenceList = info.residenceList.concat(residenceAdd)
  const locationList = info.locationList.concat(locationAdd)

  const onDeleteSelect = (e) => {
    const key = e.target.getAttribute('data-key')
    if (key) {
      dispatch(deleteSelect(key, selected))
    }
  }

  const onLabelSelect = (e) => {
    dispatch(addSelect({
      ...selected,
      light: e.target.innerHTML,
    }))
  }

  const onSenioritySelect = (e) => {
    dispatch(addSelect({
      ...selected,
      seniority: e.target.innerHTML,
    }))
  }

  const onResidenceSelect = (e) => {
    dispatch(addSelect({
      ...selected,
      residence: e.target.innerHTML,
    }))
  }

  const onLocationSelect = (e) => {
    dispatch(addSelect({
      ...selected,
      location: e.target.innerHTML,
    }))
  }

  const onDegreeSelect = (e) => {
    dispatch(addSelect({
      ...selected,
      degree: e.target.innerHTML,
    }))
  }

  const onGenderSelect = (e) => {
    dispatch(addSelect({
      ...selected,
      gender: e.target.innerHTML,
    }))
  }

  const onJobSelect = (e) => {
    let myjob = e.target.innerHTML
    let index = jobName.indexOf(myjob)
    let details = jobNameList[index]

    dispatch(addSelect({
      ...selected,
      jobdetails: details,
    }))
  }

  const onAdvanceClick = () => {
    dispatch(advanceTriggle())
  }

  // 多选
  const onMulti = (key) => {
    dispatch(setMultiSelect({ [key]: true }))
  }

  const onLightCheck = (id, val) => {
    lightCheck[id] = val
    dispatch(changeInfo({ lightCheck }))
  }

  const onResidenceCheck = (id, val) => {
    residenceCheck[id] = val
    dispatch(changeInfo({ residenceCheck }))
  }

  const onLocationCheck = (id, val) => {
    locationCheck[id] = val
    dispatch(changeInfo({ location }))
  }

  const onDegreeCheck = (id, val) => {
    degreeCheck[id] = val
    dispatch(changeInfo({ degree }))
  }

  // 取消
  const onCheckCancle = (key) => {
    dispatch(setMultiSelect({ [key]: false }))
    dispatch(changeInfo({ [`${key}Check`]: [] }))
  }

  // 确定
  const onLightSure = () => {
    let checkList = lightList.filter((item, index) => {
      return lightCheck[index] || false
    })

    if (checkList.length > 0) {
      let str = checkList.join(',')
      dispatch(addSelect({
        ...selected,
        light: str,
      }))
    } else {
      onCheckCancle('light')
    }
  }

  const onResidenceSure = () => {
    let checkList = residenceList.filter((item, index) => {
      return residenceCheck[index] || false
    })
    if (checkList.length > 0) {
      let str = checkList.join('|')
      dispatch(addSelect({
        ...selected,
        residence: str,
      }))
    } else {
      onCheckCancle('residence')
    }
  }

  const onLocationSure = () => {
    let checkList = locationList.filter((item, index) => {
      return locationCheck[index] || false
    })

    if (checkList.length > 0) {
      let str = checkList.join('|')
      dispatch(addSelect({
        ...selected,
        location: str,
      }))
    } else {
      onCheckCancle('location')
    }
  }

  const onDegreeSure = () => {
    let checkList = degreeList.filter((item, index) => {
      return degreeCheck[index] || false
    })

    if (checkList.length > 0) {
      let str = checkList.join(',')
      dispatch(addSelect({
        ...selected,
        degree: str,
      }))
    } else {
      onCheckCancle('degree')
    }
  }

  // 添加
  const onAreaAdd = (key, data) => {
    let params = {}
    let val = Object.values(data).join('/')
    if (key === 'residence') {
      params.action = 'add_residence'
      params.residence_txt = val
    } else if (key === 'location') {
      params.action = 'add_location'
      params.location_txt = val
    } else {
      return
    }

    dispatch(modLocationReques(params))
  }

  // 确认选择的工作年限
  const onWorkSure = (obj) => {
    let valArr = Object.values(obj).filter(item => item)
    valArr = valArr.map(item => parseInt(item))
    let seniority
    console.log('valArr', valArr)
    if (valArr.length === 2) {
      seniority = `${valArr.join('-')}年`
    } else if (valArr.length === 1) {
      if (obj.min) {
        seniority = `${valArr[0]}年以上`
      } else if (obj.max) {
        seniority = `${valArr[0]}年以下`
      }
    }

    dispatch(addSelect({
      ...selected,
      seniority,
    }))
  }

  // 确认选择的薪资
  const onSalarySure = (obj) => {
    let valArr = Object.values(obj).filter(item => item)
    valArr = valArr.map(item => parseInt(item))
    let salary
    if (valArr.length === 2) {
      salary = `${valArr.join('-')}k`
    } else if (valArr.length === 1) {
      if (obj.min) {
        salary = `${valArr[0]}k以上`
      } else if (obj.max) {
        salary = `${valArr[0]}k以下`
      }
    }

    dispatch(addSelect({
      ...selected,
      salary,
    }))
  }

  // 确认选择的年龄
  const onAgeSure = (obj) => {
    let valArr = Object.values(obj).filter(item => item)
    valArr = valArr.map(item => parseInt(item))
    let age
    if (valArr.length === 2) {
      age = `${valArr.join('-')}岁`
    } else if (valArr.length === 1) {
      if (obj.min) {
        age = `${valArr[0]}岁以上`
      } else if (obj.max) {
        age = `${valArr[0]}岁以下`
      }
    }
    dispatch(addSelect({
      ...selected,
      age,
    }))
  }

  // 地址清空
  const onClear = (key) => {
    let params = {
      del_all: true,
    }
    if (key === 'residence') {
      params.action = 'del_residence'
    } else if (key === 'location') {
      params.action = 'del_location'
    }
    dispatch(modLocationReques(params))
  }

  // 所有条件清空
  const allClear = () => {
    let fun = selected.function ? { function: selected.function } : {}
    let com = selected.company ? { company: selected.company } : {}
    let funAndCom = selected.function_company ? { function_company: selected.function_company } : {}
    dispatch(searchResume({ ...fun, ...com, ...funAndCom }))
  }

  const SelectedCol = {
    name: '已选条件',
    children: <Selected selected={selectCol} onClick={onDeleteSelect} onClear={allClear} />,
  }

  const columns = [{
    name: '亮点标签',
    key: 'light',
    isMulti: light,
    multiBtn:
      <MultiBtn
        onSure={onLightSure}
        onCancel={onCheckCancle.bind(this, 'light')}
      />,
    children:
      <LightLabel
        onClick={onLabelSelect}
        list={lightList}
        isMulti={light}
        checkList={lightCheck}
        onCheck={onLightCheck}
      />,
    config: [{
      span: '多选',
      show: !light,
      onClick: onMulti.bind(this, 'light'),
    }],
  }, {
    name: '工作年限',
    key: 'seniority',
    children:
      <WorkYear
        onClick={onSenioritySelect}
        onWorkSure={onWorkSure}
      />,
  }, {
    name: '所在地区',
    key: 'residence',
    isMulti: residence,
    multiBtn:
      <MultiBtn
        onSure={onResidenceSure}
        onCancel={onCheckCancle.bind(this, 'residence')}
      />,
    children:
      <UserArea
        onClick={onResidenceSelect}
        list={residenceList}
        isMulti={residence}
        checkList={residenceCheck}
        onCheck={onResidenceCheck}
        onAdd={onAreaAdd.bind(this, 'residence')}
        onClear={onClear.bind(this, 'residence')}
      />,
    config: [{
      span: '更多',
      show: false,
    }, {
      span: '多选',
      show: !residence,
      onClick: onMulti.bind(this, 'residence'),
    }],
  }, {
    name: '期望地区',
    key: 'location',
    isMulti: location,
    multiBtn:
      <MultiBtn
        onSure={onLocationSure}
        onCancel={onCheckCancle.bind(this, 'location')}
      />,
    children:
      <ExpectedArea
        onClick={onLocationSelect}
        list={locationList}
        isMulti={location}
        checkList={locationCheck}
        onCheck={onLocationCheck}
        onAdd={onAreaAdd.bind(this, 'location')}
        onClear={onClear.bind(this, 'location')}
      />,
    config: [{
      span: '更多',
      show: false,
    }, {
      span: '多选',
      show: !location,
      onClick: onMulti.bind(this, 'location'),
    }],
  }, {
    name: '学历',
    key: 'degree',
    isMulti: degree,
    multiBtn:
      <MultiBtn
        onSure={onDegreeSure}
        onCancel={onCheckCancle.bind(this, 'degree')}
      />,
    children:
      <Degree
        onClick={onDegreeSelect}
        list={degreeList}
        isMulti={degree}
        checkList={degreeCheck}
        onCheck={onDegreeCheck}
      />,
    config: [{
      span: '多选',
      show: !degree,
      onClick: onMulti.bind(this, 'degree'),
    }],
  }, {
    name: '我的职位',
    key: 'function',
    children: <MyJob list={jobName} onClick={onJobSelect} />,
  }, {
    name: '高级选项',
    key: 'advance',
    children: <Advance onClick={onAdvanceClick} show={advanceShow} />,
  }, {
    name: '期望薪资',
    key: 'salary',
    children: <Salary onSalarySure={onSalarySure} />,
    show: advanceShow,
  }, {
    name: '年龄',
    key: 'age',
    children: <Age onAgeSure={onAgeSure} />,
    show: advanceShow,
  }, {
    name: '性别',
    key: 'gender',
    children: <Sex onClick={onGenderSelect} />,
    show: advanceShow,
  }]

  return (

    <div className={styles.critera}>
      {
        isSelected ?
          <div>
            <RowItem {...SelectedCol} style={{ marginBottom: '2px' }} />
            <div className={styles.selectLine} />
          </div> : null
      }
      {
        columns.map((item, index) => {
          let { key } = item
          if (selectdKeys.indexOf(key) === -1) {
            //  高级选项---薪水、年龄、性别
            if (key === 'salary' || key === 'age' || key === 'gender') {
              if (advanceShow) {
                return (
                  <RowItem {...item} key={`row${index}`} />
                )
              }
            } else if (key === 'advance') {
              if (
                selectdKeys.indexOf('salary') === -1 ||
                selectdKeys.indexOf('age') === -1 ||
                selectdKeys.indexOf('gender') === -1
              ) {
                // 若高级选项都选择 则不显示高级选项
                return (
                  <div className={styles.avdanceLine} key={`row${index}`} >
                    <RowItem {...item} />
                  </div>
                )
              }
            } else if (key === 'function') {
              if (jobName.length > 0) {
                return (
                  <RowItem {...item} key={`row${index}`} />
                )
              }
            } else {
              // 普通选项
              return (
                <RowItem {...item} key={`row${index}`} />
              )
            }
          }
          return null
        })
      }
    </div>
  )
}

/**
 * 高阶组件
 * 为了使用componentDidMount生命周期
 */
const CriteriaHOC = WrappedComponent => class extends React.Component {
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(getSelectInfo())
  }

  render () {
    return (
      <WrappedComponent {...this.props} />
    )
  }
}

Criteria.propTypes = {
  dispatch: PropTypes.func,
  selected: PropTypes.object,
  advanceShow: PropTypes.bool,
  info: PropTypes.object,
  location: PropTypes.object,
  multiSelect: PropTypes.object,
}

const mapStateToprops = state => ({
  selected: state.hawkeyeSelected,
  advanceShow: state.advanceShow,
  info: state.selectedInfo,
  multiSelect: state.multiSelect,
})

export default connect(mapStateToprops)(CriteriaHOC(Criteria))
