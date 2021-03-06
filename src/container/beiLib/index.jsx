import React, { Component } from 'react'
import styles from './index.less'
import { connect } from 'react-redux'
import { getResume } from 'service/hawkeye'
import Header from './header'

class BeiLib extends Component {
  componentDidMount () {
    getResume().then((res) => {
      console.log(res)
    })
  }

  render () {
    const { location, dispatch, resumeParams, userInfo } = this.props
    return (
      <div className={styles.beichoo_resource}>
        <Header location={location} dispatch={dispatch} resumeParams={resumeParams} userInfo={userInfo} />
        <div className={styles.childCon}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  resumeParams: state.resumeParams,
  userInfo: state.userInfo,
})

export default connect(mapStateToProps)(BeiLib)
