import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import cs from 'classnames'
import { fSetCookieMes } from 'utils/common'
import { dailyFreeResume, careers, noInterestResume, hasVerify, invite_intro, completeInvite } from 'service/beiLib'

import { fetchDailyResumes } from 'action/dailyRecommend'

import ResumeList from '../listItem'
import Checkbox from 'component/checkbox'
import Loading from 'component/loading'
import Confirm from 'component/confirm'

import styles from './index.less'

const NeedCareer = props => (
  <div className={styles.needSupply}>
    <div className={styles.imgCon}>
      <img src={require('./imgs/bees.png')} />
    </div>
    <p className={styles.title}>暂无推荐简历</p>
    {
      props.noCareer ?
        <p className={styles.detail}>新增职位获取小辈智能推荐</p>
        :
        <p className={styles.detail}>您的职位信息过于简单，小辈无法为您推荐人才</p>
    }
    <div>
      {
        props.noCareer ?
          <a className={styles.btn} href={`${location.origin}/initPublish.html`} onClick={() => {
            fSetCookieMes('newPublish', 1)
          }}>立即新增职位</a>
          :
          <a className={styles.btn} href={`${location.origin}/newPublish.html?job_id=${props.job_id}`} onClick={() => {
            fSetCookieMes('newPublish', 1)
          }}>立即完善信息</a>
      }
    </div>
  </div>
)


