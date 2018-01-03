import React from 'react'
import PropTypes from 'prop-types'
import Trigger from 'component/dropdown/Trigger'
import styles from './AreaSelect.less'

const cityData = require('json/city.json')

class AreaSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      first: '',
      second: '',
      firstList: [],
      show: false,
    }
  }

  componentWillMount () {
    let arr = []
    cityData.forEach((item) => {
      arr.push(item.text)
    })
    this.setState({ firstList: arr })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.show !== this.state.show) {
      let obj = {
        show: nextProps.show,
      }
      if (obj.show) {
        obj.first = ''
        obj.second = ''
      }
      this.setState(obj)
    }
  }

  onFirstHover = (e) => {
    this.setState({
      first: e.target.innerHTML,
      second: '',
    })
  }

  onSecondHover = (e) => {
    this.setState({ second: e.target.innerHTML })
  }

  onFirstClick = (select) => {
    this.setState({
      show: false,
      first: select,
      second: '',
    })
  }

  onSecondClick = (select) => {
    let { onChange } = this.props
    this.setState({
      show: false,
      second: select,
    })
    let { first } = this.state
    onChange({ first, second: select, areaShow: false })
  }

  onThirdClick = (select) => {
    this.setState({
      show: false,
      first: '',
      second: '',
    })

    let { first, second } = this.state
    let { onChange } = this.props
    onChange({ first, second, third: select, areaShow: false })
  }

  getSecondList = () => {
    const { first, firstList } = this.state
    const index = firstList.indexOf(first)
    const secondData = cityData[index] ? cityData[index].children : []
    let arr = []
    secondData.forEach((item) => {
      arr.push(item.text)
    })
    return arr
  }

  getThirdList = () => {
    let { first, firstList, second } = this.state
    let secondList = this.getSecondList()
    let fIndex = firstList.indexOf(first)
    let secondData = cityData[fIndex] ? cityData[fIndex].children : []
    let sIndex = secondList.indexOf(second)
    let thirdData = secondData[sIndex] ? secondData[sIndex].children : []

    let arr = []
    thirdData.forEach((item) => {
      arr.push(item.text)
    })
    return arr
  }

  render () {
    const { show, firstList, first, second } = this.state

    let secondList = []
    let secondShow = false

    if (show && first) {
      secondList = this.getSecondList()
      secondShow = secondList.length > 0
    }

    let thirdList = []
    let thirdShow = false
    if (show && second) {
      thirdList = this.getThirdList()
      thirdShow = true
    }

    return (
      <div className={styles.area}>
        <div>
          <Trigger
            list={firstList}
            width="110px"
            height="120px"
            borderColor="#008CFF"
            show={show}
            onHover={this.onFirstHover}
          />
        </div>

        <div className={styles.secondSelect}>
          <Trigger
            list={secondList}
            width="178px"
            height="120px"
            borderColor="#008CFF"
            show={secondShow}
            onHover={this.onSecondHover}
            onThirdChange={this.onSecondClick}
          />
        </div>

        <div className={styles.thirdSelect}>
          <Trigger
            list={thirdList}
            width="178px"
            height="120px"
            borderColor="#008CFF"
            show={thirdShow}
            onThirdChange={this.onThirdClick}
          />
        </div>

      </div>
    )
  }
}

export default AreaSelect
