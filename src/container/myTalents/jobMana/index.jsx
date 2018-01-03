
/*系统的安装包*/
import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import style from './index.less';
import { jabMana,resume_zy,stop_job } from 'service/jobMana'
import Table from '../../../component/table';
import Confirm_modal from  '../../../component/confirm_modal';
import Pagination from '../../../component/pagination';
import {fSetCookieMes,fGetCookieMes} from '../../../utils/common'
class Offline_job extends React.Component{

  constructor(props){

    super(props)

    this.state = {

      page:1,
      maxPage:0,
      list:[]
    }
  }


  componentDidMount(){
    this.get_data(1)

  }

  get_data = (para)=>{

    var thiz = this;
    var list = [];
    jabMana({
      page:para,
      status:"offline"
    }).then(result => {

      const { success, data, message } = result
      if (success) {
        // api调用成功
        if(data.length > 0){

          for (var i = 0;i < data[0].length;i++){

            var _data = data[0][i];

            list.push({

              name:_data,
              update_time:_data.refresh_date,
              op:_data
            })
          }

          thiz.setState({

            list:list,
            page:data[1],
            maxPage:data[2]
          })

          thiz.props.handle({

            type:'refresh_account',
            ...data[3]
          })
        }
      } else {
        // api调用失败

      }
    })
  }

  page_handle = (page)=>{

    var para = {
      name:"list_job",
      page:page,
      status:"offline"
    }

    this.get_data(para)

  }

  get_type = (para)=>{

    if ('entry_safe' in para){

      return <span className={style.job_type}>入职保</span>


    }else if ('interview_safe' in para){
      /*刀面包*/
      return <span className={style.job_type}>到面保</span>


    }else if ('job_status' in para){

      return <span className={style.job_type}>直约保</span>

    }else{

      return;
    }
  }

  republish_job = (para)=>{
    fSetCookieMes("newPublish","4","30");
      window.open(`https://${location.host}/newPublish.html?job_id=`+para.job_id +'&republish=1');

  }
  fresh_job = (para)=>{

    function getCookie(cookieName) {
      var strCookie = document.cookie;
      var arrCookie = strCookie.split("; ");
      for(var i = 0; i < arrCookie.length; i++){
        var arr = arrCookie[i].split("=");
        if(cookieName == arr[0]){
          return arr[1];
        }
      }
      return "";
    }
    var user_id= getCookie('uid');
    window.localStorage.freshData = JSON.stringify({
      search_id: 'yb-7122759',
      user_id: user_id,
      channel_id: para.channel_id,
      job_id: para.job_id
    })
    window.open(`https://${location.host}/fresh_job_detail.html`);
  }
  click_job = (para)=>{

    window.open(`https://${location.host}/recruitment_preview.html?job_id=`+para.job_id)
  }


  render(){

    var thiz = this;
    const columns =
      [
        {
          key:"name",
          titleRender:()=>{

            return <p className={style.table_header_nobefore} style={{width:"400px"}}>下线职位</p>
          },

          render:(para)=>{

            return (
            <div>
              <div>

                <span className={style.on_job_name} onClick={thiz.click_job.bind(thiz,para)}>{para.name}</span>
             {/*   <span className={style.on_job_address}>({para.area_txt})</span>*/}
                {thiz.get_type(para)}

              </div>
              <div className={style.on_detail}>
                <span>{para.salary_from?para.salary_from+'-'+para.salary_to:'暂无'}</span>
                <span className={style.on_detail1}>|</span>
                <span>{para.work_year?para.work_year:'暂无'}</span>
                <span className={style.on_detail1}>|</span>
                <span>{para.degree_from?para.degree_from:'暂无'}</span>
                <span className={style.on_detail1}>|</span>
                <span>{para.area_txt?para.area_txt:'暂无'}</span>
              </div>
            </div>
            )
          }


        },
        {
          key:"update_time",
          titleRender:()=>{

            return <p className={style.table_header} style={{width:"400px"}}>更新时间</p>
          },

          render:(para)=>{

            return <span className={style.on_refresh_time}>{para}</span>
          }

        },
        {
          key:"op",

          titleRender:()=>{

            return  <p className={style.table_header} style={{width:"120px"}}>操作</p>
          },

          render:(para)=>{

            return (
              <div style={{width:'110px',textAlign:'right'}}>

                <span className={style.off_edit} onClick={thiz.republish_job.bind(thiz,para)}><span className={style.btn_hover}>再上线</span></span>
                <span style={{color:"#3285CA",display:"block",marginRight:'30px'}} onClick={thiz.fresh_job.bind(thiz,para)}><span className={style.btn_hover}>预览</span></span>
                {/*<span className={style.off_del}>删除</span>*/}
              </div>
            )

          }
        }

      ]

    return (

      <div className={style.on_container}>

        <div style={this.state.list.length == 0?{display:"none"}:{}}>

          <Table columns={columns} source={this.state.list}/>

          <div className={style.pag}>
            <div className={style.pagChlid}>
              {this.state.maxPage && <Pagination currentPage={this.state.page} totalPages={this.state.maxPage} pageCallback={this.page_handle.bind(this)}/>}
            </div>
          </div>

        </div>

        <div style={this.state.list.length != 0?{display:"none"}:{}} className={style.off_empty_div}>

          <img src={require('./img/2.png')} className={style.off_empty_img}/>
          <p className={style.on_empty_content}>暂没有下线职位</p>
        </div>

      </div>
    )
  }

}


