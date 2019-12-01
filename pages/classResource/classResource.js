// pages/classResource/classResource.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    class_id:0,
    items:{},
    identity:0,
    openDropdown:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    this.setData({
      class_id: options['class_id'],
      identity:parseInt(wx.getStorageSync('identity'))
    })

    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/resource.php',
      data:{
        skey:wx.getStorageSync('skey')
      },
      method: "GET",
      dataType: 'json',
      success:function(res){
        that.setData({
          items:res.data
        })
      }
    })
  },

  copyUrl:function(event){
    let that = this;
    var index = event.currentTarget.dataset['index'];
    wx.setClipboardData({
      data: that.items[index]['resource_url'],
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  dropDown: function () {
    if (this.data.openDropdown == 0) {
      this.setData({
        openDropdown: 1
      })
    } else {
      this.setData({
        openDropdown: 0
      })
    }

  },

})