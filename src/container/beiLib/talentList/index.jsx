import React, { Component } from 'react'
import cs from 'classnames'
import PropTypes from 'prop-types'

import style from './index.less'

import { recordResume } from 'service/beiLib'

export default class ResumeList extends Component {
  constructor(props){
    super(props);
    this.state = {
      mouseOpacity: false, // 鼠标划入到优选标签
      mouseHighend: false, // 鼠标滑到高端人才标签
    };
    this.mouseInorOut = this.mouseInorOut.bind(this); // 鼠标的移入移出显示下面的标签
    this.scroll = this.scroll.bind(this); // 滚动事件
    this.operateResume = this.operateResume.bind(this); // 立即联系，激活人才或者是点击不合适
  }
  componentDidMount(){
    // document.addEventListener('scroll', this.scroll);
  }
  componentWillUnMount(){
    // document.removeEventListener('scroll', this.scroll);
  }
  mouseInorOut(type, boolean){
    this.setState({[type]: boolean});
  }
  scroll(){
    const body = document.documentElement;
    if(body.scrollTop + body.clientHeight === body.scrollHeight){
      console.log('滚动到底部了');
    }
  }
  operateResume(type, id){
    if(type === 'highEnd'){ // 联系人才
      contactCb && contactCb(id)
    }else if(type === 'opacity'){ // 激活人才
      activateCb && activateCb(id)
    }else if(type === 'noSuit'){ // 不合适
      activateCb && activateCb(id)
    }
  }
  recordResume = (id) => {
    recordResume({resume_id: id});
  }
  render(){
    const { resumeList, opened, highEnd, preference, resumeCon, basicInfo, workExperiences, resumeScore, operation } = style;
    const { is_read, name, gender, age, residence, seniority,
      full_salary, university, major, degree, experiences_tags,
      experiences, recordResume, jumpPageCb, quality_score,
      suitability, talent, resume_type, id,workplace_skills_tags
    } = this.props;
    const expArray = (experiences.length === 1) ? ['', experiences[0], ''] : (experiences.length === 2) ? [...experiences, ''] : (experiences.length >=3 ) ? experiences : [];
    return (
    <div className={cs({[resumeList]: true, [opened]: is_read})} onClick={() => {jumpPageCb && jumpPageCb(this.recordResume, id)}}>
      <span className={ resume_type === 1 ? highEnd : talent ? preference : ''}></span>
      <div className={resumeCon}>
        <div className={basicInfo}>
          <div className={style.infoCon}>
            <div className={style.nameLabel}>
              <span>{name}</span>
              {
                talent && <div className={style.perLabel}>
                  <span
                    onMouseEnter={() => {this.mouseInorOut('mouseOpacity', true)}}
                    onMouseLeave={() => {this.mouseInorOut('mouseOpacity', false)}}
                  >优选</span>
                  {
                    this.state.mouseOpacity && <i>有求职意向的优质候选人</i>
                  }
                </div>
              }
              {
                resume_type === 1 && <div className={style.highLabel}>
                  <span
                    onMouseEnter={() => {this.mouseInorOut('mouseHighend', true)}}
                    onMouseLeave={() => {this.mouseInorOut('mouseHighend', false)}}
                  >高端</span>
                  {
                    this.state.mouseHighend && <i>确认有求职意愿的优选人才</i>
                  }
                </div>
              }
            </div>
            <div className={style.info}>
              <p>
                {gender && <span>{gender}</span>}
                {age && <span>{age}</span>}
                {residence && <span>{residence}</span>}
              </p>
              <p>
                <span>{seniority}工作经验</span>
                <span>{full_salary}</span>
              </p>
              <p>
                {university && <span>{university}</span>}
                {major && <span>{major}</span>}
                {degree && <span>{degree}</span>}
              </p>
            </div>
            <div className={style.labels}>
            {
                experiences_tags.map((item, index) => {
                  if(index < 3){
                    return <span key={index}>{ item }</span>;
                  }else{
                    return null;
                  }
                })
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
                  workplace_skills_tags.map((item, index) => {
                    if(index < 3){
                      return <span key={index}>{ item }</span>;
                    }else{
                      return null;
                    }
                  })
                }

              </div>

          </div>
        </div>
        <div className={resumeScore}>
          <div className={style.scoreLabel}>
          </div>
        </div>
        <div className={operation}>
          <div className={style.opeCon}>
            <div className={style.scoreLabel}>
              <span className={style.score}>{quality_score}</span>
              <span>综合评分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}


ResumeList.propTypes = {
  contactCb: PropTypes.func,
  activateCb: PropTypes.func,
  refuseCb: PropTypes.func
}