class Empty_onJob extends React.Component{

  constructor(props){

    super(props)
  }

  go_publish = ()=>{
    fSetCookieMes('newPublish',4)
    location.href = `https://${location.host}/initPublish.html`;

  }

  render(){

    var thiz = this;
    return (
      <div className={style.on_empty_container}>

        <img src={require('./img/1.png')} className={style.on_empty_img}/>

        <p className={style.on_empty_content}>您还没新增职位，无法进行职位管理！</p>

        <input value="去新增职位" className={style.on_emmpty_btn} type="button" onClick={thiz.go_publish.bind(thiz)}/>

      </div>
    )
  }

}

class Online_job extends React.Component{

  constructor(props){

    super(props)

    this.state = {

      page:1,
      maxPage:0,
      list:[],
      confirm_modal_show:false,
      confirm_para:{},
      confirm_value:"确定下线该职位？",
      has_approve_company:1 , /*初始化位认证过的*/
      smallValue:"下线职位会导致该职位下的简历隐藏，上线后恢复显示"
    }
  }


  componentDidMount(){

    var thiz = this;
    var para = {
      page:1,

    }

    let dict = {
     /* name: "resume_zy",*/
      action:"check"
    };
    resume_zy({
      para,
      action:"check"
    }).then(result => {

      const { success, data, message } = result
      if (success) {
        // api调用成功

        thiz.setState({

          has_approve_company:data[0].has_approve_company,
          has_company_info:data[0].has_company_info
        })
        this.get_data(para)
      } else {
        // api调用失败

      }
    })

  }

  get_data = (para)=>{

    var thiz = this;
    var list = [];


    var _para = {

/*      name:"list_job",*/
      status:"published",
      ...para,
    }
    jabMana({
      status:"published",
      ...para,
    }).then(result => {

      const { success, data, message } = result
      if (success) {
        // api调用成功
        for (var i = 0;i < data[0].length;i++){

          var _data = data[0][i];
          var mtime = new Date(_data.mtime*1000);
          var com = mtime.toLocaleString();
          var y = mtime.getFullYear();
          var m = mtime.getMonth()+1;
          var d = mtime.getDate();
          var h = mtime.getHours();
          var f = mtime.getMinutes().toString();
          var ff = '';
          if(f.length == 1){
            ff = '0'+f;
          }else{
            ff = f
          }
          list.push({

            name:{..._data,tip_show:false},
            update_time:{u_time:y+'.'+m+'.'+d+' '+h+':'+ff,..._data},
            op:{..._data}
          })
        }

        thiz.setState({

          list:list,
          page:data[1],
          maxPage:data[2]
        })

        thiz.props.handle({

          type:'refresh_account',
          ...data[3]
        })
      } else {
        // api调用失败

      }
    })

  }

  page_handle = (page)=>{
    var para = {
      page:page,
    }

    this.get_data(para)

  }

