// pages/searchResult/searchResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue:"",
    resultArray:{},
    items:{},
    runningCheck:0,
    joinable:1,
  },

  //得到查询结果
  getResult:function(){
    let that=this;
    wx.showLoading({
      title: '查找中',
    })
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/searchCourse.php',
      data:{
        value:this.data.searchValue
      },
      method: "GET",
      dataType: 'json',
      success: function (res) {
        wx.hideLoading()
        that.setData({
          resultArray: res.data,
        })
        for (var j = 0 ; j < that.data.resultArray.length; j++) {
          that.data.resultArray[j]['running'] = parseInt(that.data.resultArray[j]['running']);
          that.data.resultArray[j]['joinable'] = parseInt(that.data.resultArray[j]['joinable']);
        }
        that.setData({
          items:that.data.resultArray
        })
        console.log(that.data.items)
      },
      fail(err){
        wx.hideLoading()
        console.log(err)
      }
    })
  },

  searchInput:function(e){
    this.setData({
      searchValue: e.detail.value
    })
  },

  search: function(){
    this.getResult();
  },

  //点击搜索结果项目后跳转到课程详情页面
  toDetail:function(event){
    var class_id = event.currentTarget.dataset['index'];
    console.log("class_id"+class_id)
    wx.navigateTo({
      url:'../classDetail/classDetail?class_id='+class_id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      searchValue:options['value'],
      
    })
    this.getResult();
  },


})