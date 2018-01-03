import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchUserinfo, fetchSign } from 'action/user'
import { HOST } from '../../utils/common'
import { is_sign,sign_new,magnifier_list,list_channel } from 'service/talent'
import {fSetCookieMes,fGetCookieMes} from '../../utils/common'
import PropTypes from 'prop-types'
// import classnames from 'classnames'
import styles from './Header.less'
class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nav: [{
        name: '工作台',
        link: '/work_desk.html',
      }, {
        name: '辈出人才库',
        link: '/dist_new/index.html#/beiLib',
      }, {
        name: '我的人才库',
        link: '/dist_new/index.html#/myTalents',
      }, {
        name: '服务商店',
        link: '/s_store.html',
      }],
      show_li:false,
      show_per:false,
      show_mes:false,
      li_img:require('./img/new_li_img.png'),
      per_img:require('./img/new_per_img.png'),
      mes_img:require('./img/new_mes_img.png'),
      unRead:0,
      unReadRecord:[],
      signed:false,
      channel_id_list:[],

    };

  }

  componentDidMount(){
   // this.is_signed();
   this.list_ch();
   const { dispatch } = this.props;
   dispatch(fetchUserinfo({action: 'check'}))
   dispatch(fetchSign())

  }
  componentWillReceiveProps({userInfo}){
    this.setState({signed: userInfo.signed})
  }

  list_ch = () => {
    let thiz = this
    list_channel({
      account:fGetCookieMes('account'),
    }).then(result => {

      const { success, data, message } = result
      if (success) {
        // api调用成功

        let list = []
        for (let i = 0;i< data[0].length;i++){
          if(data[0][i].channel_id){
            list.push(data[0][i].channel_id)
          }
        }
        thiz.readList(list)
      } else {
        // api调用失败
        console.log(message)
      }
    })
  }
  readList = (list) => {
    let thiz = this
    magnifier_list({
      is_all:false,
      channel_id_list:list,
      account:fGetCookieMes('account'),
    }).then(result => {

      const { success, data, message } = result
      if (success) {
        // api调用成功
         let num = 0;
         if(data[0].num_entries > 30){
           num = '30+'
         }else{
           num = data[0].num_entries
         }
        thiz.setState({
          unRead:num,
          unReadRecord:data[0].messages
        })
      } else {
        // api调用失败
        console.log(message)
      }
    })
  }

  is_signed = () => {
    let thiz = this
    is_sign({
    }).then(result => {

      const { success, data, message } = result
      if (success) {
        // api调用成功

          thiz.setState({
            signed:data[0].signed
          })
      } else {
        // api调用失败
        console.log(message)
      }
    })
  }

  sign = () => {
    let thiz = this
    sign_new({
    }).then(result => {

      const { success, data, message } = result
      if (success) {
        // api调用成功

          thiz.setState({
            signed:data[0].signed
          })
      } else {
        // api调用失败
        console.log(message)
      }
    })
  }

  show_li = () =>{
    this.setState({
      show_li:true,
      li_img:require('./img/new_li_hover.png')
    })
  }

  hide_li = () => {
    this.setState({
      show_li:false,
      li_img:require('./img/new_li_img.png'),
    })
  }

  show_per = () =>{
    this.setState({
      show_per:true,
      per_img:require('./img/new_per_hover.png')
    })
  }

  hide_per = () => {
    this.setState({
      show_per:false,
      per_img:require('./img/new_per_img.png'),
    })
  }

  show_mes = () =>{
    this.setState({
      show_mes:true,
      mes_img:require('./img/new_mes_hover.png')
    })
  }

  hide_mes = () => {
    this.setState({
      show_mes:false,
      mes_img:require('./img/new_mes_img.png'),
    })
  }

  account_manage = () => {
    location.href = `https://${location.host}/setting.html?manage`
  }

  account_info = () => {
    location.href = `https://${location.host}/setting.html?personal`
  }

  company_info = () => {
    location.href = `https://${location.host}/setting.html?company`
  }

  channel = () => {
    location.href = `https://${location.host}/channel_manager.html`
  }

  go_shop = () => {
    location.href = `https://${location.host}/scoreShop.html`
  }
  get_beike = () => {
    location.href = `https://${location.host}/getBeike.html`
  }
  login_out = () => {
    document.cookie = "uid=;path=/";
    document.cookie = "token=;path=/";
    document.cookie = "account=;path=/";
    document.cookie = "company_id=;path=/";
    document.cookie = "talent_token=;path=/";
    document.cookie = "talent_user_id=;path=/";
    document.cookie = "register_phone=;path=/";
    location.href =  `https://${location.host}/hr.html?fromurl=`+ window.location.pathname.substr(1);
  }

  readAll = () => {
    location.href =  `https://${location.host}/pony_message.html`;
/*    let thiz = this
    magnifier_list({
      account:fGetCookieMes('account'),
      is_all:true
    }).then(result => {

      const { success, data, message } = result
      if (success) {
        // api调用成功

        thiz.setState({
          unReadRecord:data[0].messages
        })
      } else {
        // api调用失败
        console.log(message)
      }
    })*/
  }

  li_click = (val) => {
    console.log('进入消息')
    let thiz = this
    magnifier_list({
      account:fGetCookieMes('account'),
      combine_user_id_message_id:val.combine_user_id_message_id
    }).then(result => {

      const { success, data, message } = result
      if (success) {
        // api调用成功
        console.log('点击成功',val.combine_user_id_message_id)
        this.readList()
      } else {
        // api调用失败
        console.log(message)
      }
    })
  }

  go_page = (val) => {
    console.log('我是最新的')
    location.href = `https://${location.host}${val.link}`
  }

  get_current = (a) => {

    if(location.href.indexOf(a.link) != -1){

      return {color:'#008CFF',borderBottom:'3px #008CFF solid'}
    }

    return {}
  }

  render() {
   let thiz = this

    return (
      <div>
        <div className={styles.header}>
          <div className={styles.wrap}>
            <img className={styles.logo} src={require('./img/logo.png')} alt="logo" />
            <ul className={styles.nav}>
              {
                this.state.nav.map((item, index) => {
                  return (<li style={thiz.get_current(item)} className={styles.navLi} key={`li${index}`} onClick={thiz.go_page.bind(this,item)}>{item.name}</li>)
                })
              }
            </ul>
            <div className={styles.message}>
              <div className={styles.title_person_setting}
                   onMouseEnter={this.show_per.bind(this)}
                   onMouseLeave={this.hide_per.bind(this)}>
                <img src={this.state.per_img} className={styles.tip_service_img3}/>
                <div className={styles.proves}></div>
                <div className={styles.hs_title_setting} style={{display:this.state.show_per?'block':'none'}}>
                  <em className={styles.per_jian}></em>
                  <span className={styles.per_span}></span>
                    <ul className={styles.title_setting}>
                        <li className={styles.title_li} onClick={this.account_manage.bind(this)}>
                          <img className={styles.title_li_img} src={require('./img/account_manage.png')}/>账号管理
                        </li>
                      <li className={styles.title_li} onClick={this.account_info.bind(this)}>
                        <img className={styles.title_li_img} src={require('./img/account_info.png')}/>个人资料
                      </li>
                      <li className={styles.title_li} onClick={this.company_info.bind(this)}>
                        <img className={styles.title_li_img} src={require('./img/company_info.png')}/>公司主页
                      </li>
                      <li className={styles.title_li} onClick={this.channel.bind(this)}>
                        <img className={styles.title_li_img} src={require('./img/channel.png')}/>企业认证
                      </li>
                      <li  className={styles.title_li} style={{position:'relative'}} onClick={this.login_out.bind(this)}>
                          <span style={{position:'absolute',left:'30px',lineHeight:'2'}}>
                            <img className={styles.title_li_img} src={require('./img/login_out.png')}/>退出
                          </span>
                      </li>
                    </ul>
                </div>
              </div>
              <div className={styles.hs_activity}
                   onMouseEnter={this.show_li.bind(this)}
                   onMouseLeave={this.hide_li.bind(this)}>
                <img src={this.state.li_img} className={styles.hs_activity_icon}
                />
                <div className={styles.hs_activity_drop} style={{display:this.state.show_li?'block':'none'}}>
                  <div className={styles.hs_activity_top}>
                    <div className={styles.scoreShop} onClick={this.go_shop.bind(this)}>贝壳商城</div>
                    <div className={styles.scoreShop} onClick={this.get_beike.bind(this)}>获取贝壳</div>
                    <div className={styles.go_publishs} onClick={this.state.signed?()=>{}:this.sign.bind(this)}
                         style={this.state.signed?{background: 'rgb(74, 74, 74)',color: 'rgb(250, 218, 74)'}:{}}>{this.state.signed?'已签到':'签到'}</div>
                  </div>
                </div>
              </div>
              <div className={styles.title_div_msg}
                   onMouseEnter={this.show_mes.bind(this)}
                   onMouseLeave={this.hide_mes.bind(this)}>
                <span className={styles.title_msg_num + ' '+ styles.animated + ' '+ styles.lrshake} style={{display:this.state.unRead > 0?'block':'none'}}>{this.state.unRead}</span>
                <img src={this.state.mes_img} className={styles.tip_service_img2}/>
                <div className={styles.div_msg_title} style={{display:this.state.show_mes?'block':'none'}}>
                  <em className={styles.mes_jian}></em>
                  <span className={styles.mes_span}></span>
                  <p className={styles.msg_desc}>您有{this.state.unRead}条未读消息</p>
                  <ul className={styles.ul_msg_title}>
                    {
                      this.state.unReadRecord.map((item, index) => {

                        if(item.category == "resume_zy_message"){
                          if(!item.js_status){
                            if( item.zy_status == 0 ) {
                              return (<li className={styles.record_li} onClick={thiz.li_click.bind(this,item)}><canvas className={styles.cicle}>
                              </canvas>{item.name?item.name + '已被激活':'求职者已被激活'}
                              <label style={{float: 'right',color:'#3C9FF0',cursor: 'pointer'}}>查看&gt;&gt;</label></li>)
                            }
                            }
                        }else if(item.category == "approve_company"){
                             if(item.status == -1){
                               return (<li className={styles.record_li} onClick={thiz.li_click.bind(this,item)}>
                                 <canvas className={styles.cicle}></canvas>
                                 {item.approve_reason?'营业执照认证审核失败，原因：'+item.approve_reason:'营业执照认证审核失败，原因：未填写'}</li>)
                             }else{
                               return (<li className={styles.record_li} onClick={thiz.li_click.bind(this,item)}>
                                 <canvas className={styles.cicle}></canvas>营业执照认证审核通过</li>)
                             }
                        }else{

                          return (<li className={styles.record_li} onClick={thiz.readAll.bind(this,item)}><canvas className={styles.cicle}></canvas>{item.msg}</li>)
                        }

                      })
                    }
                  </ul>
                  <p className={styles.title_msg_read_all} onClick={thiz.readAll.bind(this)}>查看全部消息
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div>
          {this.props.children}
        </div>

      </div>
    )

  }

}

const mapStateToProps = state => ({
  userInfo: state.userInfo
})

export default connect(mapStateToProps)(Header)

