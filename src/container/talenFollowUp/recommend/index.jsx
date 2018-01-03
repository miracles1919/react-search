import React, { Component } from 'react'
import { Link } from 'react-router'
import cs from 'classnames'
import { dailyFreeResume } from 'service/beiLib'

import ResumeList from '../listItem'
import Checkbox from '../../../component/checkbox'
import Pagination from '../../../component/pagination';

import styles from './index.less'


export default class Recommend extends Component{
  constructor(props){
    super(props);
    this.state = {
      perfect: false, // 优选人才的checked
      leftFixed: false, // 左侧的新增职位的固定定位
      tableFixed: false, // 右侧的表格头部的固定定位
    };
    this.scroll = this.scroll.bind(this);
  }
  componentDidMount(){
    document.addEventListener('scroll', this.scroll)
    dailyFreeResume({
      user_id: 1752000021,
      job_id: 1752000025
    }).then(res => {
      console.log(res)
    })
    this.changeSelect();
  }
  componentWillUnMount(){
    document.removeEventListener('scroll', this.scroll)
  }
  scroll(){
    // const scrollElement = document.documentElement;
    const scrollElement = document.body;
    const scrollTop = scrollElement.scrollTop;
    if(scrollTop < 184){
      this.setState({leftFixed: false,tableFixed: false});
    }else if(scrollTop >= 184 && scrollTop < 284) {
      this.setState({leftFixed: true, tableFixed: false});
    }else if(scrollTop >= 284){
      this.setState({leftFixed: true, tableFixed: true});
    }
    console.log(scrollTop);
  }
  changeChecked = (boolean) => {
    this.setState({perfect: boolean});
  }
  changeSelect=()=>{
    var lis=document.querySelectorAll("#ul li");
    var ul=document.querySelector("#ul");
    var span=document.querySelector("#span");
    var text
    span.innerHTML=lis[0].innerHTML;
    span.addEventListener("mouseover",function () {
      ul.style.display="block";
      // span.style.display="none";
      span.innerHTML=" ";
    })
    span.addEventListener("mouseout",function () {
      ul.style.display="none";

    })
    ul.addEventListener("mouseover",function () {
      ul.style.display="block";
      span.innerHTML=" ";
    })
    ul.addEventListener("mouseout",function () {
      ul.style.display="none";
      span.style.display="block";
      span.innerHTML=lis[0].innerHTML;
    })
    for(let i=0;i<9;i++){
      lis[i].addEventListener("click",function () {
        ul.style.display="none";
        text=lis[0].innerHTML;
        lis[0].innerHTML=this.innerHTML;
        span.innerHTML=this.innerHTML;
        this.innerHTML=text;
      })
    }
  }
  render(){
    const { perfect, leftFixed, tableFixed } = this.state;
    return (
      <div className={styles.recommend}>
        <div className={cs({[styles.addNewCareer]: true, [styles.fixed]: leftFixed})}>
          <div className={styles.addBtnCon}>
            <span className={styles.addBtn}>+ 新增职位</span>
          </div>
          <ul className={styles.careerCon}>
            {
              [1,2,3,4,5,6,7,8,9,10].map((item, index) => <li className={styles.career} key={item + '_' + index}>
                <div className={styles.introCon}>
                  <span className={styles.intro}>产品经理</span>
                  <span className={styles.edit}>编辑</span>
                </div>
                <div className={styles.base}>
                  <span className={styles.baseYear}>10-15年</span>
                  <span className={styles.baseSalary}>99k-100k</span>
                  <span className={styles.baseDegree}>博士</span>
                </div>
                {/*<p className={styles.tip}>信息待完善</p>*/}
              </li>)
            }
          </ul>
        </div>
        <div className={styles.recommendResumes}>
          {/*<div className={styles.bannerLit}>*/}
            {/*<img src={require('./imgs/recommend_banner.png')}/>*/}
          {/*</div>*/}
          <div className={styles.resumesCon}>
            <div className={cs({[styles.resumeHead]: true, [styles.fixed]: tableFixed})}>
              <div className={styles.titlePart1}>

                <div className={styles.selectCon}>
                  <Checkbox id="myCheckbox" checked={perfect} handle={this.changeChecked} />
                </div>
                <span className={styles.baseZh}>基本信息</span>


              </div>
              <div className={styles.titlePart2}>
                <span>从业经历</span>
              </div>
              <div className={styles.titlePart3}>
                <span>匹配度</span>
              </div>
              <div className={styles.state} >
                {/*<select>*/}
                  {/*<option value ="1">有求职意向</option>*/}
                  {/*<option value ="2">不限</option>*/}
                  {/*<option value="3">待回复</option>*/}
                  {/*<option value="4">已拒绝</option>*/}
                  {/*<option value="4">待处理</option>*/}
                  {/*<option value="4">转发评审</option>*/}
                  {/*<option value="4">已经约面试</option>*/}
                  {/*<option value="4">已录用</option>*/}
                  {/*<option value="4">不合格</option>*/}
                {/*</select>*/}
                <span id="span"></span><i></i>
                <ul className={styles.ul} id="ul">
                  <li>有求职意向</li>
                  <li>不限</li>
                  <li>待回复</li>
                  <li>已拒绝</li>
                  <li>待处理</li>
                  <li>转发评审</li>
                  <li>已经约面试</li>
                  <li>已录用</li>
                  <li>不合格</li>
                </ul>
              </div>
              <div className={styles.titlePart4}>
                <span>操作</span>
              </div>
            </div>
            <div className={styles.resumes}>
              {
                [1,2,3,4,5,6,7,8,9,10,11].map((item, index) => <ResumeList key={index} id={index}/>)
              }
            </div>
          </div>
          <div className={styles.PaginationBox}>
            <Pagination currentPage={1} totalPages={20} pageCallback={[]}/>
          </div>
        </div>
      </div>
    )
  }
}
// style={{marginTop:"30px",paddingLeft:"290px"}}
