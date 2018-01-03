import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Search from 'component/hawkEye/search'
import Confirm from 'component/confirm'
import { searchResume, addSelect } from 'action/hawkeye'
import Pagination from 'component/pagination'
import { fSetCookieMes } from 'utils/common'

import Criteria from './Criteria'
import ResumeList from '../talentList'

import style from  './index.less'
import styles from '../recommend/index.less'


class HawkEye extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      noVerifyShow: false,
    }
  }

  componentDidMount () {
    this.onSearch()
    fSetCookieMes('newPublish', 6)
  }

  onSearch = (params = {}) => {
    const { dispatch } = this.props
    let { search } = params
    if (search) {
      params.function_company = search
      delete params.search
    } else if (search === '') {
      params = {}
    }
    dispatch(searchResume(params))
  }

  onLabelSearch = (key, params) => {
    const { dispatch } = this.props
    let { search } = params
    if (search) {
      params[key] = search
      delete params.search
    }
    dispatch(searchResume(params))
  }

  onPageChange = (page) => {
    window.scrollTo(0, 0)
    let { selected, dispatch } = this.props
    dispatch(addSelect({
      ...selected,
      page,
    }))
  }

  render () {
    const { resumeData = [], userStatus } = this.props
    const resumeList = resumeData[0]
    const page = resumeData[1]
    const maxPage = resumeData[2]

    const { noVerifyShow } = this.state

    return (
      <div>
        <Search
          onSearch={this.onSearch}
          onLabel={this.onLabelSearch}
        />
        <Criteria />
        {
          resumeList ?
            resumeList.length > 0 ?
              resumeList.map((item, index) => {
                return (
                  <ResumeList
                    key={index} {...item} jumpPageCb={(func, id) => {
                    const { has_company_info, has_approve_company } = userStatus
                    if ( has_company_info && has_approve_company ) {
                      func(id)
                      window.open(`${location.origin}/talent_resume_details.html?id=${id}&type=search`)
                    } else {
                      this.setState({ noVerifyShow: true })
                    }
                  }}
                  />
                )
              }) :
              <div className={style.noResume}>
                <img className={style.logo} src={require('./img/no_talent.png')} alt="" />
                <p className={style.title}>暂无人才</p>
                <p className={style.txt}>您的筛选项过于严格，小辈暂时还没找到这样的人才，</p>
                <p className={style.txt}>试试更改筛选项</p>
              </div> : null
        }
        {
          maxPage > 0 &&
          <div className={style.page}>
            <Pagination currentPage={page} totalPages={maxPage} pageCallback={this.onPageChange}/>
          </div>
        }
        <Confirm show={noVerifyShow} handle={() => {this.setState({noVerifyShow: false})}}>
          <div className={styles.noVerify}>
            <p className={styles.title}>为保护人才隐私 <br/> 需要企业认证后才能查看简历详情哦</p>
            <div className={styles.toVerify}>
              <div>
                <img src={require('./img/not.png')} />
                <span>完成企业认证</span>
                {
                  userStatus.has_approve_company ? <span className={styles.btn}>已认证</span> : <a href={`${location.origin}/channel_manager.html`}>未认证</a>
                }
              </div>
              <div>
                <img src={require('./img/not.png')} />
                <span>完善公司信息</span>
                {
                  userStatus.has_company_info ? <span className={styles.btn}>已完善</span> : <a href={`${location.origin}/setting.html?company`}>未完善</a>
                }
              </div>
            </div>
          </div>
        </Confirm>
      </div>
    )
  }
}


const mapStateToprops = state => ({
  resumeData: state.resumeData,
  userStatus: state.userInfo,
  selected: state.hawkeyeSelected,
})

export default connect(mapStateToprops)(HawkEye)