  get_type = (para)=>{

    if ('entry_safe' in para){

      return <span className={style.job_type}>入职保</span>


    }else if ('interview_safe' in para){
      /*刀面包*/
      return <span className={style.job_type}>到面保</span>


    }else if ('job_status' in para){

      return <span className={style.job_type}>直约保</span>

    }else{

      return;
    }
  }

  click_job = (para)=>{

    window.open(`https://${location.host}/recruitment_preview.html?job_id=`+para.job_id)
  }

  edit_job = (para)=>{
    fSetCookieMes("newPublish","4","30");
    window.open(`https://${location.host}/newPublish.html?job_id=`+para.job_id)

  }

  offline_job = (para)=>{



    this.setState({

      confirm_modal_show:true,
      confirm_para:{

        ...para
      }
    })
  }

  confirm_callback = (val)=>{

    this.setState({

      confirm_modal_show:false
    })

    var thiz = this;
    if (val){

      var _para = this.state.confirm_para;

      var para = {


        job_id: _para.job_id ,
        channel_id: _para.channel_id
      }
      stop_job({
        job_id: _para.job_id ,
        channel_id: _para.channel_id
      }).then(result => {

        const { success, data, message } = result
        if (success) {
          // api调用成功
          var para_get = {
            page:1,
          }
          thiz.get_data(para_get)
        } else {
          // api调用失败

        }
      })
    }
  }

  fresh_job = (para)=>{


    function getCookie(cookieName) {
      var strCookie = document.cookie;
      var arrCookie = strCookie.split("; ");
      for(var i = 0; i < arrCookie.length; i++){
        var arr = arrCookie[i].split("=");
        if(cookieName == arr[0]){
          return arr[1];
        }
      }
      return "";
    }
    var user_id= getCookie('uid');
    window.localStorage.freshData = JSON.stringify({
      search_id: 'yb-7122759',
      user_id: user_id,
      channel_id: para.channel_id,
      job_id: para.job_id
    })
    window.open(`https://${location.host}/fresh_job_detail.html`);
  }
  get_refresh_status = (para)=>{
    return <span style={{color:"#3285CA",dispaly:"block",marginRight:'24px',letterSpacing:'2.36px'}} onClick={this.fresh_job.bind(this,para)}><span className={style.btn_hover}>预览</span></span>
  }

  mouse_do = (index,flag)=>{

    var _state = {...this.state};

    _state.list[index].name.tip_show = flag;

    this.setState(_state);
  }

  get_tip = (para,index)=>{

    var thiz = this;

    if(thiz.state.has_approve_company == 1 && thiz.state.has_company_info == 1)
      return;

    return (

      <div className={style.tip_icon} onMouseEnter={thiz.mouse_do.bind(thiz,index,true)}
           onMouseLeave={thiz.mouse_do.bind(thiz,index,false)}>

        <img src={require('./img/tip.png')}/>

        <div className={style.tip_message_div} style={para.tip_show?{}:{display:"none"}}>

          <p className={style.tip_message_line1}>你的职位暂时无法展示给求职者</p>
          <span>需要您</span>
          <span className={style.tip_span} onClick={thiz.modCom.bind(thiz)}>完善公司资料</span>
          <span>并进行</span>
          <span className={style.tip_span} onClick={thiz.proCom.bind(thiz)}>企业认证</span>
          <span>哦</span>
        </div>

      </div>
    )

  }

  modCom = () => {
    location.href = `https://${location.host}/setting.html?company`
  }

  proCom = () => {
    location.href = `https://${location.host}/channel_manager.html`
  }

