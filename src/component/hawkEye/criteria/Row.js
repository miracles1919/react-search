import React from 'react'
import PropTypes from 'prop-types'
import DropDown from 'component/dropdown'
import Checkbox from 'component/checkbox'
import lodash from 'lodash'

import { Button } from './RowItem'
import IntevalSelect from './IntervalSelect'
import AreaSelect from './AreaSelect'
import styles from './Row.less'


/**
 * 将添加按钮和地区选择封装成一个高阶组件
 */
const AreaSelectHOC = WrappedComponent => class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      areaShow: false,
    }
  }

  onClick = () => {
    this.setState({
      areaShow: true,
      first: '',
    })
  }

  onBlur = () => {
    console.log('blur')
    this.setState({
      areaShow: false,
    })
  }

  onSelect = (newState) => {
    this.setState(newState)
    let { onChange } = this.props
    if (onChange) {
      let state = lodash.cloneDeep(newState)
      delete state.areaShow
      onChange(state)
    }
  }

  render () {
    const { areaShow } = this.state

    return (
      <div
        className={styles.areaDiv}
        onBlur={this.onBlur}
      >
        <div className={styles.areaAdd}>
          <Button
            name="添加"
            onClick={this.onClick.bind(this)}
          />
        </div>
        <WrappedComponent{...this.props} show={areaShow} onChange={this.onSelect} />
      </div>

    )
  }
}

const BtnAreaSelect = AreaSelectHOC(AreaSelect)


/**
 * 已选择
 */
const Selected = ({ selected, onClick, onClear }) => {
  const arr = Object.entries(selected)

  const En2Cn = {
    seniority: '工作年限',
    residence: '所在地区',
    location: '期望地区',
    degree: '学历',
    gender: '性别',
    salary: '期望薪资',
    age: '年龄',
    light: '亮点标签',
  }
  return (
    <div>
      {
        arr.map((item, index) => {
          const [key, value] = item
          return (
            <div className={styles.selectedLabel} key={`selecte${index}`}>
              <div className={styles.key}>{En2Cn[key]}</div>
              <div className={styles.value}>
                {
                  value.length >= 30 ? `${value.substring(0, 31)}...` : value
                }
                <i className={styles.close} onClick={onClick} data-key={key} />
              </div>
            </div>
          )
        })
      }
      <span className={styles.allClear} onClick={onClear}>全部清除</span>
    </div>
  )
}

const LightLabel = ({ onClick, list, isMulti, checkList, onCheck }) => {
  // const label = ['优选人才', '总监／主管', '考虑创业公司', '知名职业', '知名院校', '副总裁/合伙人', '总裁/创始人', '上市公司', '海外名校']
  const label = ['优选人才', '总监／主管', '知名院校', '副总裁/合伙人', '总裁/创始人', '海外名校']
  return (
    <div>
      {list.map((item, index) => {
        return (
          <div className={styles.multi} key={`labelCheck${index}`}>
            {
              isMulti ?
                <div className={styles.check}>
                  <Checkbox
                    id={`labelCheck${index}`}
                    checked={checkList[index] || false}
                    handle={onCheck.bind(this, index)}
                  />
                </div> : null
            }
            <div>
              <span
                key={`label${index}`}
                className={styles.lightSpan}
                onClick={onClick}
              >
                {item}
              </span>
            </div>
          </div>

        )
      })}
    </div>
  )
}

const getWorkList = () => {
  let arr = []
  for (let i = 0; i <= 50; i++) {
    arr.push(`${i}年`)
  }
  return arr
}
const workYearList = getWorkList()


const workYear = ({ onClick, onSelect, btnShow, onSure, onClear, name, isClear }) => {
  const work = ['1-2年', '3-5年', '6-10年']
  return (
    <div className={styles.work}>
      {
        work.map((item, index) => {
          return (
            <span
              key={`work${index}`}
              className={styles.workSpan}
              onClick={onClick}
            >
              {item}
            </span>
          )
        })
      }
      <div className={styles.selectDiv}>
        <IntevalSelect
          name={name}
          list={workYearList}
          onSelect={onSelect}
          isClear={isClear}
        />
      </div>
      {
        btnShow ?
          <div>
            <Button name="确定" onClick={onSure} />
            <Button name="清空" onClick={onClear} />
          </div> : null
      }
    </div>
  )
}

