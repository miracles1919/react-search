import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'

const FocusDiv = ({ handleClick }) => {
  const jobText = ['用户运营', 'JAVA', 'UI', '设计师', 'PHP', '销售经理', '产品经理', 'C++', '内容运营']
  const comText = ['阿里巴巴', '腾讯', '百度', '网易', '华为', '京东', '新浪', '携程']

  const onMouseDown = (e) => {
    e.preventDefault()
  }

  return (
    <div className={styles.search}>
      <div className={styles.searchInner}>
        <div className={styles.hotSearch}>
          热门搜索
        </div>
        <div>
          <span className={styles.jobTextTitle}>岗位：</span>
          {
            jobText.map((item) => {
              return (
                <span
                  className={styles.jobTextTitle}
                  key={item}
                  onClick={handleClick.bind(this, 'function')}
                  onMouseDown={onMouseDown}
                >
                  {item}
                </span>
              )
            })
          }

        </div>
        <div>
          <span className={styles.jobTextTitle}>公司：</span>
          {
            comText.map(item =>
              <span
                className={styles.jobTextTitle}
                key={item}
                onClick={handleClick.bind(this, 'company')}
                onMouseDown={onMouseDown}
              >
                {item}
              </span>)
          }
        </div>
      </div>
    </div>
  )
}

export default class Search extends Component {

  constructor (props) {
    super(props)

    this.state = {
      search: '',
      focus: false,
    }
  }

  onChange = (e) => {
    this.setState({ search: e.target.value })
  }

  onKeyup = (e) => {
    if (e.keyCode === 13) {
      let { search } = this.state
      if (search) {
        this.onSelect(search)
        this.refs.searchInput.blur()
      }
    }
  }

  onSelect = (search) => {
    let { onSearch } = this.props
    this.setState({
      search,
      focus: false,
    })
    onSearch({
      search,
    })
  }

  onClick = (key, e) => {
    let { onLabel } = this.props
    let search = e.target.innerHTML
    this.setState({
      search,
      focus: false,
    })
    onLabel(key, {
      search,
    })
    this.refs.searchInput.blur()
  }

  onfocus = () => {
    this.setState({
      focus: true,
    })
  }

  onSearch = () => {
    let { onSearch } = this.props
    let { search } = this.state
    this.setState({
      search,
      focus: false,
    })
    onSearch({
      search,
    })
  }

  onblur = () => {
    setTimeout(() => {
      this.setState({
        focus: false,
      })
    }, 50)
  }

  onClear = () => {
    let state = { search: '' }
    this.setState(state)
    this.refs.searchInput.focus()
    let { onSearch } = this.props
    onSearch(state)
  }

  onClearMouseDown = (e) => {
    e.preventDefault()
  }

  onInitClick = () => {
    this.refs.searchInput.focus()
  }

  render () {
    const { focus, search } = this.state

    let iconShow = search && focus

    return (
      <div className={styles.searchWrap} onBlur={this.onblur}>
        <div className={styles.searchDiv}>
          <div>
            <input
              onChange={this.onChange}
              onFocus={this.onfocus}
              onKeyUp={this.onKeyup}
              type="text"
              className={styles.searchIput}
              value={search}
              ref="searchInput"
            />
            {
              iconShow ?
                <i className={styles.clearIcon} onClick={this.onClear} onMouseDown={this.onClearMouseDown} /> : null
            }
          </div>
          {
            !focus && !search ?
              <span className={styles.placeholder} onClick={this.onInitClick}>请输入岗位/公司</span> : null
          }
          <span className={styles.searchButton} onClick={this.onSearch}>搜索</span>
        </div>

        {
          focus ?
            <FocusDiv
              handleClick={this.onClick}
              show={focus}
            /> : null
        }

      </div>
    )
  }

}
