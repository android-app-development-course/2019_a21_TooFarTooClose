// pages/selfinfo/selfinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headphoto: "",
    name:"",
    phone:"",

  },

  //点击“退出登录”后清除缓存并重新进入逻辑
  signOut:function(){
    wx.clearStorage();
    wx.reLaunch({
      url: '../login/login'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    wx.getUserInfo({
      success(res) {
        console.log(res.userInfo)
        that.setData({
          name: wx.getStorageSync('name'),
          phone: wx.getStorageSync('phone'),
          headphoto: res.userInfo.avatarUrl
        });
      }
    })
  },


})