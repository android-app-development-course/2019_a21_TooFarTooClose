// pages/mailEdit/mailEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiver:"",
    receiver_id:0,
    mailTitle:"",
    mailText:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      receiver: options['receiver'],
      receiver_id: options['receiver_id'],

    })
  },

  formSubmit:function(){
    let { mailTitle, mailText } = e.detail.value;
    this.setData({
      mailTitle,
      mailText
    })
    this.sendMail()
  },

  sendMail:function(){
    let that = this
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/sendMail.php',
      method: 'GET',
      dataType: 'json',
      data: {
        mailTitle:that.data.mailTitle,
        mailText:that.data.mailText,
        receiver:that.data.receiver,
        receiver_id:that.data.receiver_id
      },
      success: function (res) {
        wx.showToast({
          title: '已发送',
          icon:"success",
          duration: 1000,
          mask: true
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })

  },

})