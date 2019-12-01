// pages/mailDetail/mailDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mail_id:0,
    addresser:"",
    addresser_id:0,
    mailTitle:"",
    sendedTime:"",
    mailText: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mail_id: options['mail_id'],
    })

    this.getMailDetail()
  },

  getMailDetail:function(){
    let that=this
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/mailDetail.php',
      method: 'GET',
      dataType: 'json',
      data: {
        "mail_id": wx.getStorageSync('mail_id')
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          addresser: res.data['addresser'],
          addresser_id:res.data['addresser_id'],
          mailTitle: res.data['mail_title'],
          sendedTime: res.data['time'],
          mailText: res.data['mail_text']
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  replyMail: function () {
    wx.navigateTo({
      url: '../mailEdit/mailEdit?receiver='+this.data.addresser+'&receiver_id='+this.data.addresser_id,
    })
  },

})