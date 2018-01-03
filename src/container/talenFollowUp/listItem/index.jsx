import React, { Component } from 'react'

import style from './index.less'
import Checkbox from '../../../component/checkbox'

export default class ResumeList extends Component {
  constructor(props){
    super(props);
    this.state = {
      perfect: false,
      mouseOpacity: false, // 鼠标划入到优选标签
      mouseHighend: false, // 鼠标滑到高端人才标签
    };
    this.mouseInorOut = this.mouseInorOut.bind(this); // 鼠标的移入移出显示下面的标签
    this.scroll = this.scroll.bind(this); // 滚动事件
  }
  componentDidMount(){
    document.addEventListener('scroll', this.scroll);
  }
  componentWillUnMount(){
    document.removeEventListener('scroll', this.scroll);
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
  changeChecked = (boolean) => {
    this.setState({perfect: boolean});
  }
  render(){
    const { resumeList, opened, highEnd, preference, resumeCon, basicInfo, workExperiences, resumeScore, operation } = style;
    return (
      <div className={resumeList} onClick={() => {console.log('点击了最外面的方块')}}>
        <div className={style.checkbox}>
          <Checkbox id={"my"+this.props.id} checked={this.perfect} handle={this.changeChecked} />
        </div>
        <span className={highEnd}></span>
        <div className={resumeCon}>
          <div className={basicInfo}>
            <div className={style.infoCon}>
              <div className={style.nameLabel}>
                <span>吴先生</span>
                <div className={style.perLabel}>
                  <span
                    onMouseEnter={() => {this.mouseInorOut('mouseOpacity', true)}}
                    onMouseLeave={() => {this.mouseInorOut('mouseOpacity', false)}}
                  >优选</span>
                  {
                    this.state.mouseOpacity && <i>有求职意向的优质候选人</i>
                  }
                </div>
                <div className={style.highLabel}>
                  <span
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
                  <span>男</span>
                  <span>23</span>
                  <span>杭州 - 西湖区</span>
                </p>
                <p>
                  <span>10年工作经验</span>
                  <span>10k - 14k</span>
                </p>
                <p>
                  <span>中国师范大学计算机以及自动化辅助研究学院</span>
                  <span>医学系电子科室的计算机成像专业</span>
                  <span>博士研究生</span>
                </p>
              </div>
              <div className={style.labels}>
                <span>快速响应</span>
                <span>重本院校</span>
                <span>2年工作经验</span>
              </div>
            </div>
          </div>
          <div className={workExperiences}>
            <div className={style.expPos}>
              <div className={style.expCon}>
                <dl>
                  <dt>2017.05 - 至&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;今</dt>
                  <dd><span>杭州观天科技有限公司杭州观天科技有限公司</span> <i>-</i> <span>JAVA工程师JAVA工程师</span></dd>
                </dl>
                <dl>
                  <dt>2016.05 - 2017.05</dt>
                  <dd className={style.active}>
                    <span>杭州观天科技有限公司杭州观天科技有限公司</span> <i>-</i> <span>JAVA工程师JAVA工程师</span>
                  </dd>
                </dl>
                <dl>
                  <dt>2015.12 - 2016.05</dt>
                  <dd><span>杭州观天科技有限公司杭州观天科技有限公司</span> <i>-</i> <span>JAVA工程师JAVA工程师</span></dd>
                </dl>
              </div>
              <div className={style.labels}>
                <span>SSH</span>
                <span>MongoDB</span>
                <span>JavaScript</span>
              </div>
            </div>
          </div>
          <div className={resumeScore}>
            <div className={style.scoreLabel}>
              <span className={style.score}>95%</span>
              <span>匹配度</span>
            </div>
          </div>
          <div className={style.select}>有求职意愿</div>
          <div className={operation}>
            <div className={style.opeCon}>
              <span className={style.contact} onClick={e => {
                if(e.preventBubble){
                  e.preventBubble();
                }else{
                  e.stopPropagation();
                }
                console.log('点击了转发');
              }}>转发</span>
              <span className={style.text} onClick={e => {
                if(e.preventBubble){
                  e.preventBubble();
                }else{
                  e.stopPropagation();
                }
                console.log('点击了不合适');
              }}>不合适</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
