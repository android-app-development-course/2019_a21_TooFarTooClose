// pages/classResource/classResource.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    class_id:0,
    items:{},
    resourceTitle:"",
    identity:0,
    openDropdown:0,
    tempFilePath:""
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
        class_id:that.data.class_id
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      method: "POST",
      dataType: 'json',
      success:function(res){
        that.setData({
          items:res.data
        })
      }
    })
  },

  pickResource:function(){
    let that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        let tempFilePath = res.tempFilePaths
        that.setData({
          tempFilePath:tempFilePath
        })
      }
    })
  },

  uploadResource:function(e){
    let { resourceTitle} = e.detail.value;
    if(resourceTitle.length==0){
      wx.showToast({
        title: '请输入资源标题',
        icon:"none"
      })
      return
    }

    //上传文件
    wx.uploadFile({
      url: 'http://127.0.0.1/',//此处应是小程序后台服务器(开发者)的地址，由微信服务器向开发者的后台服务器发送POST请求，参考https://www.cnblogs.com/ailex/p/10007885.html
      filePath: that.data.tempFilePath,
      name: this.data.resourceTitle,
      formData: { //上传POST参数信息
        "class_id": that.data.class_id,
        'resource_title':that.data.resourceTitle
      },
      success(res) { //上传成功回调函数
        const data = res.data
        wx.showToast({
          title: '上传成功',
          icon: "success",
          duration: 1000,
          mask: true
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