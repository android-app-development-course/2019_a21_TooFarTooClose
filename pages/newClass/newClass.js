// pages/newClass/newClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skey:"",
    class_title:"",
    class_intro:"",
    max_num:10,
    tempFilePaths:"",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  //获取班级人数
  sliderChange: function (e) {
    this.setData({
      max_num:e.detail.value
    })
  },

  formSubmit:function(e){
    let that=this
    let { class_title, class_intro} = e.detail.value;
    this.setData({
      class_title,
      class_intro,
    })

    if(that.data.class_title.length==0){
      wx.showToast({
        title: '请输入课程名称',
        icon:'none',
      })
      return;
    }
    if (that.data.tempFilePaths.length==0){
      wx.showToast({
        title: '请选择封面图',
        icon:'none',
      })
      return;
    }

    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/newClass.php',
      
      data: {
        skey: wx.getStorageSync('skey'),
        class_title:that.data.class_title,
        class_intro:that.data.class_intro,
        max_num:that.data.max_num
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      method: 'POST',
      dataType: 'json',
      success:function(res){
        wx.showToast({
          title: '创建成功',
          icon:"success"
        })
      }
    })
  },

  chooseImg:function(){
    let that=this
    wx.chooseImage({
      count:1,
      success(res){
        that.setData({
          tempFilePaths:res.tempFilePaths[0]
        })
      }
    })
  }

})