const WorkYearHoc = WrappedComponent => class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      min: '最低年限',
      max: '最高年限',
      btnShow: false,
      isClear: false,
    }
  }

  onSelect = (newState) => {
    this.setState(newState)
  }

  onSure = () => {
    let { onWorkSure } = this.props
    let { min, max } = this.state

    if (min === '最低年限') {
      min = ''
    }
    if (max === '最高年限') {
      max = ''
    }

    if (onWorkSure) {
      onWorkSure({
        min,
        max,
      })
    }
  }

  onClear = () => {
    let obj = {
      min: '最低年限',
      max: '最高年限',
      btnShow: false,
      isClear: true,
    }
    this.setState(obj)
  }

  render () {
    const { btnShow, min, max, isClear } = this.state

    return (
      <WrappedComponent
        {...this.props}
        btnShow={btnShow}
        onSelect={this.onSelect}
        onSure={this.onSure}
        onClear={this.onClear}
        name={[min, max]}
        isClear={isClear}
      />
    )
  }
}

const WorkYear = WorkYearHoc(workYear)

/**
 * 所在地区
 */
const UserArea = ({ onClick, list, isMulti, checkList, onCheck, onAdd, onClear }) => {

  return (
    <div>
      {
        list.map((item, index) => {
          return (
            <div className={styles.multi} key={`residenceCheck${index}`}>
              {
                isMulti ?
                  <div className={styles.check}>
                    <Checkbox
                      id={`residenceCheck${index}`}
                      checked={checkList[index] || false}
                      handle={onCheck.bind(this, index)}
                    />
                  </div> : null
              }
              <div>
                <span
                  className={styles.workSpan}
                  onClick={onClick}
                >
                {item}
              </span>
              </div>
            </div>
          )
        })
      }
      <div className={styles.areaAndClear}>
        <BtnAreaSelect onChange={onAdd} />
        {
          list.length > 7 ?
            <Button name="清空" onClick={onClear} /> : null
        }
      </div>
    </div>
  )
}

/**
 * 期望地区
 */
const ExpectedArea = ({ onClick, list, isMulti, checkList, onCheck, onAdd, onClear }) => {
  return (
    <div>
      {
        list.map((item, index) => {
          return (
            <div className={styles.multi} key={`locationCheck${index}`}>
              {
                isMulti ?
                  <div className={styles.check}>
                    <Checkbox
                      id={`locationCheck${index}`}
                      checked={checkList[index] || false}
                      handle={onCheck.bind(this, index)}
                    />
                  </div> : null
              }
              <div>
                <span
                  className={styles.workSpan}
                  onClick={onClick}
                >
                  {item}
                </span>
              </div>
            </div>
          )
        })
      }
      <div className={styles.areaAndClear}>
        <BtnAreaSelect onChange={onAdd} />
        {
          list.length > 7 ?
            <Button name="清空" onClick={onClear} /> : null
        }
      </div>
    </div>
  )
}


const Degree = ({ onClick, list, isMulti, checkList, onCheck }) => {
  return (
    <div>
      {
        list.map((item, index) => {
          return (
            <div className={styles.multi} key={`degreeCheck${index}`} >
              {
                isMulti ?
                  <div className={styles.check}>
                    <Checkbox
                      id={`degreeCheck${index}`}
                      checked={checkList[index] || false}
                      handle={onCheck.bind(this, index)}
                    />
                  </div> : null
              }
              <div>
                <span
                  key={`degree${index}`}
                  className={styles.workSpan}
                  onClick={onClick}
                >
                  {item}
                </span>
              </div>
            </div>

          )
        })
      }
    </div>
  )
}

const MyJob = ({ list = [], onClick }) => {
  return (
    <div>
      {
        list.map((item, index) => {
          return (
            <span
              key={`job${index}`}
              className={styles.workSpan}
              onClick={onClick}
            >
              {item}
            </span>
          )
        })
      }
    </div>
  )
}

/**
 * 高级选项
 */
const Advance = ({ onClick, show }) => {
  const classname = show ? `${styles.arrow} ${styles.arrowDown}` : styles.arrow

  return (
    <div>
      <p className={styles.advanceSpan} onClick={onClick}>
        （期望薪资/年龄/性别）
        <i className={classname} />
      </p>
    </div>
  )
}