  render(){

    var thiz = this;

    const columns =
      [
        {
          key:"name",
          titleRender:()=>{

            return <p className={style.table_header_nobefore} style={{width:"400px"}}>在招职位</p>
          },

          render:(para,index)=>{

            return (
            <div>
              <div>

                <span className={style.on_job_name} onClick={thiz.click_job.bind(thiz,para)}>{para.name}</span>
          {/*      <span className={style.on_job_address} onClick={thiz.click_job.bind(thiz,para)}>({para.area_txt || "无限"})</span>*/}
                {thiz.get_type(para)}

                {thiz.get_tip(para,index)}
              </div>
              <div className={style.on_detail}>
                <span>{para.salary_from?para.salary_from+'-'+para.salary_to:'暂无'}</span>
                <span className={style.on_detail1}>|</span>
                <span>{para.work_year?para.work_year:'暂无'}</span>
                <span className={style.on_detail1}>|</span>
                <span>{para.degree_from?para.degree_from:'暂无'}</span>
                <span className={style.on_detail1}>|</span>
                <span>{para.area_txt?para.area_txt:'暂无'}</span>
              </div>
            </div>
            )
          }


        },
        {
          key:"update_time",
          titleRender:()=>{

            return <p className={style.table_header} style={{width:"320px"}}>更新时间</p>
          },

          render:(para)=>{

            return  <div>
                         <span className={style.on_refresh_time}>{para.u_time}</span>
                      <span className={style.on_isComplete} style={{display:para.completed?'none':'block'}}>为了获得更精准的简历匹配，请完善职位信息</span>
                    </div>

          }

        },
        {
          key:"op",

          titleRender:()=>{

            return  <p className={style.table_header} style={{width:"200px"}}>操作</p>
          },

          render:(para)=>{

            return <div style={{textAlign:'right',paddingRight:'35px'}}>

              <span className={style.on_edit} onClick={thiz.edit_job.bind(thiz,para)}><span className={style.btn_hover}>编辑</span></span>

              <span className={style.on_offline} onClick={thiz.offline_job.bind(thiz,para)}><span className={style.btn_hover}>下线</span></span>

              {thiz.get_refresh_status(para)}
            </div>

          }
        }

      ]

    return (

      <div className={style.on_container}>

        <Confirm_modal show={this.state.confirm_modal_show} handle={this.confirm_callback.bind(this)} value={this.state.confirm_value} smallValue={this.state.smallValue}/>

        <div style={this.state.list.length == 0?{display:"none"}:{}}>

          <Table columns={columns} source={this.state.list}/>

          <div className={style.pag}>
            <div className={style.pagChlid}>
              {this.state.maxPage && <Pagination currentPage={this.state.page} totalPages={this.state.maxPage} pageCallback={this.page_handle.bind(this)}/>}
            </div>
          </div>

        </div>

        <div style={this.state.list.length != 0?{display:"none"}:{}}>

          <Empty_onJob />
        </div>

      </div>
    )
  }

}

export default class Job_Mana extends React.Component {

  constructor(props){

    super(props);

    this.state = {

      online_title:"在招职位",
      offline_title:"下线职位",
      current:1,
    }
  }

  componentDidMount(){
    /*zhugeioWithTrack('【职位管理】浏览量');*/
  }

  get_current_style = (index)=>{

    return index == this.state.current?{border: '1px solid #3C9FF0',color:"#3C9FF0"}:{}
  }

  select_tab = (index)=>{

/*    index == 1 ? zhugeioWithTrack('【职位管理】在招职位') : zhugeioWithTrack('【职位管理】下线职位');*/
    if (index != this.state.current){

      this.setState({
        current:index
      })
    }
  }

  tab_callback = (para)=>{

    if (para.type == 'refresh_account'){

      var _state = {...this.state};

      _state.online_title = "在招职位("+para.published+")";
      _state.offline_title = "下线职位("+para.offline+")";

      this.setState(_state);
    }
  }


  publish_job = (para)=>{
    fSetCookieMes("newPublish","4","30");
    console.log('职位架构新增',fGetCookieMes("newPublish"));
    window.open(`https://${location.host}/initPublish.html`);
  }

  render(){

    var thiz = this;
    return (

      <div className={style.container}>

        <div className={style.header}>

          <input value={this.state.online_title} type="button" onClick={thiz.select_tab.bind(this,1)}
                 className={style.btn_group} style={this.get_current_style(1)}/>

          <input value={this.state.offline_title} type="button" onClick={thiz.select_tab.bind(this,2)}
                 className={style.btn_group} style={this.get_current_style(2)}/>

          <input value="新增职位" className={style.pub_btn} type="button" onClick={this.publish_job.bind(thiz)}/>
        </div>

        {

          ['b'].map(function(){

            if (thiz.state.current == 1){

              return <Online_job handle={thiz.tab_callback.bind(thiz)} key="on_mana"/>

            }else {

              return <Offline_job handle={thiz.tab_callback.bind(thiz)} key="off_mana"/>
            }

          })
        }

      </div>
    )
  }
}

