import React, { Component } from 'react'
import { Link } from 'react-router'
import cs from 'classnames'
import { connect } from 'react-redux'
import { talentfollowup, careers, batch_deal_resume } from 'service/beiLib'
import ResumeList from '../listItem'
import Checkbox from 'component/checkbox'
import Pagination from 'component/pagination';
import { fSetCookieMes, fGetCookieMes } from 'utils/common'
import Transmit_modal from '../transmit_modal/index.jsx';
import styles from './index.less'
import src from '../img/empty.png';
import { changeTitleNum } from 'action/myTalent'

const resumeStatus = [
  {name: '不限', params: ''},
  {name: '待回复', params: 'waiting'},
  {name: '有求职意向', params: 'accept'},
  {name: '已拒绝', params: 'reject'},
  {name: '不合适', params: 'improper'}
];

const NeedCareer = props => (
  <div className={styles.needSupply}>
    <div className={styles.imgCon}>
      <img src={require('../img/bees.png')} />
    </div>
    <p className={styles.title}>暂无职位信息，请新增职位</p>
    <div>
      <a className={styles.btn} href={`${location.origin}/initPublish.html`} onClick={() => {
        fSetCookieMes('newPublish', 3)
      }}>新增职位</a>
    </div>
  </div>
)

class Recommend extends Component{
  constructor(props){
    super(props);
    this.state = {
  
      job_id: '', // 选中的职位的job_id
      careerActive: 0, // 处于激活状态的职位
      completed: false, // 选中的职位是不是已经完成
      careerFunction: '', // 选中职位的名称
      resumes: [], // 用于存放简历
      nosuitArr: [], // 用于存放不合适的简历id
      selectAll: false, // 是否点击了选择全部
      resumeState: '', // 进行筛选的状态(有求职意向，不限，待回复，已拒绝， 不合适)
      choseShow: false, // 候选人状态的选择
      totalPages: 0, // 分页总共的页数
      currentPage: 1, // 默认当前是第一页
      searchKey: props.localTalentSearchKey, // 头部的搜索
      
      
      isshow:"none", //分页隐藏
      empty:"none",  //简历为空
      empty_position:"none", //职位为空
      isinformation:"none", //基本信息隐藏
      page:1,
      maxPage:0,
      perfect: false, // 优选人才的checked
      leftFixed: false, // 左侧的新增职位的固定定位
      tableFixed: false, // 右侧的表格头部的固定定位
      cacheOpacityRecommend: [], // 缓存每日推荐的优选
      list:[{job_name:"",resume_id:"",channel_job_id:"",email:"",name:""}],
      transmit_modal_show:false, //转发弹框
      isforward:"",    //0代表转发  1代表不合适
      careers: [], // 发布的职位
      cacheRecommend: [], // 缓存人才跟进的数据
    };
    this.scroll = this.scroll.bind(this);
  }
  transmit_callback = (val,para)=>{

    this.setState({

      transmit_modal_show:false
    })

    if (val == true){

    }

  }
  componentDidMount(){
    window.addEventListener('scroll', this.scroll)
    // 获取职位列表
    careers({status: 'published',}).then(res => {
      const { success, data } = res;
      const careers = data[0];
      this.setState({
        careers: res.data[0],
        completed: careers.length && careers[0].completed,
        careerFunction: careers.length && careers[0].name,
        job_id: careers.length && careers[0].job_id
      }, () => {
        talentfollowup({job_id: this.state.job_id}).then(res => {
          const { success, data } = res;
          this.setState({resumes: data[0], selectAll: false, totalPages: data[1].page_max, currentPage: data[1].page_num})
          const { dispatch } = this.props;
          dispatch(changeTitleNum(data[2]))
        })
      })
    })
  }
  componentWillReceiveProps(nextProps){
    const { localTalentSearchKey } = nextProps;
    if(localTalentSearchKey !== this.state.searchKey){
      this.setState({searchKey: localTalentSearchKey}, () => {
        const { searchKey } = this.state;
        talentfollowup({job_id: this.state.job_id, search_key: searchKey, page: 1}).then(res => {
          const { success, data } = res;
          this.setState({resumes: data[0], selectAll: false, totalPages: data[1].page_max, currentPage: data[1].page_num})
          const { dispatch } = nextProps;
          dispatch(changeTitleNum(data[2]))
        })
      });
    }
  }
  componentWillUnmount(){
    window.removeEventListener('scroll', this.scroll)
  }
  recommend_callback = (e)=>{
    e.stopPropagation();
    // 去激活人才
    window.open(`${location.origin}/dist_new/index.html`);
  }
  New_position = (e)=>{
    e.stopPropagation();
    // 新增职位
    fSetCookieMes('newPublish', 3)
    window.open(`${location.origin}/initPublish.html`);
  }
  checkHandle = (resume_id) => { // 点击简历前面的checkbox的处理函数
    const { nosuitArr, resumes } = this.state;
    const arr = nosuitArr;
    const index = arr.indexOf(resume_id);
    const canSelectArr = [];
    resumes.map(item => {
      item.zy_status === 0 && canSelectArr.push(item.id)
    })
    if(index === -1){ // 中间没有该简历
      arr.push(resume_id);
    }else{
      arr.splice(index, 1)
    }
    this.setState({
      nosuitArr: arr,
      selectAll: canSelectArr.length === arr.length ? true : false
    });
  }
  selectAll = () => {
    const { nosuitArr, resumes, selectAll } = this.state;
    let arr = nosuitArr;
    if(selectAll){
      resumes.map(item => {
        (item.zy_status === 0 && arr.indexOf(item.id) === -1) && arr.push(item.id)
      })
    }else{
      arr = [];
    }
    this.setState({nosuitArr: arr})
  }
  nosuitHandle = (id) => { // 单个处理不合适的简历
    batch_deal_resume({
      action: 'improper',
      item_list: [id]
    }).then(res => {
      talentfollowup({job_id: this.state.job_id}).then(res => {
        const { success, data } = res;
        this.setState({resumes: data[0]})
        const { dispatch } = this.props;
        dispatch(changeTitleNum(data[2]))
      })
    })
  }
  multiNosuit = () => {
    const { nosuitArr } = this.state;
    batch_deal_resume({
      action: 'improper',
      item_list: nosuitArr
    }).then(res => {
      talentfollowup({job_id: this.state.job_id}).then(res => {
        this.setState({nosuitArr: [], selectAll: false});
        const { success, data } = res;
        this.setState({resumes: data[0]})
        const { dispatch } = this.props;
        dispatch(changeTitleNum(data[2]))
      })
    })
  }
  pageHandle = page => {
    this.setState({selectAll: false, nosuitArr: []});
    talentfollowup({job_id: this.state.job_id, page, resume_process_type: this.state.resumeState.params}).then(res => {
      const { success, data } = res;
      this.setState({resumes: data[0], selectAll: false, totalPages: data[1].page_max, currentPage: page})
      const { dispatch } = this.props;
      dispatch(changeTitleNum(data[2]))
    })
  }
  jumpPage = () => {
    talentfollowup({job_id: this.state.job_id, page: this.state.currentPage, resume_process_type: this.state.resumeState.params}).then(res => {
      const { success, data } = res;
      this.setState({resumes: data[0], selectAll: false, totalPages: data[1].page_max, currentPage: data[1].page_num})
      const { dispatch } = this.props;
      dispatch(changeTitleNum(data[2]))
    })
  }
  scroll(){
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if(scrollTop < 184){
      this.setState({leftFixed: false, tableFixed: false});
    }else{
      this.setState({leftFixed: true, tableFixed: true});
    }
  }
  render(){
    const { perfect, leftFixed, careers, tableFixed, cacheRecommend, completed, userStatus, resumes,
      showVerify, inviteBaseShow, inviteNum, noInviteShow, inviteCompleteShow,
      careerFunction, channel_job_id, job_id, resume_id, resumeIndex, nosuitArr, selectAll,
      choseShow, totalPages, currentPage, searchKey
    } = this.state;
    return (
      <div className={styles.recommend}>
        <Transmit_modal show={this.state.transmit_modal_show} list={this.state.list}
                        handle={this.transmit_callback.bind(this)}/>
        {
          careers.length ?
            <div>
              <div className={cs({[styles.addNewCareer]: true, [styles.fixed]: leftFixed})}>
                <div className={styles.addBtnCon}>
                  <span className={styles.addBtn} onClick={() => {
                    fSetCookieMes('newPublish', 3)
                    window.open(`${location.origin}/initPublish.html`)
                  }}>+ 新增职位</span>
                </div>
                <ul className={styles.careerCon}>
                  {
                    careers.map((item, index) =>
                      <li className={cs({[styles.career]: true, [styles.active]: index === this.state.careerActive})}
                          key={item + '_' + index}
                          onClick={() => {
                            this.setState({
                              completed: item.completed,
                              careerActive: index,
                              careerFunction: item.name,
                              job_id: item.job_id,
                              resumeState: ''
                            }, () => {
                              talentfollowup({job_id: this.state.job_id}).then(res => {
                                const { success, data } = res;
                                this.setState({resumes: data[0], selectAll: false, totalPages: data[1].page_max, currentPage: data[1].page_num})
                                const { dispatch } = this.props;
                                dispatch(changeTitleNum(data[2]))
                              })
                            })
                          }}
                      >
                        <div className={styles.introCon}>
                          <span className={styles.intro}>{item.function}</span>
                          <span className={styles.edit} onClick={e => {
                            if(e.preventBubble){
                              e.preventBubble();
                            }else{
                              e.stopPropagation();
                            }
                            window.open(`${location.origin}/newPublish.html?job_id=${this.state.job_id}`)
                          }}>编辑</span>
                        </div>
                        <div className={styles.base}>
                          <span className={styles.baseYear}>{item.work_year}</span>
                          <span className={styles.baseSalary}>{item.salary_from}-{item.salary_to}</span>
                          <span className={styles.baseDegree}>{item.degree_from}</span>
                        </div>
                        <p className={styles.tip}>{!item.completed && '信息待完善'}</p>
                      </li>)
                  }
                </ul>
              </div>
              <div className={styles.recommendResumes}>
                <div className={styles.resumesCon}>
                  <div className={cs({[styles.resumeHead]: true, [styles.fixed]: tableFixed})}>
                    <div className={styles.selectCon}>
                      <Checkbox id="myCheckbox" checked={selectAll} handle={() => {
                        this.setState({selectAll: !selectAll}, () => {
                          this.selectAll();
                        });
                      }} />
                    </div>
                    {
                      nosuitArr.length !== 0 ? <div className={styles.nosuitBtn}>
                          <span className={styles.btn} onClick={this.multiNosuit}>不合适</span>
                          <span className={styles.close} onClick={() => {
                            this.setState({nosuitArr: [], selectAll: false})
                          }}><img src={require('../img/close.png')}/></span>
                        </div> : null
                    }
                    {
                      nosuitArr.length === 0 && <div className={styles.titleCon}>
                        <div className={styles.titlePart1}>
                          <span className={styles.baseZh}>基本信息</span>
                        </div>
                        <div className={styles.titlePart2}>
                          <span>从业经历</span>
                        </div>
                        <div className={styles.titlePart3}>
                          <span>匹配度</span>
                        </div>
                        <div className={styles.state} >
                          <span id="span" onClick={() => {
                            this.setState({choseShow: true}, () => {
                              document.getElementById('ul').focus()
                            })
                          }}>{this.state.resumeState.name || '状态'}<i><img src={require('../img/arrow_down.png')}/></i></span>
                          {
                            choseShow && <ul className={styles.ul} id="ul" tabIndex="0" onBlur={() => {
                              this.setState({choseShow: false})
                            }}>
                              {
                                resumeStatus.map((item, index) => <li className={item.params === this.state.resumeState.params ? styles.active : ''} key={index} onClick={() => {
                                  this.setState({choseShow: false, resumeState: item}, () => {
                                    talentfollowup({job_id: this.state.job_id, resume_process_type: item.params}).then(res => {
                                      const { success, data } = res;
                                      this.setState({resumes: data[0], selectAll: false, totalPages: data[1].page_max, currentPage: data[1].page_num})
                                      const { dispatch } = this.props;
                                      dispatch(changeTitleNum(data[2]))
                                    })
                                  })
                                }}>{item.name}</li>)
                              }
                            </ul>
                          }
                        </div>
                        <div className={styles.titlePart4}>
                          <span>操作</span>
                        </div>
                      </div>
                    }
                  </div>
                  <div className={styles.resumes}>
                    {
                      resumes.length ? resumes.map((item, index) => <ResumeList
                          key={index} {...item} checkHandle={this.checkHandle}
                          nosuitArr={nosuitArr} handle={this.nosuitHandle}
                          jumpPageCb={this.jumpPage} job_id={this.state.job_id}
                          job_name={careerFunction}
                        />) :
                        !searchKey ?
                        <div className={styles.needSupply}>
                          <div className={styles.imgCon}>
                            <div className={styles.imgPos}>
                              <img src={require('../img/bees.png')} />
                            </div>
                          </div>
                          <p className={styles.title}>暂无跟进记录</p>
                          <div>
                            <Link className={styles.btn} to="/myTalents/myresumelist" >去激活人才</Link>
                          </div>
                        </div> :
                          <div className={styles.needSupply}>
                            <div className={styles.imgCon}>
                              <div className={styles.imgPos1}>
                                <img src={require('../img/bees.png')} />
                              </div>
                            </div>
                            <p className={styles.title}>暂无人才</p>
                            <p className={styles.detail}>你的搜索内容过于严格，小辈暂时还没有找到这样的人才， <br/>
                              试试更改搜索内容吧</p>
                          </div>
                    }
                  </div>
                </div>
                {
                  totalPages ? <div className={styles.pag}>
                    <div className={styles.pagChlid}>
                      {<Pagination currentPage={currentPage} totalPages={totalPages} pageCallback={this.pageHandle}/>}
                    </div>
                  </div> : null
                }
              </div>
            </div>
            : <NeedCareer noCareer job_id={this.state.job_id} />
        }
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    localTalentSearchKey: state.localTalentSearchKey.search_key
  }
}

export default connect(mapStateToProps)(Recommend)
