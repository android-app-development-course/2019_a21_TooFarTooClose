// pages/login/login.js
var util = require('../../utils/md5.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    pwd:"",
    uid:"",
    name:"",
    account_type:0,
    brand:"http://127.0.0.1/StatusWeChatServer/imgs/brand.jpg",
  },

  formSubmit: function (e) {
    let {id,pwd}=e.detail.value;
    this.setData({
      id,
      pwd
    })
    this.getLoginInfo();
  },

  getLoginInfo:function(){
    let that=this;
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/login.php',
      header: {
        "Content-Type": "multipart/form-data"
      },
      data: {
        phone: that.data.id,
        pwd: util.hexMD5(that.data.pwd),
      },
      method: "POST",
      dataType: 'json',
      success: function (res) {
        if(res.data.length>0){
          console.log(res.data)
          that.setData({
            uid: res.data[0]['uid'],
            name: res.data[0]['name'],
            id:res.data[0]['phone'],
            account_type:parseInt(res.data[0]['account_type'])
          });
          //以同步方式存储uid等信息
          try {
            wx.setStorageSync('uid', that.data.uid);
            wx.setStorageSync('name', that.data.name);
            wx.setStorageSync('phone', that.data.id);
            wx.setStorageSync('account_type', that.data.account_type);
          } catch (e) {
            wx.showToast({
              title: e.err,
              icon: "none",
              duration: 1000,
              mask: true
            })
          }
          wx.switchTab({
            url: '../index/index'
          })
        }
        else{
          wx.showToast({
            title:"用户名或密码不正确",
            icon: "none",
            duration: 1000,
            mask: true
          })
        }
        
      },
      fail(err) { console.log(err) },
    })
  },

  onGotUserInfo:function(e){
    wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl);
  },



  tosignin:function(){
    wx.redirectTo({
      url: '../signin/signin'
    })
  }
})