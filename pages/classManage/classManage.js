// pages/classManage/classManage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course_id:0,
    joinable:true,
    max_num:10,
    delBtnWidth: 180,
    notice_text:"",
    items:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      course_id:options['course_id'],
    })
    this.loadStudentList();
    this.getClassManageInfo();
  },

  //加载学生列表
  loadStudentList:function(){
    let that=this
    wx.request({
      url: 'http://www.hinatazaka46.cn/StatusWeChatServer/studentList.php',
      data:{
        course_id:that.data.course_id
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      dataType: 'json',
      success:function(res){
        that.setData({
          items:res.data,
        })
      }, 
    })
  },

  switchChange:function(e){
    this.setData({
      joinable:e.detail.value
    })
  },

  sliderChange: function (e) {
    this.setData({
      max_num: e.detail.value
    })
  },

  textareaChange:function(e){
    this.setData({
      notice_text:e.detail.value
    })
  },


  //上传基本信息的更改
  uploadChange:function(){
    let that=this
    let joinable
    if(that.data.joinable){
      joinable=1
    }else{
      joinable=0
    }
    wx.request({
      url: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        course_id:that.data.course_id,
        joinable:joinable,
        notice_text:that.data.notice_text,
        max_num: that.data.max_num
      },
      dataType: 'json',
      success:function(res){
        if (res.data.hasOwnProperty('error_code')) {
          wx.showToast({
            title: '服务器错误',
            icon: "none"
          })
          return
        }
        wx.showToast({
          title: '更改成功',
          icon:"none"
        })
      },
      fail:function(err){
        wx.showToast({
          title: err,
          icon: "none"
        })
      }
    })
  },

  getClassManageInfo:function(){
    let that=this
    wx.request({
      url: 'http://www.hinatazaka46.cn/StatusWeChatServer/manageInfo.php',
      data:{
        course_id:that.data.course_id
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      dataType: 'json', 
      success:function(res){
        let joinable=res.data[0]['joinable']
        let max_num=parseInt(res.data[0]['max_num'])
        let notice_text=res.data[0]['notice_text']
        if (joinable==1){
          that.setData({
            joinable: true,
            max_num: max_num,
            notice_text: notice_text
          })
        }else{
          that.setData({
            joinable: false,
            max_num: max_num,
            notice_text: notice_text
          })
        }
        
      },
      fail:function(err){
        wx.showToast({
          title: err,
          icon:"none"
        })
      }
    })
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0rpx";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var items = this.data.items;
      items[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        items: items
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var items = this.data.items;
      items[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        items: items
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      //以宽度750px设计稿做宽度的自适应
      var scale = (750 / 2) / (w / 2);  
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //点击删除按钮事件
  delItem: function (index) {
    let items = this.data.items;
    //移除列表中下标为index的项
    items.splice(index, 1);
    //更新列表的状态
    this.setData({
      items: items
    });

  },
 
  sendDel: function (e){
    var index = e.target.dataset.index;
    let that=this;
    wx.showModal({
      title: '提示',
      content: '确认要移除该学生?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: "http://www.hinatazaka46.cn/StatusWeChatServer/deleteStudent.php",
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              course_id:that.data.course_id,
              uid:that.data.items[index]['uid'] 
            },
            success: function (res) {
              if (res.data.hasOwnProperty('error_code')){
                wx.showToast({
                  title: '服务器错误',
                  icon:"none"
                })
                return false
              }
              wx.showToast({
                title: '删除成功',
                icon:"success"
              })
              that.delItem(index)
              return true
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          return false
        }
      }
    })
  }

})