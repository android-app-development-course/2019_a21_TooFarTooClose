// pages/classDetail/classDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    class_id:"",
    classTitle:"",
    classTeacher:"",
    titleImgUrl:"",
    classIntro:"",
    classGonggao:"",
    skey:"",
    running:0,
    joinable:0,
    identity:0,
    hasJoin:0,
    show_join_btn:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      class_id: options['class_id'],
      identity:parseInt(wx.getStorageSync('identity')),
      skey:wx.getStorageSync('skey')
    })

    this.getClassDetail();

    //决定是否显示“加入课程”按键******************注意此处可能在获取到identity前就进行判断造成错误
    if (this.data.identity == 1 ){
      this.setData({
        show_join_btn:0
      })
    }

  },

  //检查是否已经加入过该课程
  getIfJoin:function(){
    let that=this;
    wx,wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/ifJoin.php',
      data:{
        skey:that.data.skey,
        class_id:that.data.class_id,
        identity:that.identity
      },
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        console.log(res.data)
        if(res.data!='0'){
          that.setData({
            hasJoin:1
          })
          that.setData({
            show_join_btn: 0
          })
        }
      }
    })
  },

  //获取课程信息
  getClassDetail:function(){
    let that=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/classDetail.php',
      data:{
        class_id:that.data.class_id,
        skey: that.data.skey,
        identity: that.identity
      },
      method: "GET",
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        that.setData({
          classTitle:res.data[0]['class_name'],
          classTeacher:res.data[0]['teacher_name'],
          titleImgUrl:res.data[0]['img_url'],
          classIntro:res.data[0]['class_intro'],
          classGonggao: res.data[0]['class_gonggao'],
          running:parseInt(res.data[0]['running']),
          joinable:parseInt(res.data[0]['joinable']),
          hasJoin:parseInt(res.data[0]['has_join'])
        })
        if(that.data.joinable==0){
          that.setData({
            show_join_btn: 0
          })
        }
        if (that.data.hasJoin != '0') {
          that.setData({
            show_join_btn: 0
          })
        wx.hideLoading()
        }
      },
      finally:function(){
        wx.hideLoading()
      }
    })
  },

  joinClass:function(){
    let that=this;
    wx.showLoading({
      title: '正在加入',
    })
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/joinClass.php',
      data:{
        skey: that.data.skey,
        class_id:that.data.class_id
      },
      method: "GET",
      dataType: 'json',
      success: function (res) {
        wx.hideLoading()
        if (res.data=='1'){
          wx.showToast({
            title: "成功加入",
            icon: "success",
            duration: 1000,
            mask: true
          })
          that.setData({
            hasJoin:1,
            show_join_btn:0
          })
        }else{
          wx.showToast({
            title: "发生错误",
            icon: "none",
            duration: 1000,
            mask: true
          })
        }
      },
      fail(err){console.log(err)}
    })
  },

  toSelfStatusDetail:function(){
    wx.navigateTo({
      url: '../selfStatusDetail/selfStatusDetail'
    })
  },

  toClassStatusDetail:function(){
    wx.navigateTo({
      url: '../classStatusDetail/classStatusDetail?class_id=' + this.data.class_id
    })
  },

  toHomework:function(){
    wx.navigateTo({
      url: '../homework/homework?class_id='+this.data.class_id
    })
  },

  toClassResource:function(){
    wx.navigateTo({
      url: '../classResource/classResource?class_id=' + this.data.class_id
    })
  },

  toMail:function(){
    wx.navigateTo({
      url: '../mailEdit/mailEdit?receiver_id=' + this.data.class_id + '&receiver=' + classTeacher
    })
  },

  toClassManage:function(){
    wx.navigateTo({
      url: '../classManage/classManage?class_id='+this.class_id
    })
  }
})