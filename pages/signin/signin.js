// pages/signin/signin.js
var util = require('../../utils/md5.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwd1:"",
    pwd2:"",
    pwd:"",
    phone:"",
    yanzhengText:"获取验证码",
    yanzheng:false,
    yanzhengDisable:false,
    pwdCheck:false,
    idCheck:false,
    uniqueCkeck:false,
    account_type:0,
    uid:"",
    v:"",
    currentTime: 61,
    yanzheng_answer:"",
    yanzheng_value:""
  },

  onLoad:function(){
    wx.setStorageSync('avatarUrl', "http://www.hinatazaka46.cn/StatusWeChatServer/imgs/notfound_bg.jpg");
    
  },

  formSubmit:function(e){
    let {phone,name,pwd,account_type}=e.detail.value;
    if(name.length==0){
      wx.showToast({
        title: "请输入姓名",
        icon: "none",
        duration: 1000,
        mask: true
      })
      return
    }
    if (this.data.idCheck == true){
      wx.showToast({
        title: "请输入正确的手机号",
        icon: "none",
        duration: 1000,
        mask: true
      })
      return
    }
    if (this.data.uniqueCheck == true){
      wx.showToast({
        title: "手机号已被占用",
        icon: "none",
        duration: 1000,
        mask: true
      })
      return
    }
    if(this.data.pwdCheck==true){
      wx.showToast({
        title: "请正确输入密码",
        icon: "none",
        duration: 1000,
        mask: true
      })
      return
    }
    if (this.data.yanzheng==false){
      wx.showToast({
        title: "请验证手机号",
        icon: "none",
        duration: 1000,
        mask: true
      })
      return
    }
    this.setData({
      phone,
      name,
      pwd,
      account_type
    })
    //向服务器发送请求
    this.getSigninInfo();
  },

  getYanzheng:function(e){
    var that=this;
    var currentTime = that.data.currentTime;
    if (this.data.idCheck == true){
      wx.showToast({
        title:"手机号不正确",
        icon:"none",
        duration:1000,
        mask:true
      })
      return;
    } else if (this.data.uniqueCheck == true) {
      wx.showToast({
        title: "手机号已被占用",
        icon: "none",
        duration: 1000,
        mask: true
      })
      return;
    }else{
      wx.request({
        url: 'http://www.hinatazaka46.cn/StatusWeChatServer/yanzheng.php',
        data:{
          phone:that.data.phone
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        dataType: 'json',
        success: function (res) {
          wx.showToast({
            title: '短信验证码已发送',
            icon: 'none',
            duration: 2000
          });
          that.setData({
            yanzheng_answer: res.data.toString(),
            yanzhengDisable:true
          })

        },
        fail(err) { console.log(err) }
      })

      var interval = setInterval(function () {
        currentTime--; //每执行一次让倒计时秒数减一
        that.setData({
          yanzhengText: currentTime + 's', //按钮文字变成倒计时对应秒数
        })

        //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获         取验证码的按钮恢复到初始化状态只改变按钮文字

        if (currentTime <= 0) {
          clearInterval(interval)
          that.setData({
            yanzhengText: '重新发送',
            currentTime: 61,
            yanzhengDisable: false,
            color: '#929fff'
          })
        }
      }, 1000);

    }
  },

  onGotUserInfo: function (e) {
   
    if(e.detail.userInfo){
      wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl);
    }else{
      
      wx.showToast({
        title: '将无法使用头像',
        icon:"none"
      })
    }
    

  },


  //注册
  getSigninInfo:function(){
    var that=this;
    wx.request({
      url:'http://www.hinatazaka46.cn/StatusWeChatServer/signin.php',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        phone:that.data.phone,
        pwd: util.hexMD5(that.data.pwd),
        name:that.data.name,
        account_type:that.data.account_type
      },
      method:"POST",
      dataType:'json',
      success:function(res){
        that.setData({
          uid: res.data
        });
        //以同步方式存储 uid等信息
        try{
          wx.setStorageSync('uid', that.data.uid);
          wx.setStorageSync('phone', that.data.phone);
          wx.setStorageSync('name', that.data.name);
          wx.setStorageSync('account_type', that.data.account_type);
        }catch(e){
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
      },
      fail(err){console.log(err)},
      complete:function(){}
    })

  },

  phoneInput:function(e){
    this.setData({
      phone:e.detail.value
    })
  },

  pwd1Input:function(e){
    this.setData({
      pwd1:e.detail.value
    })
  },

  pwd2Input:function(e){
    this.setData({
      pwd2:e.detail.value
    })
    
  },

  yanzhengInput:function(e){
    this.setData({
      yanzheng_value:e.detail.value
    })

  },

  checkYanzheng:function(e){
    if (this.data.yanzheng_value == this.data.yanzheng_answer) {
      this.setData({
        yanzheng:true
      })
    }
  },

  checkid:function(e){
    if (isNumber(this.data.phone) && this.data.phone.length == 11){
      this.setData({ idCheck: false })
      this.uniquePhoneCheck();
    }else{
      this.setData({ idCheck: true })
    }
  },

  checkpwd: function(e){
    if (this.data.pwd1 == this.data.pwd2) {
      this.setData({ pwdCheck: false })
    }else{
      this.setData({ pwdCheck: true })
    }
  },

  uniquePhoneCheck:function(e){
    let that=this;
    wx.request({
      url: 'http://www.hinatazaka46.cn/StatusWeChatServer/phoneCheck.php',
      header: {
        "Content-Type": "multipart/form-data"
      },
      data: {
        phone: that.data.phone,
      },
      method: "POST",
      dataType: 'json',
      success: function (res) {
        console.log(res)
        if(res.data>0){
          that.setData({
            uniqueCheck:true
          })
        }
      },
      fail(err) { console.log(err) }

    })
  },

  tologin:function(){
    wx.redirectTo({
      url: '../login/login'
    })
  }


})

function isNumber (val) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}
