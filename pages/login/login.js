// pages/login/login.js
var util = require('../../utils/md5.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    pwd:"",
    skey:"",
    name:"",
    identity:0,
    //userInfo:{},
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
    wx.login({
      success: function (loginRes) {
        if (loginRes.code){
          wx.request({
            url: 'http://127.0.0.1/StatusWeChatServer/login.php',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              code: loginRes.code,
              phone: that.data.id,
              pwd: util.hexMD5(that.data.pwd),
            },
            method: "POST",
            dataType: 'json',
            success: function (res) {
              if(res.data.length>0){
                console.log(res.data)
                that.setData({
                  skey: res.data[0]['skey'],
                  name: res.data[0]['name'],
                  id:res.data[0]['phone'],
                  identity:parseInt( res.data[0]['identity'])
                });
                //以同步方式存储skey等信息
                try {
                  wx.setStorageSync('skey', that.data.skey);
                  wx.setStorageSync('name', that.data.name);
                  wx.setStorageSync('phone', that.data.id);
                  wx.setStorageSync('identity', that.data.identity);
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
        }
      }
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