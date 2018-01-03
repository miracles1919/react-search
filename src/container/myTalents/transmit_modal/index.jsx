/*
*  <Transmit_modal show={true/false} handle={()=>{} list=[{job_name:"",resume_id:"",channel_job_id:"",email:"",name:""}]/>

    返回:
        val:true/false
        para:输入的邮箱列表[]
 *
* */


import React from 'react';
import ReactDOM from 'react-dom';

import style from './transmit_modal.css';

import {checkEmail} from 'cmPath/common.js';


import contact from './img/Complete.png';

import {
    list_candidate_resume_list,
    batch_deal_resume
} from 'cmPath/request.js';

export default class dialog extends React.Component{
    constructor(props){
        super(props);

        this.state = {

            email:[""],
            err:"",
            success:false
        }
    }

    componentWillReceiveProps(nextProps){

        console.log(nextProps.list)
    }

    add_email = (event)=>{

        event.stopPropagation();

        if (this.state.email.length == 3){

            this.setState({

                err:"最多转发三个"
            })
            return
        }

        var _state = {...this.state};

        _state.email.push("");

        this.setState(_state);

    }


    del_email = (index,event)=>{

        event.stopPropagation();

        var _state = {...this.state};

        _state.email.splice(index,1);

        this.setState(_state);
    }

    btn_confirm = (event) =>{
        event.stopPropagation();

        var thiz = this;

        var _state = {...this.state};

        var flag = false;

        for (var i = 0;i < _state.email.length;i++){

            if (_state.email[i]){

                flag = true;
                break;
            }

        }

        if (!flag){

            this.setState({

                err:"请输入面试官邮件地址"
            })
            return
        }

        flag = false;

        for (var i = 0;i < _state.email.length;i++){

            if (_state.email[i] && (checkEmail(_state.email[i]) != true)){
                flag = true;
                break;
            }

        }


        if (flag){

            this.setState({

                err:"邮箱有格式错误"
            })
            return
        }

        /*进行批量转发*/

        var item_list = [];

        console.log("转发评审",this.props.list)

        for (var i = 0;i < this.props.list.length;i++){

            var para_tran = this.props.list[i];

            item_list.push({

                'resume_id':para_tran.resume_id,
                'channel_job_id':para_tran.channel_job_id,
                'job_name':para_tran.job_name,
                'email':para_tran.email,
                'name':para_tran.name
            })
        }



        var forward_list = [];

        for (var i = 0;i < _state.email.length;i++){

            if (_state.email[i]){

                forward_list.push(_state.email[i]);
            }
        }

        var re_para = {

            action:"forward",

            item_list:item_list,

            forward_list:forward_list,
        }


        batch_deal_resume(re_para,(data)=>{
            if(data[0] == 0){
                thiz.setState({
                    success:true,
                    show:false
                })
            }


        });

    }

    close_modal = (event) =>{

        event.stopPropagation();

        this.props.handle(false)
    }

    edit_email = (index,event)=>{

        event.stopPropagation();

        var _state = {...this.state};

        _state.email[index] = event.target.value;

        _state.err = "";

        this.setState(_state);
    }

    click_btn = (e)=> {
        e.stopPropagation();
        this.setState({
            success:false
        });
        this.props.handle(true);
    }

    render(){

        var thiz = this;

        return (
             <div>
            <div className={style.container} style={this.props.show == true?{}:{display:"none"}}>

                <div className={style.container_con}>

                    <div className={style.header}>
                        转发评审

                        <img src={require('imgPath/close.png')} className={style.close} onClick={this.close_modal.bind(this)}/>
                    </div>

                    <div className={style.content}>
                    {

                        this.state.email.map(function(item,index){

                            return (

                                <div className={style.email_div}>

                                    <span>面试官：</span>
                                    <input placeholder="请输入面试官邮件地址" className={style.email_input} onChange={thiz.edit_email.bind(thiz,index)}/>

                                    <div className={style.op_group}>
                                        <img src={require('./img/transmit_add.png')} onClick={thiz.add_email.bind(thiz)}/>
                                        <img src={require('./img/transmit_del.png')}  onClick={thiz.del_email.bind(thiz,index)}
                                             style={index == 0?{display:"none"}:{}}/>
                                    </div>
                                </div>
                            )

                        })

                    }
                    <span className={style.err}>{this.state.err}</span>
                    </div>

                    <div className={style.btn_group}>

                        <input type="button" onClick={this.btn_confirm.bind(this)} value="发送"/>
                        <input type="button" onClick={this.close_modal.bind(this)} value="取消"/>
                    </div>

                </div>

            </div>
                 <div className={style.container} style={this.state.success?{}:{display:"none"}}>
                     <div className={style.container_con}>
                     <div className={style.content}>
                         <div><img src={contact}/></div>
                         <p className={style.value}>转发成功</p>

                         <input value="确定" className={style.btn} type="button" onClick={this.click_btn.bind(this)}/>

                     </div>
                     </div>
                 </div>
             </div>
        )

    }
}
