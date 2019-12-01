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
    wx.reLanch({
      url: '../index/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name:wx.getStorageSync('name'),
      phone:wx.getStorageSync('phone'),
      headphoto:wx.getStorageSync('avatarUrl')
    })
  },


})