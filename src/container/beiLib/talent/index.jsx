import React, { Component } from 'react'
import { connect } from 'react-redux'
import ResumeList from '../talentList'

import style from './talent.less'
import styles from '../recommend/index.less'

import { talent, hasVerify } from 'service/talent'
import { fetchTalentResumes } from 'action/dailyRecommend'

import Pagination from '../../../component/pagination';
import Confirm from 'component/confirm';

import {fSetCookieMes,fGetCookieMes} from '../../../utils/common'

class Recommend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false, // 列表是否显示 true 显示 false 不显示
      page:1,
      maxPage:0,
      dataList: [],
      pagesObj: '',
      userStatus: props.userInfo,
      noVerifyShow: false, // 没有进行验证的confirm
      search_key: '',
    };
  }

  componentDidMount(){
    //请求人才期刊列表
    // this.get_data(1);
    // 是否进行认证，公司信息是否完善
    /*hasVerify({action: 'check'}).then(res => {
      const { success, data: [json] } = res
      this.setState({userStatus: json});
    })*/
    const { dispatch, searchKey } = this.props;
    dispatch(fetchTalentResumes({search_key: searchKey, page: 1}))
  }

  componentWillReceiveProps(nextProps){
    const { talentList, pagesObj, searchKey } = nextProps;
    this.setState({
      dataList: nextProps.talentList,
      pagesObj: nextProps.pagesObj,
      maxPage: nextProps.pagesObj && nextProps.pagesObj.page_max,
      search_key: searchKey,
      show: talentList.length ? true : false,
      userStatus: nextProps.userInfo
    })
  }

  getData = page => {
    const { dispatch } = this.props
    // console.log(this.state.search_key)
    this.setState({page});
    dispatch(fetchTalentResumes({search_key: this.state.search_key, page}))
  }

  get_data = (page) => {
    let thiz = this
    talent({
      page:page,
      pagesize:10
    }).then(result => {

      const { success, data, message } = result
      if (success) {
        // api调用成功
        if(data.length > 0){

          thiz.setState({
            show:true,
            page:data[1].page_num,
            maxPage:data[1].page_max,
            dataList:data[0]
          })
        }
      } else {
        // api调用失败
        console.log(message)
      }
    })
  }

  page_handle = (page) => {
     this.get_data(page)
  }

  geTalent = (e) => {
    e.stopPropagation();
    window.open(`https://${location.host}/s_store.html`);
  }

  render (){
    const { userStatus, noVerifyShow } = this.state;
    const { userInfo: {can_beichoo_super_talent} } = this.props;
    return <div className={style.container}>
      {
        can_beichoo_super_talent ?
          <div>
          <div className={style.talentList} style={{display:this.state.show?'block':'none'}}>
            {
              this.state.dataList.map((item, index) => <ResumeList
                key={index} {...item} jumpPageCb={(func, id) => {
                const { has_company_info, has_approve_company } = userStatus;
                if(has_company_info && has_approve_company){
                  func(id)
                  window.open(`${location.origin}/talent_resume_details.html?id=${id}&type=search`)
                }else{
                  this.setState({noVerifyShow: true});
                }
              }}
              />)
            }
            <div className={style.pag}>
              <div className={style.pagChlid}>
                {this.state.maxPage && <Pagination currentPage={this.state.page} totalPages={this.state.maxPage} pageCallback={this.getData}/>}
              </div>
            </div>
          </div>
          <div className={style.nolist} style={{display:this.state.show?'none':'block'}}>
             <img className={style.onbannnerImg} src={require('./img/onbanner.png')}/>
             <p className={style.nonTalent}>暂无人才</p>
             <p className={style.nonOne}>你的搜索内容过于严格，小辈暂时还没有找到这样的人才，</p>
             <p className={style.nonTwo}>试试更改搜索内容吧</p>
          </div>
          </div>
          :
          <div className={style.banner}>
            <img className={style.bannnerImg} src={require('./img/banner.png')}/>
            <div className={style.getTalent} onClick={this.geTalent.bind(this)}>立即抢人</div>
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
  }
}


const mapStateToProps = state => ({
  talentList: state.dailyRecommendResumes.resumes,
  pagesObj: state.dailyRecommendResumes.pages,
  searchKey: state.resumeParams.search_key,
  userInfo: state.userInfo
})

export default connect(mapStateToProps)(Recommend)
