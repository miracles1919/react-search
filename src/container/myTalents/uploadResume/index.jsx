/**
 * Created by gushufan on 2017/12/20
 */
/* 系统的安装包 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SingleSelectTwo from '../SingleSelectTwo/index.jsx';
import Table from '../../../component/tableTwo/index.jsx';
import style from './index.css';
import { fSetCookieMes,dataFormat,fGetCookieMes,fGetLocalTime} from '../../../utils/common';
import * as config  from '../../../utils/config';
import { fUpLoadOss } from '../../../utils/uploaderOss';
import { uploadResume ,getJobList ,getUploadResumeList } from 'service/uploadResume';


export default class UploadResume extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectJobList: '', // 职位下拉列表选中的职位
      selectListData: [], // 下拉列表数据
      uploadResumeListShow: true, // 判断list列表是否为空状态
      fileNameArrSend: [],//发送给后台的name_list
      uploadStatusData: [], // 上传历史列表
      fileSource:[],//上传简历时的状态列表
      jobId:"",//上传简历时的job_id
      ossClick:0,//判断是否渲染oss
      fileNameSend:'',
      stepStatus:1,
    }
  }

  componentWillMount(){
    let gerUrLObj = this.props.location.query;
    let getUrlJobID = gerUrLObj.job_id;
    console.log(getUrlJobID);
    if(getUrlJobID){
      this.setState({
        jobId:getUrlJobID
      },()=>{
        console.log(this.state.jobId);
        if(this.state.jobId){//调取oss
          this.setState({
            ossClick:this.state.ossClick + 1,
          },()=>{
            console.log(this.state.ossClick);
            this.ossUploadRuseme();//调取上传简历oss
          })
        }
      })
    }

  }

  componentDidMount () {
    console.log('已经')
    // 获取job_list
    this.getJobList();
    // 获取简历列表,初始状态下获取所有简历信息
    this.getRusemeListFirst();
  }

  // 初次加载时获取job_list列表
  getJobList () {
    getJobList({

    }).then(result => {
      const { success, data, message } = result
      if (success) {
        // api调用成功
        if (data.length > 0) {
          let selectJobListData = [];
          let job_list = data[0].job_list;
          let jobidMoRen = this.state.jobId;
          job_list.map((item, index) => {
            let newObj = {}
            newObj.name = item.name;
            newObj.job_id = item.job_id;
            selectJobListData.push(newObj);
          //下面取传过来的jobid
            if(jobidMoRen==item.job_id){
                console.log(item.job_id);
                console.log(item.name);
                this.setState({
                  selectJobList:item.name
                })
            }
          });
          this.setState({
            selectListData: selectJobListData,
          },()=>{
            console.log(this.state.selectListData);
            let urlSelectJobID = this.state.selectListData;

          });
        }
      } else {
        // api调用失败
        console.log(message);
      }
    });
  }


  // 初次加载页面时获取简历上传列表
  getRusemeListFirst () {
    let { fileNameArrSend } = this.state;
    getUploadResumeList({
      file_name_list: fileNameArrSend,
    }).then(result => {
      const { success, data, message } = result;
      if (success) {
        if (data[0].finish == 0) {
          this.setState({
            uploadStatusData: data[0].resume_list,
          }, () => {
            console.log(this.state.uploadStatusData)
          });
        }else{
        }
      }else {
        // api调用失败
        console.log(message);
      }
    });
  }
  //每5秒调取简历列表，更新状态
  getRusemeListAgain () {
    //console.log('调取了getru');
    let { fileNameArrSend,fileSource } = this.state;
    getUploadResumeList({
      file_name_list: fileNameArrSend,
    }).then(result => {
      const { success, data, message } = result;
      if (success) {
        if (data[0].finish == 0) {
          console.log(data);
          clearInterval(this.timer);
        }else{
        }
        console.log(data[0].resume_list);
        for(let item in data[0].resume_list){
          for(let i = 0;i<fileSource.length;i++){
            if(data[0].resume_list[item].file_name==fileSource[i].fileName){
              fileSource[i].uploadStatus = data[0].resume_list[item].result;
              fileSource[i].quality_score = parseInt(data[0].resume_list[item].quality_score)>=0 ? data[0].resume_list[item].quality_score:'----';
            }
          }
        }
        this.setState({
          fileSource:fileSource
        },()=>{
          console.log(this.state.fileSource);
        })
      }else {
        // api调用失败
        console.log(message);
      }
    });
  }

  //点击上传简历函数
  toUploadResume(fileNameSend,jobID){
    uploadResume({
      file_name: fileNameSend,
      job_id: jobID,
    }).then(result => {
      const { success, data, message } = result;
      if (success) {
        // api调用成功
        if (data.length > 0) {
          console.log(data);
        }
      } else {
        // api调用失败
        console.log(message);
      }
    });
  }
  // 点击改变下拉列表职位
  changEventJobID(item) {
    this.setState({
      selectJobList: item.name,
      jobId:  item.job_id,
      ossClick:this.state.ossClick + 1,
    },()=>{
      console.log(this.state.jobId);
      console.log(this.state.ossClick);
      if(this.state.ossClick==1){
        this.ossUploadRuseme();//调取上传简历oss
      }
    });
  }
  //OSS上传文件，封装函数
  ossUploadRuseme(){
    var loader = fUpLoadOss('uploadBtn',
      (encodefile,file)=>{//成功
        let {fileNameSend,fileNameArrSend,fileSource} = this.state;
        //console.log(fileSource);
        console.log(fileNameArrSend);
        clearInterval(this.timer);
        //点击上传简历部分
        let jobIdNew = this.state.jobId;
        console.log(fileNameSend);
        console.log(jobIdNew);
        this.toUploadResume(fileNameSend,jobIdNew);
        this.timer = setInterval(()=>{
          this.getRusemeListAgain();
        },5000);//每5秒更下新上传简历列表
      },
      (up,file)=>{//添加时

      },
      (up, file)=>{//过程

      },
      (up,err)=>{//失败
        let {fileSource} = this.state;
        console.log("失败");
        if(err.code == -602){

        }else if(err.code == -600){

        }else{

        }

      },'pdf,doc,docx',(fileName,file)=>{//开始上
        let {fileSource,fileNameArrSend,} = this.state;
        fileSource.push({
          name:file.name,
          uploadStatus:0,
          fileName:fileName,
          quality_score:'----'
        })
        fileNameArrSend.push(
          fileName
        )
        this.setState({
          stepStatus:2,
          fileSource:fileSource,
          fileNameSend:fileName,
          fileNameArrSend:fileNameArrSend
        })

      }
    );
  }

  render () {
    // 简历数据data
    let uploadStatusDataS = this.state.uploadStatusData;
    const { fileSource } = this.state;
    const columnsprogress = [
      {
        title: '文件名',
        key: 'name',
        render: val => {
          return (
            <div className={style.upFilename}>
              {val}
            </div>
          )
        },
      },
      {
        title: '简历质量分',
        key: 'quality_score',
        render: val => {
          return (
            <div >
              {val}
            </div>
          )
        },
      },
      {
        title: '上传进度',
        key: 'uploadStatus',
        render: (val, index, item) => {
          return (
            <div>
              {val == 4 ? <div className={style.successIcon}><img src={require('./img/uploadResumeSuecce.png')} /><span>解析成功</span></div> : val == 1 ? <div className={style.successIcon}><Loading /><span>解析中</span></div> : val == 2 || val == 3 ? <div className={style.successIcon}><img src={require('./img/uploadResumeError.png')} /><span>解析失败</span></div> : <div className={style.successIcon}><Loading /><span >上传中</span></div>}
            </div>
          )
        },
      },

      {
        title: '日期',
        key: 'fileName',
        render: (val, index, item) => {
          return (
            <div >
              {dataFormat('yyyy-MM-dd', fGetLocalTime())}
            </div>
          )
        },
      },
    ]
    const columns = [
      {
        title: '文件名',
        key: 'name',
        render: val => {
          return (
            <div className={style.upFilename}>
              {val}
            </div>
          )
        },
      },
      {
        title: '简历质量分',
        key: 'quality_score',
        render: val => {
          return (
            <div >
              {val}
            </div>
          )
        },
      },
      {
        title: '上传进度',
        key: 'result',
        render: (val, index, item) => {
          return (
            <div>
              {val == 4 ? <div className={style.successIcon}><img src={require('./img/uploadResumeSuecce.png')} /><span>解析成功</span></div> : val == 1 ? <div className={style.successIcon}><Loading /><span>解析中</span></div> : val == 2 || val == 3 ? <div className={style.successIcon}><img src={require('./img/uploadResumeError.png')} /><span>解析失败</span></div> : <div className={style.successIcon}><Loading /><span >上传中</span></div>}
            </div>
          )
        },
      },

      {
        title: '日期',
        key: 'ctime',
        render: (val, index, item) => {
          return (
            <div >
              {dataFormat('yyyy-MM-dd', val)}
            </div>
          )
        },
      },
    ]

    return (
      <div className={style.uploadResumeWrap}>
        {/* 上传简历头部banner */}
        <div className={style.uploadResumeTop}>
          <img src={require('./img/uploadResumeTop.png')} className={style.uploadResumeTopImg} alt="" />
        </div>
        {/* 上传简历中间部分 */}
        <div className={style.uploadResumeCenter}>
          {/* 上传了简历按钮 */}
          <div className={this.state.jobId==""?style.uploadBtnNo:style.uploadBtn} id={this.state.jobId==""?"":"uploadBtn"}>
                           上传本地简历
          </div>
          {/* 下拉列表 */}
          <div className={style.selectWrap}>
            <SingleSelectTwo
              listData={this.state.selectListData}
              defaultInfo={this.state.selectJobList || '请选择所属职位，再上传简历'}
              changEvent={this.changEventJobID.bind(this)}
              skin="new"
            />

          </div>
        </div>
        {/* 上传简历列表部分 */}
        {/* 下传历史列表 */}
        <div className={style.tableWrap} id={style.tableWtrap}>
          {/*上传进度列表*/}
          <Table
            columns={columnsprogress}
            source={fileSource || []}
            style={{ width: '100%', textAlign: 'center' }}
          />
          <div className={style.uploadstatusList}>
            <Table
              columns={columns}
              source={uploadStatusDataS || []}
              style={{ width: '100%', textAlign: 'center' }}
            />
          </div>

          {/*简历列表为空的状态时*/}
            <p  className={style.noneUploadRuseme} style={uploadStatusDataS.length==0&&fileSource.length==0?{'display':'block'}:{'display':'none'}}>暂无简历上传记录</p>

        </div>


      </div>
    )
  }
}

// loading css3加载组件
class Loading extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectJobList: '', // 职位下拉列表选中的职位
      selectListData: [], // 下拉列表数据
      uploadResumeListShow: true, // 判断list列表是否为空状态
      fileNameArrSend: [],
      uploadStatusData: [], // 上传历史列表
    }
  }
  render () {
    return (
      <div className={style.load}>
        <div className={style.ring2}>
          <div className={style.ballHolder}>
            <div className={style.ball} />
          </div>
        </div>
      </div>
    )
  }
}