class Recommend extends Component{
  constructor(props){
    super(props);
    this.state = {
      perfect: false, // 优选人才的checked
      leftFixed: false, // 左侧的新增职位的固定定位
      tableFixed: false, // 右侧的表格头部的固定定位
      careers: [''], // 发布的职位
      careerFunction: '', // 选中的职位名字
      cacheRecommend: [], // 缓存每日推荐的数据
      cacheOpacityRecommend: [], // 缓存每日推荐的优选
      resume_id: '', // 简历ID
      job_id: '', // 选中的职位id
      channel_job_id: '', // 智能邀约时有用
      careerActive: 0, // 职位列表中选中的职位样式
      completed: '', // 选中的职位是不是已经完成的还是待完善的
      userStatus: props.userInfo, // 用户的状态，是否企业认证，公司信息是否完善等等
      showVerify: false, // 用户信息不全的时候用于显示confirm
      inviteBaseShow: false, // 智能邀约基本信息展示confirm
      noInviteShow: false, // 没有智能邀约次数的confirm
      inviteCompleteShow: false, // 智能邀约成功的confirm
      inviteNum: '', // 智能邀约次数
      resumeIndex: '', // 简历id的index
      inviteType: '', // 用于表示是优选人才还是高端人才
      inviteTomuch: false, // 联系次数过多
    };
    this.scroll = this.scroll.bind(this);
  }
  componentDidMount(){
    const { dispatch, resumeParams } = this.props;
    window.addEventListener('scroll', this.scroll);
    // 获取职位列表
    careers({status: 'published'}).then(res => {
      // console.log(res);
      this.setState({
        careers: res.data[0],
        completed: res.data[0].length && res.data[0][0].completed,
        careerFunction: res.data[0].length && res.data[0][0].name,
        job_id: res.data[0].length && res.data[0][0].job_id
      }, () => {
        res.data[0].length && dispatch(fetchDailyResumes({
          ...resumeParams,
          job_id: this.state.job_id
        }))
      });
      
    })
    // 是否进行认证，公司信息是否完善
    /*hasVerify({action: 'check'}).then(res => {
      const { success, data: [json] } = res
      this.setState({userStatus: json});
    })*/
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      cacheRecommend: nextProps.dailyRecommendResumes.resumes,
      userStatus: nextProps.userInfo
    });
  }
  componentWillUnmount(){
    window.removeEventListener('scroll', this.scroll)
  }
  getFreeResumes = (params) => { // 获取每日推荐的简历
    dailyFreeResume(params).then(res => {
      this.setState({cacheRecommend: res.data[0]});
    })
  }
  scroll(){
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    console.log(scrollTop)
    if(scrollTop < 184){
      this.setState({leftFixed: false});
    }else{
      this.setState({leftFixed: true});
    }
    if(scrollTop < 224){
      this.setState({tableFixed: false});
    }else{
      this.setState({tableFixed: true});
    }
    /*if(scrollTop < 184){
      this.setState({leftFixed: false,tableFixed: false});
    }else if(scrollTop >= 184 && scrollTop < 284) {
      this.setState({leftFixed: true, tableFixed: false});
    }else if(scrollTop >= 284){
      this.setState({leftFixed: true, tableFixed: true});
    }*/
  }
  changeChecked = (boolean) => {
    const { dispatch, resumeParams } = this.props;
    this.setState({perfect: boolean}, () => {
      dispatch(fetchDailyResumes({
        ...resumeParams,
        talent: boolean ? 1 : ''
      }))
    });
  }
  refuseResume = (resumeId, index) => { // 不合适的简历
    this.state.cacheRecommend.splice(index, 1) // 直接从数组中将这一个简历删除
    this.setState({cacheRecommend: this.state.cacheRecommend}, () => {
      noInterestResume({search_id: resumeId})
    })
  }
  hasVerify = (func, index, item, obj) => { // 高阶函数
    const { has_company_info: completed, has_approve_company: verify } = this.state.userStatus
    if(completed && verify){
      func && func(index, item, obj);
    }else{
      this.setState({showVerify: true});
    }
  }
  jumpPage = (index, item, obj) => { // 页面跳转到时候记录跳转的简历
    obj.func(obj.id)
    const { dispatch, resumeParams } = this.props;
    dispatch(fetchDailyResumes({...resumeParams}));
    window.open(`${location.origin}/talent_resume_details.html?id=${obj.id}&job_name=${this.state.careerFunction}&job_id=${this.state.job_id}&from=5&type=search`)
  }
  contact = (index, item) => { // 优选人才
    invite_intro().then(res => {
      const { success, data } = res;
      if(success){
        const { super_eternal_num, super_temp_num } = data[0];
        const totalNum = super_eternal_num + super_temp_num;
        if(totalNum){
          this.setState({
            inviteBaseShow: true,
            inviteNum: totalNum,
            channel_job_id: item.channel_job_id,
            resume_id: item.id,
            resumeIndex: index,
            inviteType: 'highEnd'
          });
        }else{
          this.setState({noInviteShow: true, inviteNum: totalNum, inviteType: 'highEnd'});
        }
      }
    });
  }
  active = (index, item) => {
    invite_intro().then(res => {
      const { success, data } = res;
      if(success){
        const { ai_eternal_num, ai_temp_num, free_num } = data[0];
        const totalNum = ai_eternal_num + ai_temp_num + free_num;
        if(totalNum){
          this.setState({
            inviteBaseShow: true,
            inviteNum: totalNum,
            channel_job_id: item.channel_job_id,
            resume_id: item.id,
            resumeIndex: index,
            inviteType: 'active'
          });
        }else{
          this.setState({noInviteShow: true, inviteNum: totalNum, inviteType: 'active'});
        }
      }
    });
  }
  render(){
    const { perfect, leftFixed, careers, tableFixed, cacheRecommend, completed, userStatus,
      showVerify, inviteBaseShow, inviteNum, noInviteShow, inviteCompleteShow,
      careerFunction, channel_job_id, job_id, resume_id, resumeIndex, inviteType, inviteTomuch
    } = this.state;
    return (
      <div className={styles.recommend}>
        {
          careers.length > 0 && <div className={cs({[styles.addNewCareer]: true, [styles.fixed]: leftFixed})}>
            <div className={styles.addBtnCon}>
            <span className={styles.addBtn} onClick={() => {
              fSetCookieMes('newPublish', 1)
              window.open(`${location.origin}/initPublish.html`);
            }}>+ 新增职位</span>
            </div>
            <ul className={styles.careerCon}>
              {
                careers.map((item, index) => <li className={cs({[styles.career]: true, [styles.active]: index === this.state.careerActive})}
                                                 key={item + '_' + index}
                                                 onClick={() => {
                                                   this.setState((state, props) => {
                                                     return {
                                                       completed: item.completed,
                                                       careerActive: index,
                                                       careerFunction: item.name,
                                                       job_id: item.job_id
                                                     }
                                                   }, () => {
                                                     const { dispatch, resumeParams } = this.props;
                                                     dispatch(fetchDailyResumes({
                                                       ...resumeParams,
                                                       job_id: this.state.job_id
                                                     }))
                                                   });
                                                 }}
                >
                  <div className={styles.introCon}>
                    <span className={styles.intro} title={item.function}>{item.function}</span>
                    <span className={styles.edit} onClick={e => {
                      if(e.preventBubble){
                        e.preventBubble();
                      }else{
                        e.stopPropagation();
                      }
                      fSetCookieMes('newPublish', 1)
                      window.open(`${location.origin}/newPublish.html?job_id=${item.job_id}`)
                    }}>编辑</span>
                  </div>
                  <div className={styles.base}>
                    <span className={styles.baseYear}>{item.work_year}</span>
                    {
                      item.salary_from && item.salary_to ? <span className={styles.baseSalary}>{item.salary_from}-{item.salary_to}</span> :
                        null
                    }
                    <span className={styles.baseDegree}>{item.degree_from}</span>
                  </div>
                  <p className={styles.tip}>{!item.completed && '信息待完善'}</p>
                </li>)
              }
            </ul>
          </div>
        }
        {
          careers.length > 0 && <div className={styles.recommendResumes}>
            <div className={styles.bannerLit}>
              <img src={require('./imgs/recommend_banner.png')}/>
            </div>
            <div className={styles.resumesCon}>
              <div className={cs({[styles.resumeHead]: true, [styles.fixed]: tableFixed})}>
                <div className={styles.titlePart1}>
                  <span className={styles.baseZh}>基本信息</span>
                  <div className={styles.selectCon}>
                    <Checkbox id="myCheckbox" checked={perfect} handle={this.changeChecked} style={{display: 'inline-block'}} />
                    <span>优选人才</span>
                  </div>
                </div>
                <div className={styles.titlePart2}>
                  <span>从业经历</span>
                </div>
                <div className={styles.titlePart3}>
                  <span>匹配度</span>
                </div>
                <div className={styles.titlePart4}>
                  <span>操作</span>
                </div>
              </div>
              <div className={styles.resumes}>
                {
                  (this.props.dailyRecommendResumes && this.props.dailyRecommendResumes.isFetching) ? <div className={styles.loadingCon}><Loading /></div> :
                    completed ?
                      cacheRecommend.length ? cacheRecommend.map((item, index) => <ResumeList
                          key={index} {...item} index={index} refuseCb={this.refuseResume}
                          userStatus={userStatus} activateCb={(id, index, props) => {this.hasVerify(this.active, index, props)}}
                          jumpPageCb={(func, id) => {this.hasVerify(this.jumpPage, '', item, {func, id})}} contactCb={(id, index, props) => {this.hasVerify(this.contact, index, props)}}
                        />)
                        :
                        <div className={styles.needSupply}>
                          <div className={styles.imgCon}>
                            <img src={require('./imgs/bees.png')} />
                          </div>
                          <p className={styles.title}>该岗位无推荐简历</p>
                          <p className={styles.detail}>修改岗位信息，重新获取推荐简历</p>
                          <div>
                            <a className={styles.btn} href={`${location.origin}/newPublish.html?job_id=${this.state.job_id}`}>去修改</a>
                          </div>
                        </div>
                      :
                      <NeedCareer job_id={this.state.job_id} />
                }
              </div>
            </div>
            {
              completed ? <div className={styles.noSuitable}>
                  <div className={styles.link}>找不到合适的人才？</div>
                  <Link to="/beiLib/hawkeye">试试拥有1000万+简历的辈出鹰眼</Link>
                </div> : null
            }
          </div>
        }
        {
          careers.length === 0 && <NeedCareer noCareer job_id={this.state.job_id} />
        }
        {/*信息不全，没有认证通过*/}
        <Confirm show={showVerify} handle={() => {this.setState({showVerify: false})}}>
          <div className={styles.noVerify}>
            <p className={styles.title}>为保护人才隐私 <br/> 需要企业认证后才能查看简历详情哦</p>
            <div className={styles.toVerify}>
              <div>
                <img src={require('./imgs/not.png')} />
                <span>完成企业认证</span>
                {
                  userStatus.has_approve_company ? <span className={styles.btn}>已认证</span> : <a href={`${location.origin}/channel_manager.html`}>未认证</a>
                }
              </div>
              <div>
                <img src={require('./imgs/not.png')} />
                <span>完善公司信息</span>
                {
                  userStatus.has_company_info ? <span className={styles.btn}>已完善</span> : <a href={`${location.origin}/setting.html?company`}>未完善</a>
                }
              </div>
            </div>
          </div>
        </Confirm>
        
        {/*智能邀约的基本信息*/}
        <Confirm show={inviteBaseShow} handle={() => {this.setState({inviteBaseShow: false, inviteType: ''})}}>
          <div className={styles.inviteBase}>
            <p className={styles.title}>{inviteType === 'highEnd' ? '立即获得优选人才联系方式？' : '立即激活人才？'}</p>
            <p className={styles.lest}>{inviteType === 'highEnd' ? '今日' : ''}剩余额度：{ inviteNum }{inviteType === 'highEnd' ? '人' : ''}</p>
            <div className={styles.shadow}>
              <p>助理小辈帮您电话联系人才确认求职意向</p>
              <p>结果将在24小时内反馈</p>
            </div>
            <div className={styles.btnCon}>
              <span className={styles.btn} onClick={() => {
                this.setState({
                  inviteBaseShow: false,
                  inviteNum: --this.state.inviteNum
                });
                const params = {
                  action: 'resume_zy',
                  item_list: [{
                    'function': careerFunction,
                    channel_job_id,
                    job_id,
                    search_id: resume_id
                  }]
                }
                completeInvite(params).then(res => {
                  const { success, message: [message] } = res;
                  if(success){
                    this.state.cacheRecommend.splice(resumeIndex, 1)
                    this.setState({inviteCompleteShow: true, cacheRecommend: this.state.cacheRecommend})
                  }else if(message === '该人才今日已经被邀约三次及以上'){
                    this.setState({inviteTomuch: true})
                  }
                })
              }}>{inviteType === 'highEnd' ? '立即联系' : '立即激活'}</span>
            </div>
          </div>
        </Confirm>
        
        {/*智能邀约次数不足需要购买*/}
        <Confirm show={noInviteShow} handle={() => {this.setState({noInviteShow: false, inviteType: ''})}}>
          <div className={styles.inviteBase}>
            <p className={styles.title}>{inviteType === 'highEnd' ? '您剩余的优选人才额度不足，无法联系' : '您剩余激活人才额度不足，无法激活'}</p>
            <div className={styles.btnCon}>
              <span className={styles.btn} onClick={() => {
                window.open(`${location.origin}/s_store.html`)
              }}>去服务商店</span>
            </div>
          </div>
        </Confirm>
        
        {/*确定智能邀约，智能邀约成功*/}
        <Confirm show={inviteCompleteShow} handle={() => {this.setState({inviteCompleteShow: false, inviteType: ''})}}>
          <div className={styles.completeInvite}>
            <div className={styles.imgCon}>
              <img src={require('./imgs/complete.png')} />
            </div>
            <p className={styles.title}>{inviteType === 'highEnd' ? '你已获得人才联系方式' : '人才激活已发送'}</p>
            <p className={styles.lest}>今日剩余邀约额度：{inviteNum}人</p>
            <p className={styles.intro}>{inviteType === 'highEnd' ? '可以到“人才跟进“中查看哦' : '人才激活后，可以在“人才跟进”中查看联系方式'}</p>
            <div className={styles.btnCon}>
              <span className={styles.btn} onClick={() => {this.setState({inviteCompleteShow: false, inviteType: ''})}}>确定</span>
            </div>
          </div>
        </Confirm>
        {/*邀约的次数过多*/}
        <Confirm show={inviteTomuch} handle={() => {this.setState({inviteTomuch: false})}}>
          <div className={styles.inviteBase}>
            <p className={styles.title}>温馨提示</p>
            <div className={styles.shadow}>
              <p>该人才今日被联系次数过多，暂时无法再联系</p>
              <p>去看看其他人才吧</p>
            </div>
            <div className={styles.btnCon}>
              <span className={styles.btn} onClick={() => {
                this.setState({inviteTomuch: false})
              }}>知道了</span>
            </div>
          </div>
        </Confirm>
        
      </div>
    )
  }
}


const mapStateToProps = state => ({
  dailyRecommendResumes: state.dailyRecommendResumes,
  resumeParams: state.resumeParams,
  userInfo: state.userInfo
})

export default connect(mapStateToProps)(Recommend)
