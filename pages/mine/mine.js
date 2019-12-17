// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_type: 1,   //true指老师，false指学生
    name:"用户名",
    dailyColor:"#000000",
    monthlyColor:"#000000",
    dailyScore:0,
    monthlyScore:0,
    headphoto: "",
    account_type:0,
    reserve_num:3
  },

  //更改分数样式颜色
  changeColor: function(){
    console.log(this.data.dailyScore)
    console.log(this.data.monthlyScore)
    if (this.data.dailyScore<60){
      this.setData({dailyColor:"red"})
    } else if (this.data.dailyScore < 80){
      this.setData({ dailyColor: "yellow" })
    }else{
      this.setData({ dailyColor: "#7FFFAA" })
    }
    if (this.data.monthlyScore < 60) {
      this.setData({ monthlyColor: "red" })
    } else if (this.data.monthlyScore < 80) {
      this.setData({ monthlyColor: "yellow" })
    } else {
      this.setData({ monthlyColor: "#7FFFAA" })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    wx.getUserInfo({
      success(res) {
        console.log(res.userInfo)
        that.setData({
          headphoto: res.userInfo.avatarUrl
        });
      }
    })

    this.setData({
      //headphoto: wx.getStorageSync('avatarUrl'),
      name: wx.getStorageSync('name'),
      account_type: wx.getStorageSync('account_type'),
    })
    
    wx.request({
      url: 'http://www.hinatazaka46.cn/StatusWeChatServer/getScore.php',
      data:{
        uid:wx.getStorageSync('uid')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      dataType: 'json',
      success:function(res){
        that.setData({
          dailyScore:parseInt( res.data[0]['dailyScore']),
          monthlyScore:parseInt( res.data[0]['monthlyScore'])
        })
        that.changeColor();
      }
    })
    
  },

  toAboutUs:function(){
    wx.navigateTo({
      url: '../aboutUs/aboutUs'
    })
  },

  toSelfInfo:function(){
    wx.navigateTo({
      url: '../selfinfo/selfinfo'
    })
  },

})