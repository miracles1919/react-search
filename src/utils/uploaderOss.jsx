/*
   * oss 上传模块
   * succesCallback 成功回调
   * addCallback 添加文件回调
   * processCallback 过程回调
   * failCallback 失败回调
   * plupload上传文件错误对照表
   * GENERIC_ERROR	            值为-100，发生通用错误时的错误代码
   * HTTP_ERROR	            值为-200，发生http网络错误时的错误代码，例如服务气端返回的状态码不是200
   * IO_ERROR	                值为-300，发生磁盘读写错误时的错误代码，例如本地上某个文件不可读
   * SECURITY_ERROR            值为-400，发生因为安全问题而产生的错误时的错误代码
   * INIT_ERROR	            值为-500，初始化时发生错误的错误代码
   * FILE_SIZE_ERROR	        值为-600，当选择的文件太大时的错误代码
   * FILE_EXTENSION_ERROR	    值为-601，当选择的文件类型不符合要求时的错误代码
   * FILE_DUPLICATE_ERROR	    值为-602，当选取了重复的文件而配置中又不允许有重复文件时的错误代码
   * IMAGE_FORMAT_ERROR	    值为-700，发生图片格式错误时的错误代码
   * IMAGE_MEMORY_ERROR	    当发生内存错误时的错误代码
   * IMAGE_DIMENSIONS_ERROR    值为-702，当文件大小超过了plupload所能处理的最大值时的错误代码
*/


import * as config from './config.js';

import * as func from './common.js';

export const fUpLoadOss = (id,successcallback,addCallback,processCallback,failcallback,fileType,beforUpload)=>{

  var accessid = '';
  var host = '';
  var policyBase64 = '';
  var signature = '';
  var key = '';
  var expire = 0;
  var g_object_name = '';
  var timestamp = Date.parse(new Date()) / 1000;
  var now = timestamp;
  var file_name;
  function send_request() { // 发送一个request请求, 返回请求结果
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp != null) {
      var url = 'oss_token?ts=' + func.fGetLocalTime() + '&nonce=' + func.fGetNonce() + '&user_id=' + func.fGetCookieMes(config.cookieName.uid);
      var serverUrl = config.HOSTS() + config.VERSION_B + url + '&sig=' + func.fGetSigTwo('oss_token', url, '',config.VERSION_B);
      xmlhttp.open("GET", serverUrl, false);
      xmlhttp.send(null);
      return xmlhttp.responseText
    } else {
      alert("Your browser does not support XMLHTTP.");
    }
  }
  function get_signature() { //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000;
    if (expire < now + 3) {
      var body = send_request();
      var obj = eval("(" + body + ")")[1];
      host = obj['host'];
      policyBase64 = obj['policy'];
      accessid = obj['accessid'];
      signature = obj['signature'];
      expire = parseInt(obj['expire']);
      key = obj['dir'];
      return true;
    }
    return false;
  }
  function get_suffix(filename) { // 去除ext
    var pos = filename.lastIndexOf('.');
    var suffix = '';
    if (pos != -1) {
      suffix = filename.substring(pos)
    }
    return suffix;
  }
  function calculate_object_name(filename) { // 重组filename
    var suffix = get_suffix(filename);
    file_name = 'img_' + func.fGetLocalTime() + '_' + func.fGetNonce() + suffix;
    g_object_name = key + file_name;
  }
  function set_upload_param(up, filename, ret) { // 设置上传的参数,进行上传
    if (ret == false) {
      ret = get_signature()
    }
    if (filename != '') {
      calculate_object_name(filename)
    }

    var new_multipart_params = {
      'key': g_object_name,
      'policy': policyBase64,
      'OSSAccessKeyId': accessid,
      'success_action_status': '200', //让服务端返回200,不然，默认会返回204
      'signature': signature
    };
    up.setOption({
      'url': host,
      'multipart_params': new_multipart_params
    });
    up.start();
  }


  var uploader = new plupload.Uploader({
    runtimes: 'html5,flash,silverlight,html4', // 运行方式
    browse_button: id, // 初始化上传的按钮
    flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf', // flash组件
    silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap', // silverlight_xap_url组件
    url: 'https://oss.aliyuncs.com', // 上传的地址
    filters: { // 过滤
      mime_types: [
        {title: "Image files", extensions: fileType?fileType:"doc,pdf,docx,jpeg,png,jpg"}
      ],
      max_file_size: '3mb', //最大只能上传3mb的文件
      prevent_duplicates: false //允许选取重复文件
    },
    init: {
      FilesAdded: function (up, files) { // 添加文件时的回调

        plupload.each(files, function (file) {
          set_upload_param(uploader, file.name, false);
        });
        if (addCallback)
          addCallback(up, files,file_name)

      },
      BeforeUpload:function (up,file) { // 上传之前的回调
        set_upload_param(up,file.name,true)
        if(beforUpload){
          beforUpload(file_name,file)
        }
      },
      UploadProgress: function(up, file) { // 上传进度的回调
        if (processCallback)
          processCallback(up, file)
      },
      FileUploaded: function (up, file, info) { // 上传完成
        if (info.status == 200) {
          if (successcallback)
            successcallback(file_name,file)
        }
        else if (info.status == 203) {
          if (failcallback)
            failcallback(up, file,info)
        }
        else {
          if (failcallback)
            failcallback()
        }
      },
      Error: function (up, err) { // 上传出错
        if (failcallback)
          failcallback(up, err);
      }
    }
  });

  uploader.init();
  return uploader;
}
