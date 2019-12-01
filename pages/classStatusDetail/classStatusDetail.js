// pages/classStatusDetail/classStatusDetail.js
import * as echarts from '../../ec-canvas/echarts';
var x=[];
var y1=[];
var y2=[];
var y3=[];
var Chart = null;
var Labelinterval=5;

const app = getApp();     // 取得全局App


Page({


  /**
   * 页面的初始数据
   */
  data: {
    class_id: 0,
    isPopping: false,//是否已经弹出
    animPlus: {},//旋转动画
    animCollect: {},//item位移,透明度
    animTranspond: {},//item位移,透明度
    animInput: {},//item位移,透明度
    avg_list: {},//所有学生的平均专注度
    best5list: {},//专注度前五学生名字和专注度
    worse5list: {},//专注度末五学生名字和专注度
    classAvgScore: 0,//班级总体平均专注度
    dailyGraphNotshow:true, //“上一节课”按钮不可用
    ec: {
      lazyLoad: true // 延迟加载
    }

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // classs_id:options['class_id']
      class_id: 1
    })
    this.echartsComponnet = this.selectComponent('#mychart-dom-line');
    //this.ecComponent = this.selectComponent('#mychart-dom-line');
    this.getAverageScore()
    this.getTimeData('d')//获取数据
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  tapDay:function(){
    Labelinterval = 5;
    this.getTimeData("d")
    this.init_echarts()
    this.setData({
      dailyGraphNotshow:true
    })
  },

  tiexy: function (x, y) {
    let res = [];
    for (let i = 0; i < x.length; i++) {
      let tmp=[x[i],y[i]];
      res.push(tmp)
    }
    return res;
  },

  //传入type的值为d,w,m,y
  getTimeData: function (type) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/getTimeScore.php',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        class_id: that.data.class_id,
        type: type
      },
      method: "POST",
      dataType: 'json',
      success: function (res) {
        
        x=res.data['x']
        y1 = res.data['y1']
        y2 = res.data['y2']
        y3 = res.data['y3']
        wx.hideLoading()

        //如果是第一次绘制
        if (!Chart) {
          that.init_echarts(); //初始化图表
        } else {
          that.setOption(Chart); //更新数据
        }

      }
    })



  },

  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      // Chart.setOption(this.getOption());
      this.setOption(Chart);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },

  setOption: function (Chart) {
    // Chart.clear();  // 清除
    Chart.setOption(this.getOption());  //获取新数据
  },

  getOption: function () {
    // 指定图表的配置项和数据
    var option = {
      backgroundColor: "#fff",
      color: ["#37A2DA", "#7FFF00", "#FFFF00"],
      legend: {
        data: ['平均', '最好', '最差'],
        right: 10
      },
      grid: {
        top: '15%',
        left: '1%',
        right: '3%',
        bottom: '60rpx',
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter: "{b} \n {c0} %"
      },
      xAxis: {
        type: 'category',
        data:x,
        axisLabel: {
          interval: Labelinterval,
          rotate:45 
        },
        axisTick: {
          inside: true,
          alignWithLabel: true
        }
      },
      yAxis: {
        x: 'center',
        name: '分数',
        type: 'value',
        scale: true,
      },
      series: [{
        name: '平均',
        zIndex: 3,
        type: 'line',
        smooth: true,
        symbolSize: 0,
        data: y1
      }, {
        name: '最好',
        zIndex: 2,
        type: 'line',
        smooth: true,
        symbolSize: 0,
        data: y2
      }, {
        name: '最差',
        zIndex: 1,
        type: 'line',
        smooth: true,
        symbolSize: 0,
        data: y3
      }]
    };
    return option;
  },

  tapWeek:function(){
    Labelinterval = 0;
    this.getTimeData("w")
    this.init_echarts()
    this.setData({
      dailyGraphNotshow: false
    })
  },

  tapMonth:function(){
    Labelinterval=0;
    this.getTimeData("m")
    this.init_echarts()
    this.setData({
      dailyGraphNotshow: false
    })
  },

  tapYear:function(){
    Labelinterval=0;
    this.getTimeData("y")
    this.init_echarts()
    this.setData({
      dailyGraphNotshow: false
    })
  },

  //获取所有学生的平均分
  getAverageScore: function () {
    let that = this
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/getAverageScore.php',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        class_id: that.data.class_id,
      },
      method: "POST",
      dataType: 'json',
      success: function (res) {
        that.setData({
          avg_list: res.data
        })
        //升序排序
        that.data.avg_list.sort(function (a, b) {
          return a.avg_score - b.avg_score
        })
        if (that.data.avg_list.length > 5) {
          that.setData({
            best5list: that.data.avg_list.slice(that.data.avg_list.length - 6, that.data.avg_list.length - 1).reverse(),
            worse5list: that.data.avg_list.slice(0, 5),
          })
        } else {
          that.setData({
            best5list: that.data.avg_list,
            worse5list: that.data.avg_list,
          })
        }
        let classAvgScore = 0;
        for (let i = 0; i < that.data.best5list.length; i++) {
          classAvgScore += that.data.best5list[i].avg_score
        }

        that.setData({
          classAvgScore: classAvgScore / that.data.best5list.length
        })

        for (let i = 0; i < that.data.best5list.length; i++) {
          if (0 < that.data.best5list[i].avg_score && that.data.best5list[i].avg_score < 60) {
            that.data.best5list[i]['color'] = "red"
          } else if (60 <= that.data.best5list[i].avg_score && that.data.best5list[i].avg_score < 80) {
            that.data.best5list[i]['color'] = "yellow"
          } else if (80 <= that.data.best5list[i].avg_score && that.data.best5list[i].avg_score < 100) {
            that.data.best5list[i]['color'] = "green"
          }

        }

      }
    })
  },


  ///////////////////////弹出菜单动画///////////////////////////
  //点击弹出
  plus: function () {
    if (this.data.isPopping) {
      //缩回动画
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },
  input: function () {
    console.log("input")
    this.tapWeek()
    this.plus();//收回
  },
  transpond: function () {
    console.log("transpond")
    this.tapMonth()
    this.plus();//收回
  },
  collect: function () {
    console.log("collect")
    this.tapYear()
    this.plus();//收回
  },

  //弹出动画
  popp: function () {
    //plus顺时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(180).step();
    animationcollect.translate(-50, -50).rotateZ(180).opacity(1).step();
    animationTranspond.translate(-70, 0).rotateZ(180).opacity(1).step();
    animationInput.translate(-50, 50).rotateZ(180).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  //收回动画
  takeback: function () {
    //plus逆时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },

})