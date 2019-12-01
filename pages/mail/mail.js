// pages/mail/mail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:{}
  },

  getMail:function(){
    let that=this
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/receivedMail.php',
      method:'GET',
      dataType: 'json',
      data:{
        "skey":wx.getStorageSync('skey')
      },
      success:function(res){
        that.setData({
          items: res.data
        })
      },
      fail:function(err){
        console.log(err)
      }
    })
  },

  toDetail: function (event){
    var mail_id = event.currentTarget.dataset['index'];
    wx.navigateTo({
      url: '../mailDetail/mailDetail?mail_id=' + mail_id
    })
  },

  onLoad:function(){
    this.getMail();
  }

})