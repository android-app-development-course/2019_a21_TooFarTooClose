// pages/myclass/myclass.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity:0,   //1指老师，0指学生
    activeClass:"",
    items:{},
    class_name:"概率论与数理统计",
    running:1
  },

  toClassDetail:function(event){
    var class_id = event.currentTarget.dataset['index'];
    console.log("class_id" + class_id)
    wx.navigateTo({
      url: '../classDetail/classDetail?class_id=' + class_id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      identity:wx.getStorageSync('identity')
    })

    this.getClass()
  },

  getClass:function(){
    let that=this;
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/getClass.php',
      data:{
        skey:wx.getStorageSync('skey'),
        identity:wx.getStorageSync('identity')
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        //返回的json数组结果中包含：running，class_name，teacher，img_url
        that.setData({
          items:res.data
        })
        for(let i=0;i<that.data.items.length;i++){
          that.data.items[i]['running'] = parseInt(that.data.items[i]['running']);
          //截取课程介绍超长的部分
          if (that.data.items[i]['class_intro'].length>35){
            that.data.items[i]['class_intro'].slice(0,34)+"……";
          }
        }
      },
      fail(err){
        wx.showToast({
          title: "错误："+err,
          icon: "none",
          duration: 1000,
          mask: true
        })
      }
    })
  },


  addClass:function(e){
    wx.navigateTo({
      url: '../newClass/newClass',
    })
  },
  addClassStart:function(e){
    this.setData({ activeClass: "active"})
    
  },
  addClassEnd:function(e){
    this.setData({ activeClass: "" })
  }
})