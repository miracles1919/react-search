import React, { Component } from 'react'
import style from './index.less'
import Checkbox from 'component/checkbox'
import Transmit_modal from '../transmit_modal/index.jsx';
import { recordResume } from 'service/beiLib'
import cs from 'classnames'


export default class ResumeList extends Component {
  constructor(props){
    super(props);
    this.state = {
      perfect: false,
      mouseOpacity: false, // 鼠标划入到优选标签
      mouseHighend: false, // 鼠标滑到高端人才标签
      talent:"none",  //优选标签隐藏
      resumeType:"none",  //高端人才标签隐藏
      transmit_modal_show:false, //转发弹框
      list:[{job_name:"",resume_id:"",channel_job_id:"",email:"",name:""}],
      isforward:""    //0代表转发  1代表不合适
    };
    this.mouseInorOut = this.mouseInorOut.bind(this); // 鼠标的移入移出显示下面的标签

  }
  componentDidMount(){

  }
  componentWillUnmount(){

  }
  mouseInorOut(type, boolean){
    this.setState({[type]: boolean});
  }
  many_transmit_func = ()=>{
    var para = [];
    var flag = false;
    for (var i = 0;i < this.state.listData.length;i++){
      if (this.state.listData[i].checkbox == true){
        para.push(this.state.listData[i].para);
        flag = true;
      }
    }
    if (!flag)
      return;
    this.setState({
      many_transmit:para,
      transmit_modal_show:true,
    })
  }
  transmit_callback = (val,para)=>{
    this.setState({
      transmit_modal_show:false
    })
    if (val == true){
    }
  }
  recordResume = (id) => { // 记录简历
    return recordResume({resume_id: id});
  }
  render(){
    const {resumeList, opened, highEnd, preference, resumeCon, basicInfo, workExperiences, resumeScore, operation } = style;
    const {job_name, resume_id,channel_job_id,email,process,zy_status,area,name, gender, age, residence, seniority,
      full_salary, university,major, degree, experiences_tags,
      experiences, is_read, job_id,
      suitability,phone, talent, resume_type, id,workplace_skills_tags,educations,
      checkHandle, nosuitArr, jumpPageCb, resume_from
    } = this.props;
    const expArray = (experiences.length === 1) ? ['', experiences[0], ''] : (experiences.length === 2) ? [...experiences, ''] : (experiences.length >=3 ) ? experiences : [];
    return (
      <div className={cs({[resumeList]: true, [opened]: is_read})}>
        <Transmit_modal show={this.state.transmit_modal_show} list={this.state.list}
                        handle={this.transmit_callback.bind(this)}/>
        {
          zy_status === 0 ?
            <div className={style.checkbox}>
              <Checkbox id={"my"+this.props.id} checked={nosuitArr.indexOf(id) === -1 ? false : true}  handle={() => {checkHandle(id)}} />
            </div>
            : null
        }
        <span className={ resume_type === 1 ? highEnd : talent ? preference : ''}></span>
        <div className={resumeCon} onClick={() => {
          {/*this.recordResume(id).then(() => {
            jumpPageCb && jumpPageCb()
          })*/}
          window.open(`${location.origin}/talent_resume_details.html?id=${id}&job_id=${job_id}&job_name=${job_name}&type=search&type=${resume_from === 'local' ? resume_from : 'search'}&from=5`)
        }}>
          <div className={basicInfo}>
            <div className={style.infoCon}>
              <div className={style.nameLabel}>
                <span>{name}</span>
                <div className={style.perLabel}>
                  <span style={talent?{"display":"block"}:{"display":"none"}}
                    onMouseEnter={() => {this.mouseInorOut('mouseOpacity', true)}}
                    onMouseLeave={() => {this.mouseInorOut('mouseOpacity', false)}}
                  >优选</span>
                  {
                    this.state.mouseOpacity && <i>有求职意向的优质候选人</i>
                  }
                </div>
                <div className={style.highLabel} >
                  <span style={resume_type?{"display":"block"}:{"display":"none"}}
                    onMouseEnter={() => {this.mouseInorOut('mouseHighend', true)}}
                    onMouseLeave={() => {this.mouseInorOut('mouseHighend', false)}}
                  >高端</span>
                  {
                    this.state.mouseHighend && <i>确认有求职意愿的优选人才</i>
                  }
                </div>
              </div>
              <div className={style.info}>
                <p>
                  <span>{gender}</span>
                  <span>{age}</span>
                  <span>{area}</span>
                </p>
                <p>
                  <span>{seniority}</span>
                  <span>{full_salary}</span>
                </p>
                <p>
                  <span>{university?university:""}</span>
                  <span>{major?major:""}</span>
                  <span>{degree?degree:""}</span>
                </p>
              </div>
              <div className={style.labels}>
                {
                  experiences_tags.length ? experiences_tags.map((item, index) => {
                    return <span key={index}>{item}</span>
                  }) : ""
                }
              </div>
            </div>
          </div>
          <div className={workExperiences}>
            <div className={style.expPos}>
              <div className={style.expCon}>
                {
                  expArray.length ? expArray.map((item, index) => {
                      if (index < 3) {
                        if(item){
                          return <dl key={index}>
                            <dt>{item.period[0]}-{item.period[1]}</dt>
                            <dd className={item.highlight ? [style.active] : ''}><span>{item.company}</span> <i>-</i> <span>{item.duty}</span></dd>
                          </dl>
                        }
                        return <dl key={index}>
                          <dt></dt>
                          <dd></dd>
                        </dl>
                      } else {
                        return null
                      }
                    }) : [' ', '暂无从业经历', ' ', ].map((item, index) => <dl key={index} className={style.noExp}>
                    <dt></dt>
                    <dd>{item}</dd>
                  </dl>)
                }
              </div>
              <div className={style.labels}>
                {
                  workplace_skills_tags.length ? workplace_skills_tags.map((item, index) => {
                    if(index < 3){
                      return <span key={index}>{item}</span>
                    }else{
                      return null;
                    }
                  }) : ""
                }
              </div>
            </div>
          </div>
          <div className={resumeScore}>
            <div className={style.scoreLabel}>
              <span className={style.score}>{suitability}%</span>
              <span>匹配度</span>
            </div>
          </div>
          <div className={style.select}>
            <div className={style.selectCon}>
              <p>{zy_status === 1 ? '待回复' : zy_status === 0 ? '有求职意愿' : zy_status === -2 ? '不合适' :'无求职意愿'}</p>
              {phone && <p>{phone}</p>}
              {email && <p>{email}</p>}
            </div>
          </div>
          <div className={operation}>
            <div className={style.opeCon}>
              {
                zy_status === 0 ?
                  <span className={style.text} onClick={e => {
                    if(e.preventBubble){
                      e.preventBubble();
                    }else{
                      e.stopPropagation();
                    }
                    this.props.handle && this.props.handle(id)
                  }}>不合适</span>
                  : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
