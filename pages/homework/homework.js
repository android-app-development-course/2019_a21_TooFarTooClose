// pages/homework/homework.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity:0,
    skey:"",
    items:{},
    class_id:0,
    nowDate:"",
    deadline:"",
    homeworkTitle:"",
    openDropdown:0
  },

  getHomeWorkInfo:function(){
    let that=this;
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/homework.php',
      data:{
        class_id:that.data.class_id,
        skey:that.data.skey,
        identity:that.data.identity
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      method: 'POST',
      dataType: 'json',
      success: function (res){
        if(that.data.identity==0){
          that.setData({
            items: res.data
          })
          for (let i = 0; i < that.data.items.length; i++) {
            that.data.items[i]['has_complete'] = parseInt(that.data.items[i]['has_complete']);
          }
        }else{
          that.setData({
            items: res.data
          })
        }
      }
    })

  },

  //作业上传功能，未完成状态，event为wxml文件中传入的homework_id
  uploadHomework:function(event){
    let that=this;
    var homework_id = event.currentTarget.dataset['index'];
    wx.chooseMessageFile({
      count:1,
      type:'file',
      success(res){
        const tempFilePath=res.tempFilePaths
        wx.uploadFile({
          url: 'http://127.0.0.1/',//此处应是小程序后台服务器(开发者)的地址，由微信服务器向开发者的后台服务器发送POST请求，参考https://www.cnblogs.com/ailex/p/10007885.html
          filePath: tempFilePaths[0],
          name: that.data.homework_id+"-"+this.data.skey,
          formData: { //上传POST参数信息
            'class_id':that.data.class_id,
            'skey': that.data.skey,
            'homework_id':homework_id
          },
          success(res) { //上传成功回调函数
            const data = res.data
            wx.showToast({
              title: '上传成功',
              icon: "success",
              duration: 1000,
              mask: true
            })
          }
        })
      }
    })

    
  },

  dropDown:function(){
    if(this.data.openDropdown==0){
      this.setData({
        openDropdown:1
      })
    }else{
      this.setData({
        openDropdown: 0
      })
    }

  },

  bindDateChange:function(e){
    this.setData({
      deadline:e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nowDate:getToday(),
      class_id:options['class_id'],
      skey:wx.getStorageSync('skey'),
      identity:wx.getStorageSync('identity')
    })

    this.getHomeWorkInfo();
  },

  teacherAdjust(){
    
  },


  newHomework:function(e){
    let that=this;
    let { homeworkTitle } = e.detail.value;
    if(homeworkTitle.length==0){
      wx.showToast({
        title: '请输入标题',
        icon:"none"
      })
      return
    }
    that.setData({
      homeworkTitle
    })
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/uploadHomework.php',
      data: {
        class_id: that.data.class_id,
        homework_title:that.data.homeworkTitle,
        deadline:that.data.deadline
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      method: "POST",
      dataType: 'json',
      success: function (res) {
        if (res.data[0].hasOwnProperty('error_code')){
          wx.showToast({
            title: '发生服务器错误',
            icon:"none",
          })
          return
        }
        wx.showToast({
          title: '发布成功',
          icon: "none",
          duration: 1000,
          mask: true
        })
        that.setData({
          items:res.data
        })
      },
      fail(err) {
        wx.showToast({
          title: "错误：" + err,
          icon: "none",
          duration: 1000,
          mask: true
        })
      }
    })
  },

  teacherAdjust:function(){
    wx.showToast({
      title: '该功能尚未开放',
      icon: 'none',
      duration: 1000,
      mask: true,
      
    })
  },


})

function getToday() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  var formatDate = year + '-' + month + '-' + day;
  return formatDate;
}