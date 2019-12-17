//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inputValue: '',
    imgs:[],
    jumpCourse:[],
    self_info:{},
    uid:"",
    remindItems:{},
    account_type:0,
    score:0
  },


  searchInput:function(e){
    this.setData({
      inputValue: e.detail.value
    })
    
  },

  search:function(){
    var tourl = "../searchResult/searchResult?value=" + this.data.inputValue;
    console.log(tourl)
    wx.navigateTo({
      url: tourl
    })
  },


  onLoad:function(e){

    //检查是否有uid已存储
    let that=this;
    let loginFlag = wx.getStorageSync('uid');
    if (loginFlag) {
      console.log("has uid");
      wx.checkSession({
        succss: function () {
          that.setData({
            uid:loginFlag
          })
        },
        fail: function () {
          //跳转前往登录
          wx.redirectTo({
            url: '../login/login'
          })
        }
      })
    }else{
      wx.redirectTo({
        url: '../login/login'
      })
    }


    //获取封面图片
    wx.request({
      url: 'http://www.hinatazaka46.cn/StatusWeChatServer/respondIndexImg.php',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      dataType: 'json',
      success: function (res) {
        that.setData({
          imgs:res.data['img_url'],
          jumpCourse:res.data['course_id']
        })
      }
    })
    that.setData({
      account_type: parseInt(wx.getStorageSync('account_type'))
    })

    this.getHomeworkRemind()
    this.getScore()

  },

  toHomework:function(event){
    let that = this;
    let course_id = event.currentTarget.dataset['index'];
    wx.navigateTo({
      url: '../homework/homework?course_id='+course_id
    })
  },

  toClassDetail:function(event){
    let that=this;
    let course_id = event.currentTarget.dataset['index'];
    wx.navigateTo({
      url: '../classDetail/classDetail?course_id='+course_id,
    })
  },

  //获取最近一节课的平均专注度
  getScore:function(){
    let that=this
    wx.request({
      url: 'http://www.hinatazaka46.cn/StatusWeChatServer/classScore.php',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        uid: wx.getStorageSync('uid')
      },
      method: "POST",
      dataType: 'json',
      success:function(res){
        console.log(res.data)
        that.setData({
          score:res.data
        })
      }
    })
  },

//获取作业提醒
  getHomeworkRemind:function(){
    let that=this
    wx.request({
      url: 'http://www.hinatazaka46.cn/StatusWeChatServer/homeworkRemind.php',
      data:{
        uid: wx.getStorageSync('uid')
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      dataType: 'json',
      success:function(res){
        
        that.setData({
          remindItems: res.data
        })
        
      },
      fail(err){
        console.log(err)
      }
    })
  }



})
