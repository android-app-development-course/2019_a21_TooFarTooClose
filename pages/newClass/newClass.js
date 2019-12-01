// pages/newClass/newClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skey:"",
    class_title:"",
    class_intro:"",
    maax_num:0,
    tempFilePaths:"",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  formSubmit:function(){
    let that=this
    let { class_title, class_intro, max_num } = e.detail.value;
    this.setData({
      class_title,
      class_intro,
      max_num
    })

    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/newClass.php',
      data: {
        skey: wx.getStorageSync('skey'),
        class_title:that.data.class_title,
        class_intro:that.data.class_intro,
        max_num:that.data.max_num
      },
      method: 'GET',
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
          tempFilePaths:res.tempFilePaths
        })
      }
    })
  }

})