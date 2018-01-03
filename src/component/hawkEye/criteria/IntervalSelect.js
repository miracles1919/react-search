import React from 'react'
import PropTypes from 'prop-types'
import DropDown from 'component/dropdown'
import styles from './IntervalSelect.less'

/**
 * 区间选择
 */
export default class IntevalSelect extends React.Component{
  constructor (props) {
    super(props)
    this.state = {
      min: false,
      max: false,
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isClear) {
      let { onSelect } = this.props
      onSelect({ isClear: false })
      this.setState({
        min: false,
        max: false,
      })
    }
  }

  onMinChange = (val) => {
    this.setState({ min: val })
    let { onSelect } = this.props
    if (onSelect) {
      onSelect({ min: val, btnShow: true })
    }
  }

  onMaxChange = (val) => {
    this.setState({ max: val })
    let { onSelect } = this.props
    if (onSelect) {
      onSelect({ max: val, btnShow: true })
    }
  }

  render () {
    const { list, name } = this.props
    const [firstName, lastName] = name
    const { min, max } = this.state
    let minList = list
    let maxList = list

    if (min && !max) {
      maxList = list.filter((item) => parseInt(item) >= parseInt(min))
    } else if (max && !min) {
      minList = list.filter((item) => parseInt(item) <= parseInt(max))
    } else if (min && max) {
      maxList = list.filter(item => parseInt(item) >= parseInt(min) && parseInt(item) <= parseInt(max))
      minList = maxList
    }

    return (
      <div className={styles.selectDiv}>
        <DropDown
          width="70px"
          name={firstName}
          list={minList}
          onSelect={this.onMinChange}
        />
        <div className={styles.line} />
        <DropDown
          width="70px"
          name={lastName}
          list={maxList}
          onSelect={this.onMaxChange}
        />
      </div>
    )
  }
}

IntevalSelect.propTypes = {
  name: PropTypes.array,
  list: PropTypes.array,
}
