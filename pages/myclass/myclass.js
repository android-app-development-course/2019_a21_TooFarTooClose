// pages/myclass/myclass.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_type:0,   //1指老师，0指学生
    activeClass:"",
    items:{},
    class_name:"概率论与数理统计",
    course_status:1
  },

  toClassDetail:function(event){
    var course_id = event.currentTarget.dataset['index'];
    console.log("course_id" + course_id)
    wx.navigateTo({
      url: '../classDetail/classDetail?course_id=' + course_id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      account_type:wx.getStorageSync('account_type')
    })

    this.getClass()
  },

  getClass:function(){
    let that=this;
    wx.request({
      url: 'http://www.hinatazaka46.cn/StatusWeChatServer/getClass.php',
      data:{
        uid:wx.getStorageSync('uid'),
        account_type:wx.getStorageSync('account_type')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        //返回的json数组结果中包含：course_status，class_name，teacher，img_url
        that.setData({
          items:res.data
        })
        for(let i=0;i<that.data.items.length;i++){
          that.data.items[i]['course_status'] = parseInt(that.data.items[i]['course_status']);
          //截取课程介绍超长的部分
          if (that.data.items[i]['introduction_text'].length>35){
            that.data.items[i]['introduction_text'].slice(0,34)+"……";
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