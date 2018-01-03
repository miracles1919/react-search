import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './chengpin.css';
import {leftList,localJob,deleteResume,activeTalent,getLeftNumber,isConfiger} from 'service/hawkeye'
import Checkbox from '../../../component/checkbox';
import Pagination from '../../../component/pagination';
import { hashHistory } from 'react-router';
import { changeTitleNum } from 'action/myTalent'
import { connect } from 'react-redux'
const fSetCookieMes = (key, val, expiresDays = 30) => {
  let date = new Date()
  date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000)
  document.cookie = `${key}=${val};=${date.toGMTString()};path=/`
}
// import {fSetCookieMes} from '../../../utils/commom'
// import {HOST} from '../../../utils/common.js'
 class App extends Component {
  static propTypes = {

  };
  constructor (props) {
    super(props);
    this.state = {
      modalForApprove:false,
      isGetData:0,  // 0 未didmount之前  1 didmount之后
      talentSuccess:false,
      maxPage:1,
      selectAll:false,
      jobList:[] ,
      resumeList:[],
      boolenList:[],
      modalForDelete:false,
      resumeIdList:[],
      modalForTalent:false,
      titleSwitch:1,//  1 基础表头  2 具有删除和激活操作的表头
      titleDistance:100, //表头距离浏览的窗口的高度
      rightjobListDistance:200,
      obj:{}, //function ,channel_job_id,job_id,
      _active:0,//用于左侧的列表
      _active1:0,//用于右侧的列表
      totalNum:0,
      currentPage:1,
      localTalentSearchKey:''
    };
  }
  componentWillReceiveProps(nextProps) {
    console.log(9999999);
    leftList({
            status:'published',
            pagesize:25,
            search_key:nextProps.localTalentSearchKey,
    }).then(json=>{
      console.log(json);
      if(json.success){
        let jobList=json.data[0]
        //默认获取第一个职位对应的本地简历
        this.getLocalResume(jobList[0]);
        this.setState({
          jobList,
          isGetData:1,
        });
      }
    })
    .catch((err)=>{
      console.log(err);
      // alert('获取数据失败')
    })
  }
  getLocalResume=(job,curPage=1)=>{
    console.log(66666);
    localJob({
      job_id:job&&job.job_id ,
      page:curPage,
      // job_id:1751900012
    }).then(res => {
      console.log(res);
      if(res.success){
        console.log(res);
        const { dispatch } = this.props;
        dispatch(changeTitleNum(res.data[1]))
        let resumeListLength=res.data[0].resume_list.length;
        let boolenList=[];
        for(let i=0; i<resumeListLength;i++){
          boolenList.push(false)
        }
        let obj={}
        obj.function=job.function
        obj.job_id=job.job_id
        obj.channel_job_id=job.channel_job_id;
        let obj1=JSON.parse(JSON.stringify(obj))
        this.setState({
          obj:obj1,
          selectAll:false,
          boolenList,
          resumeList  :res.data[0].resume_list ,
          maxPage:res.data[0].page_max,
          currentPage:curPage,
          titleSwitch:1,
        });
      }
    })
    .catch((err)=>{
      console.log(err);
        // alert('获取数据失败')
    })
  }
  componentDidMount() {
    leftList({
            status:'published',
            pagesize:25,
    }).then(json=>{
      console.log(json);
      if(json.success){
        let jobList=json.data[0]
        //默认获取第一个职位对应的本地简历
        this.getLocalResume(jobList[0]);
        this.setState({
          jobList,
          isGetData:1,
        });
      }
    })
    .catch((err)=>{
      console.log(err);
      // alert('获取数据失败')
    })
  }

    closeTitle=()=>{
      let boolenList=this.state.boolenList;
        boolenList.fill(false);
      this.setState({
        titleSwitch:1 ,
        boolenList,
        selectAll:false,
      });
    }
    scrollListen=()=>{
      if(this.state.resumeList.length>0){
        this.setState({
          titleDistance:this.refs.title.offsetTop - (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop),
          rightjobListDistance:this.refs.rightList.offsetTop - (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop),
        });
      }

    }
    //翻页时获取简历
    getResume=(curPage)=>{
      return(
        this.getLocalResume(this.state.obj,curPage)
      )
    }
    //全选的勾选动作
  toggle=(value)=>{
    if(value){
      let resumeIdList=[];
      this.state.resumeList.forEach((item)=>{
        resumeIdList.push(item.resume_id)
      })
      let boolenList=this.state.boolenList;
      boolenList.fill(true);
      this.setState({
        resumeIdList,
      selectAll  :value,
      titleSwitch:2,
      boolenList,
      });
    }else{
      let boolenList=this.state.boolenList;
      boolenList.fill(false);
      this.setState({
        resumeIdList:[],
      selectAll  :value,
      titleSwitch:1,
      boolenList,
      });
    }

  }
  //简历复选框的勾选动作
  toggleList=(index,resume_id)=>{
    return(value)=>{
      let list=JSON.parse(JSON.stringify(this.state.boolenList));
      list[index]=value;
      if(value){
        if(list.indexOf(false)===-1){
          this.setState({
          boolenList  : list,
          resumeIdList:[...this.state.resumeIdList,resume_id],
          selectAll:true,
          });
        }else{
          this.setState({
          boolenList  : list,
          resumeIdList:[...this.state.resumeIdList,resume_id],
          });
        }

      }else{
        let resumeIdList=JSON.parse(JSON.stringify(this.state.resumeIdList));
        resumeIdList.splice(index,1)
        this.setState({
          resumeIdList,
          boolenList  : list,
          selectAll:false,
        });
      }
      if(list.indexOf(true)>-1){
        this.setState({
          titleSwitch:2 ,
        });
      }else{
        this.setState({
          titleSwitch:1 ,
        });
      }
    }
  }
  //删除简历弹窗
  deleteResumeFunc=()=>{
    console.log('deleteResume');
    this.setState({
      modalForDelete:true ,
    });
  }
  //激活人才弹窗
  activeTalentFunc=()=>{
    console.log('activeTalentFunc');
    isConfiger({action:'check'}).then((res)=>{
      if(res.success){
        if(res.data[0].has_approve_company===1&&res.data[0].true_compamy_name!=''){
          this.setState({
            modalForTalent:true ,
          });
        }else{
          this.setState({
            modalForApprove:true ,
          });
        }
      }
    })

  getLeftNumber().then(json=>{
        let totalNum=json.data[0].ai_eternal_num+json.data[0].ai_temp_num+json.data[0].free_num
        this.setState({
         totalNum,
        });
    })
  }
  //删除确认操作
  confirmDelete=()=>{
  console.log('confirmDelete');
    deleteResume({resume_id_list:this.state.resumeIdList,job_id:this.state.obj.job_id})
    .then(
      (res)=>{
        if(res.success){
          let boolenList=this.state.boolenList;
          boolenList.fill(false);
          this.setState({
            modalForDelete:false ,
            resumeIdList:[],
            boolenList,
            selectAll:false,
          });
        this.getLocalResume(this.state.obj)
        }
      }
    ).catch((err)=>{
      console.log(err);
      // alert('删除失败')
    })
  }
  //激活人才确认操作
  confirmTalent=()=>{
    let item_list=[];
    let obj=JSON.parse(JSON.stringify(this.state.obj))
    this.state.resumeIdList.forEach((item)=>{
      obj.search_id=item;
      item_list.push(JSON.parse(JSON.stringify(obj)))
    })
    activeTalent({
      item_list,
      resume_from:'local',
      action:'resume_zy',
    }).then(
      (res)=>{
        console.log(res);
        if(res.success){
          getLeftNumber().then(json=>{
                let totalNum=json.data[0].ai_eternal_num+json.data[0].ai_temp_num+json.data[0].free_num
                this.setState({
                 totalNum,
                });
            })
          let boolenList=this.state.boolenList;
          boolenList.fill(false);
          this.setState({
            modalForTalent:false ,
            resumeIdList:[],
            talentSuccess:true,
            boolenList,
            selectAll:false,
          });
        }else{
          // alert(res.message[0])
        }
      }
    ).catch((err)=>{
      console.log(err);
      // alert('激活失败')
    })
  }
  //点击职位列表，获取相应本地简历
  getRelativeResume=(item,index)=>{
    return ()=>{
      console.log(item.job_id);
        this.getLocalResume(item)
      this.setState({
        _active: index
      });
    }
  }
  //新增职位
  newJob=()=>{
    console.log(window.location.origin+'/initPublish.html');
    console.log('newJob');
    fSetCookieMes('newPublish','2');
    window.open(window.location.origin+'/initPublish.html');
  }
  editJob=()=>{
    console.log(window.location.origin+'/newPublish.html');
    fSetCookieMes('newPublish','2');
    window.open(window.location.origin+'/newPublish.html'+'?job_id='+this.state.obj.job_id)
  }
  showDetai=(id)=>{
    return (e)=>{
      if(e.target.nodeName === 'LABEL'||e.target.nodeName === 'INPUT'){
            return;
        }
      let search=`?id=${id}&job_id=${this.state.obj.job_id}&from=6&type=local`
      // window.open(window.location.origin+'/talent_resume_details.html'+search)
      window.open(window.location.origin+'/talent_resume_details.html'+search+'&job_name='+this.state.obj.function)
      this.setState({
        _active1:id ,
      });
    }

  }
  render () {
    if(this.state.resumeList.length>0){
      window.addEventListener('scroll', this.scrollListen)
    }
    //下面的所有长度计算都是为了表头的锁定与解锁
    let titleClass=this.state.titleDistance<80?'titleFixed':'title'
    let leftClass=this.state.titleDistance<80?'leftFixed':'left'
    let rightClass=this.state.titleDistance<80?'rightMargin':'right'
    let contentInnerClass=this.state.titleDistance<80?'contentInner':''//为了向上滚动时表头能平滑固定
     titleClass=this.state.rightjobListDistance<140?'titleFixed':'title'
     leftClass=this.state.rightjobListDistance<140?'leftFixed':'left'
     rightClass=this.state.rightjobListDistance<140?'rightMargin':'right'
     contentInnerClass=this.state.rightjobListDistance<140?'contentInner':''//为了向下滚动时表头能平滑固定
     const modalForDelete=this.state.modalForDelete
     ?<div  className={style.shade}>
        <div className={style.notionContact}>
          <div className={style.deleteInText}>删除简历</div>
          <div className={style.confirmIntext}>确认将选中的简历从当前职位处删除</div>
          <button className={style.CancelInshade}
            onClick={()=>{this.setState({
            modalForDelete:false ,
          });}}>取消</button>
          <button className={style.ConfirmInshade} onClick={this.confirmDelete}>确认</button>
        </div>
      </div>
      :'';
      const modalForTalent=this.state.modalForTalent
       ?<div  className={style.shade}>
          <div className={style.notionContact}>
            <div className={style.deleteInText}>立即激活人才</div>
            <div >今日剩余额度：{this.state.totalNum}人</div>
            <div style={{marginTop:60}}>助理小辈帮您电话联系人才确认求职意向</div>
            <div style={{marginBottom:40}}>结果将在24小时内反馈给您</div>
            <button className={style.CancelInshade}
              onClick={()=>{this.setState({
              modalForTalent:false ,
            });}}>取消</button>
            <button className={style.ConfirmInshade} onClick={this.confirmTalent}>确认</button>
          </div>
        </div>
        :'';
        const modalForApprove=this.state.modalForApprove
        ?<div  className={style.shade}>
           <div className={style.notionContact}>
             <div className={style.times} onClick={()=>{this.setState({
             modalForApprove:false ,
           });}}>&times;</div>
             <div className={style.protectInText}>为保护人才隐私</div>
             <div className={style.protectInText1}>需要企业认证后才能查看简历详情</div>
             <div style={{marginTop:40,height:35}}>
               <img src={require('../../../img/Not.png')} className={style.activeIcon}/>
              <span className={style.protectInText2}>完成企业认证</span>
              <span className={style.protectInText22} onClick={()=>{window.open(window.location.origin+'/channel_manager.html')}}>未认证</span>
             </div>
             <div style={{marginTop:40,height:35}}>
               <img src={require('../../../img/Not.png')} className={style.activeIcon}/>
               <span className={style.protectInText2}>完善公司信息</span>
               <span className={style.protectInText22} onClick={()=>{window.open(window.location.origin+'/setting.html?company')}}>未完善</span>
             </div>
           </div>
         </div>
         :'';
        const modalForTalentSuccess=this.state.talentSuccess
         ?<div  className={style.shade}>
            <div className={style.notionContact}>
              <div style={{marginTop:30}}>
                   <img style={{width:60}} src={require('../../../../../app/components/public/contact/img/zy_ok.png')} alt=""/>
              </div>
              <div className={style.deleteInText} style={{marginTop:27}}>智能邀约发送完毕</div>
              <div >今日剩余额度：{this.state.totalNum}人</div>
              <div style={{marginTop:30,marginBottom:30}}>求职者接受邀请后，会立即通知您</div>
              <button   onClick={()=>{this.setState({
                talentSuccess:false ,
              });}} className={style.ConfirmInshade}>确认</button>
            </div>
          </div>
          :'';
    const leftJobList=this.state.jobList.map((item,index)=>{
      return (<div className={index == this.state._active?style.jobListClick:style.jobList} key={index} onClick={this.getRelativeResume(item,index)}>
        <div className={style.box} >
          <div style={{ marginBottom: 7,color: '#333333' }}>
            <span className={style.jobName}>{item.function}</span>
            <a className={style.jobEdit} onClick={this.editJob}>编辑</a>
          </div>
          <div style={{color: '#777777',fontSize: 12,marginBottom:16}}>
            <span className={style.age} >{item.work_year}</span>
            <span className={style.line}></span>
            <span className={style.salary}>{`${item.salary_from}~${item.salary_to}`}</span>
            <span className={style.line}></span>
            <span className={style.degree}>{item.degree_from}</span>
          </div>
          <div className={style.notComplete} style={{display:item.completed?'none':'block'}}>信息待完善</div>
        </div>
      </div>)
    })
    const rightjobList=this.state.resumeList.map((item,index)=>{
      const titleLeftClass=(item.experiences_tags&&item.experiences_tags.length>0)?'titleLeft':'titleLeftNoTag'
      return (
          <div className={style.content} key={String(index)} onClick={this.showDetai(item.resume_id)} style={{background:this.state._active1===item.resume_id?'#f7f8f9':'#fff'}}>
              <span className={style.leftBox}>
                <Checkbox className={style.checkbox} id={index.toString()} checked={this.state.boolenList.length==0?false:this.state.boolenList[index]} handle={this.toggleList(index,item.resume_id)}></Checkbox>
              </span>
              <span className={style[titleLeftClass]}>
                <div className={style.titleLeftName}>{item.name}</div>
                <div className={style.titleLeftDetail}>
                  <span className={style.titleLeftSex}>{item.gender}</span>
                  <span style={{marginLeft:2, marginRight:2}}>|</span>
                  <span className={style.titleLeftAge}>{item.age!=''?item.age:'无'}</span>
                  <span style={{marginLeft:2, marginRight:2}}>|</span>
                  <span className={style.titleLeftAd}>{item.residence!=''?item.residence:'暂无'}</span>
                </div>
                <div className={style.titleLeftDetail}>
                  <span className={style.titleLeftSeniority}>{item.seniority}年工作经验</span>
                  <span style={{marginLeft:2, marginRight:2}}>|</span>
                  <span className={style.titleLeftSalary}>{item.salary!=''?item.salary:'暂无'}</span>
                </div>
                <div className={style.titleLeftDetail}>
                  <span className={style.titleLeftUniversity}>{item.university!=''?item.university:'暂无'}</span>
                  <span style={{marginLeft:2, marginRight:2}}>|</span>
                  <span className={style.titleLeftcollege}>{item.major!=''?item.major:'暂无'}</span>
                  <span style={{marginLeft:2, marginRight:2}}>|</span>
                  <span>{item.degree!=''?item.degree:'暂无'}</span>
                </div>
                <div className={style.titleLeftDetail} style={{marginTop: 10}}>
                  {
                    item.experiences_tags&&item.experiences_tags.map((item1,index)=>{
                      return(<span key={index} className={style.titleLeftTag}>{item1}</span>)
                    })
                  }
                </div>
              </span>
              <div style={{display:'inline-block',verticalAlign:'top'}}>
                <span className={style.titleMiddleDetail}>
                  {
                    item.experiences&&item.experiences.map((item2,index2)=>{
                      return (
                        index2<3
                        ?<div key={index2} className={style.experience}>
                          <span className={style.tiemFromTo}>{item2.period[0]}&nbsp;-&nbsp;{item2.period[1]}</span>
                          <span className={style.company}>{item2.company}</span>
                          <span className={style.duty}>-&nbsp;{item2.duty}</span>
                        </div>
                        :''
                    )
                    })
                  }
                </span>
              </div>
              <span className={style.titleRightDetail}>
                <div className={style.score}>{item.quality_score}</div>
                <div className={style.scoreDescribe}>综合评分</div>
              </span>
          </div>
      )
    })

    const title=this.state.titleSwitch==1
    ?<div className={style[titleClass]} ref='title'>
      <span className={style.checkboxContainer}>
        <Checkbox className={style.checkbox} id='total' checked={this.state.selectAll} handle={this.toggle}></Checkbox>
      </span>
      <span className={style.titleLeft}>基本信息</span>
      <span className={style.titleMiddle}>从业经历</span>
      <span className={style.titleRight}>综合评分</span>
    </div>
    :<div className={style[titleClass]} ref='title'>
      <span className={style.checkboxContainer}>
        <Checkbox className={style.checkbox} id='total' checked={this.state.selectAll} handle={this.toggle}></Checkbox>
      </span>
      <button className={style.deleteResume} onClick={this.deleteResumeFunc}>删除简历</button>
      <button className={style.activeTalent} onClick={this.activeTalentFunc}>激活人才</button>
      <span className={style.deleIcon} onClick={this.closeTitle}>&times;</span>
    </div>
    const pagenation= this.state.maxPage>1
    ? <div style={{marginTop:20,marginBottom:20,float:'right', marginRight: 40}}>
              <Pagination currentPage = {this.state.currentPage} totalPages = {this.state.maxPage} pageCallback = { this.getResume } />
          </div>
    :''

    const isShow=this.state.jobList.length===0?'block':'none'
    const isShow1=this.state.jobList.length===0?'none':'block'
    const isGetData=this.state.isGetData===1?'block':'none'
    const isShowRight=this.state.resumeList.length===0?(this.state.jobList.length===0?'none':'block'):'none'
    const isShowRight1=this.state.resumeList.length===0?'none':'block'

    return (
      <div style={{display:isGetData}}>
      <div className={style.bothNone} style={{display:isShow}}>
          <div className={style.imgContainer1}>
            <i className={style.spriteImg1}></i>
          </div>
          <div className={style.noResume}>
            暂时无法上传简历，请先新增职位
          </div>
          <div className={style.addJob} onClick={()=>{window.open(window.location.origin+'/initPublish.html')}}>
            新增职位
          </div>
      </div>

       <div className={style.oneNone} style={{display:isShowRight}}>
           <div className={style.imgContainer}>
              <i className={style.spriteImg}></i>
           </div>
           <div className={style.noRecommond}>
             暂无简历
           </div>
           <div className={style.Toosimple}>
             你还未上传过简历，快去上传
           </div>
           <div className={style.complete} onClick={()=>{hashHistory.push(`/myTalents/uploadResume?job_id=${this.state.obj.job_id}`)}}>
             上传简历
           </div>
       </div>

      <div className={ style.wrap } style={{display:isShow1}}>
        <div className={style[leftClass]}>
          <div className={style.buttonWrap}>
            <button className={style.button} onClick={this.newJob}>+&nbsp;新增职位</button>
          </div>
          <div className={style.listWrap}>
            {
              leftJobList
            }
          </div>
        </div>
        <div   className={style[rightClass]} style={{display:isShowRight1}}>
          {
            title
          }
          <div ref='rightList' className={style[contentInnerClass]}>
            {
              rightjobList
            }
         </div>
        {
          pagenation
        }
        </div>
        {
          modalForDelete
        }
        {
          modalForTalent
        }
        {
          modalForTalentSuccess
        }
        {
          modalForApprove
        }
      </div>
</div>
    );
  }
}
const mapStateToProps = state => {
  return {
    localTalentSearchKey: state.localTalentSearchKey.search_key
  }
}

export default connect(mapStateToProps)(App)