const getAgeList = () => {
  let arr = []
  for (let i = 16; i <= 60; i++) {
    arr.push(i)
  }
  return arr
}

const ageList = getAgeList()

const age = ({ onSelect, btnShow, onSure, onClear, name, isClear }) => {

  return (
    <div className={styles.age}>
      <IntevalSelect
        name={name}
        list={ageList}
        onSelect={onSelect}
        isClear={isClear}
      />
      {
        btnShow ?
          <div>
            <Button name="确定" onClick={onSure} />
            <Button name="清空" onClick={onClear} />
          </div> : null
      }
    </div>
  )
}

const AgeHoc = WrappedComponent => class extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      btnShow: false,
      min: '最低年龄',
      max: '最高年龄',
      isClear: false,
    }
  }

  onSelect = (newState) => {
    this.setState(newState)
  }

  onSure = () => {
    let { onAgeSure } = this.props
    let { min, max } = this.state

    if (min === '最低年龄') {
      min = ''
    }
    if (max === '最高年龄') {
      max = ''
    }

    if (onAgeSure) {
      onAgeSure({
        min,
        max,
      })
    }
  }

  onClear = () => {
    this.setState({
      btnShow: false,
      min: '最低年龄',
      max: '最高年龄',
      isClear: true,
    })
  }

  render () {
    const { btnShow, min, max, isClear } = this.state

    return (
      <WrappedComponent
        {...this.props}
        btnShow={btnShow}
        onSelect={this.onSelect}
        onSure={this.onSure}
        onClear={this.onClear}
        name={[min, max]}
        isClear={isClear}
      />
    )
  }
}

const Age = AgeHoc(age)

const getSalaryList = () => {
  let arr = []
  for (let i = 1; i <= 70; i++) {
    arr.push(`${i}k`)
  }
  return arr
}

const salaryList = getSalaryList()

const salary = ({ onSelect, btnShow, onSure, onClear, name, isClear }) => {

  return (
    <div className={styles.salary}>
      <IntevalSelect
        name={name}
        list={salaryList}
        onSelect={onSelect}
        isClear={isClear}
      />
      {
        btnShow ?
          <div>
            <Button name="确定" onClick={onSure} />
            <Button name="清空" onClick={onClear} />
          </div> : null
      }
    </div>
  )
}

const SalaryHoc = WrappedComponent => class extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      btnShow: false,
      min: '最低薪资',
      max: '最高薪资',
      isClear: false,
    }
  }

  onSelect = (newState) => {
    this.setState(newState)
  }

  onSure = () => {
    let { onSalarySure } = this.props
    let { min, max } = this.state

    if (min === '最低薪资') {
      min = ''
    }
    if (max === '最高薪资') {
      max = ''
    }

    if (onSalarySure) {
      onSalarySure({
        min,
        max,
      })
    }
  }

  onClear = () => {
    this.setState({
      btnShow: false,
      min: '最低薪资',
      max: '最高薪资',
      isClear: true,
    })
  }

  render () {
    const { btnShow, min, max, isClear } = this.state

    return (
      <WrappedComponent
        {...this.props}
        btnShow={btnShow}
        onSelect={this.onSelect}
        onSure={this.onSure}
        onClear={this.onClear}
        name={[min, max]}
        isClear={isClear}
      />
    )
  }
}

const Salary = SalaryHoc(salary)


const Sex = ({ onClick }) => {
  const sex = ['男', '女']
  return (
    <div>
      {
        sex.map((item) => {
          return (
            <span
              key={item}
              className={styles.workSpan}
              onClick={onClick}
            >
              {item}
            </span>
          )
        })
      }
    </div>
  )
}

const MultiBtn = ({ onSure, onCancel }) => {
  return (
    <div>
      <Button
        name="确定"
        onClick={onSure}
      />
      <Button
        name="取消"
        onClick={onCancel}
      />
    </div>
  )
}

module.exports = {
  Selected,
  LightLabel,
  WorkYear,
  UserArea,
  ExpectedArea,
  Degree,
  MyJob,
  Advance,
  Age,
  Salary,
  Sex,
  MultiBtn,
}
