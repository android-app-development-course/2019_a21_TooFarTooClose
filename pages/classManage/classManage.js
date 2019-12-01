// pages/classManage/classManage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    class_id:0,
    joinable:true,
    delBtnWidth: 180,
    items:{},
  },

  /** 注意：
   * 未完成：基本设置与后台通信
   * 课程公告与后台通信
   * 学生列表删除与后台通信
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      class_id:options['class_id'],
    })
    this.loadStudentList();
  },

  //加载学生列表
  loadStudentList:function(){
    let that=this
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/studentList.php',
      data:{
        class_id:that.data.class_id
      },
      method: 'GET',
      dataType: 'json',
      success:function(res){
        that.setData({
          items:res.data,
        })
      }, 
    })
  },

  //加载课堂基本设置
  loadClassBasicManage:function(){

  },

  getClassManageInfo:function(){
    let that=this
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/manageInfo.php',
      data:{
        class_id:that.data.class_id
      },
      method: 'GET',
      dataType: 'json',
      success:function(res){

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
  delItem: function (e) {
    //获取列表中要删除项的下标
    var index = e.target.dataset.index;
    if(!sendDel(index)){
      return
    }
    var items = this.data.items;
    //移除列表中下标为index的项
    items.splice(index, 1);
    //更新列表的状态
    this.setData({
      items: items
    });
  },
 
  sendDel:function(index){
    wx.showModal({
      title: '提示',
      content: '确认要移除该学生?',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

          wx.request({

            url: getApp().globalData.urlPath + "spendingType/delete",
            method: "POST",
            data: {
              typeId: typeId
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res.data.code);
              if (res.statusCode == 200) {

                //访问正常
                if (res.data.code == "000000") {
                  wx.showToast({
                    title: "删除成功，返回支出类型列表",
                    icon: 'success',
                    duration: 3000,
                    success: function () {

                    }
                  })

                }
                return true;
              } else {

                wx.showLoading({
                  title: '系统异常',
                  fail
                })

                setTimeout(function () {
                  wx.hideLoading()
                }, 2000)
                return false;
              }

            }
          })


        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

})