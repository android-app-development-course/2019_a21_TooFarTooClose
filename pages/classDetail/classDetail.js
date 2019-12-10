// pages/classDetail/classDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course_id:"",
    classTitle:"",
    classTeacher:"",
    titleImgUrl:"",
    classIntro:"",
    classGonggao:"",
    uid:"",
    course_status:0,
    joinable:0,
    account_type:0,
    hasJoin:0,
    show_join_btn:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      course_id: options['course_id'],
      account_type:parseInt(wx.getStorageSync('account_type')),
      uid:wx.getStorageSync('uid')
    })

    this.getClassDetail();

    //决定是否显示“加入课程”按键******************注意此处可能在获取到account_type前就进行判断造成错误
    if (this.data.account_type == 1 ){
      this.setData({
        show_join_btn:0
      })
    }

  },

  //检查是否已经加入过该课程
  getIfJoin:function(){
    let that=this;
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/ifJoin.php',
      data:{
        uid:that.data.uid,
        course_id:that.data.course_id,
        account_type:that.account_type
      },
      header:{
        "Content-Type": "multipart/form-data"
      },
      method: 'POST',
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
        course_id:that.data.course_id,
        uid: that.data.uid,
        account_type: that.account_type
      },
      header:{
        "Content-Type": "multipart/form-data"
      },
      method: "POST",
      dataType: 'json',
      success: function (res) {
        console.log(res.data)
        that.setData({
          classTitle:res.data[0]['course_name'],
          classTeacher:res.data[0]['teacher_name'],
          titleImgUrl:res.data[0]['img_url'],
          classIntro:res.data[0]['introduction_text'],
          classGonggao: res.data[0]['class_gonggao'],
          course_status:parseInt(res.data[0]['course_status']),
          joinable:parseInt(res.data[0]['joinable']),
          hasJoin:parseInt(res.data[0]['had_join'])
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
        uid: that.data.uid,
        course_id:that.data.course_id
      },
      header:{
        "Content-Type": "multipart/form-data"
      },
      method: "POST",
      dataType: 'json',
      success: function (res) {
        wx.hideLoading()
        if (res.data['status_code']=='1'){
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
      url: '../classStatusDetail/classStatusDetail?course_id=' + this.data.course_id
    })
  },

  toHomework:function(){
    wx.navigateTo({
      url: '../homework/homework?course_id='+this.data.course_id
    })
  },

  toClassResource:function(){
    wx.navigateTo({
      url: '../classResource/classResource?course_id=' + this.data.course_id
    })
  },


  toClassManage:function(){
    wx.navigateTo({
      url: '../classManage/classManage?course_id='+this.course_id
    })
  }
})