// pages/selfStatusDetail/selfStatusDetail.js
import * as echarts from '../../ec-canvas/echarts';
var x = [];
var y = [];

var Chart = null;
var Labelinterval = 5;

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
    avgScore: 0,//平均专注度
    dailyGraphNotshow: true, //“上一节课”按钮不可用
    skey:"",
    highScore:0,
    lowScore:0,
    allAvgScore:0,
    highTime:"",
    lowTime:"",
    highColor:"#000000",
    lowColor:"#000000",
    avgColor:"#000000",
    ec: {
      lazyLoad: true // 延迟加载
    }

  },

  getAvg: function () {
    let avg = 0;
    let max=0;
    let min=100;
    let maxTime="";
    let minTime="";
    for (var i = 0; i < y.length; i++) {
      if (y[i]>max){
        max=y[i];
        maxTime=x[i];
      }
      if(y[i]<min){
        min=y[i];
        minTime=x[i];
      }
      avg += y[i];
    }
    avg = avg / y.length
    this.setData({
      highScore:max,
      highTime:maxTime,
      lowScore:min,
      lowTime:minTime,
      avgScore:Math.floor(avg),
      allAvgScore:Math.floor(avg)
    })
    this.setData({
      highColor:this.changeColor(this.data.highScore),
      lowColor: this.changeColor(this.data.lowScore),
      avgColor: this.changeColor(this.data.allAvgScore),
    })
    
  },

  changeColor:function(score){
    if(score<60){
      return "red"
    }else if(score<80){
      return "yellow"
    }else{
      return "green"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // classs_id:options['class_id']
      skey:wx.getStorageSync("skey"),
      class_id: 1
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.echartsComponnet = this.selectComponent('#mychart-dom-line');
    this.getTimeData('d')//获取数据
  },

  tapDay: function () {
    Labelinterval = 5;
    this.getTimeData("d")
    this.init_echarts()
    this.setData({
      dailyGraphNotshow: true
    })
  },


  //传入type的值为d,w,m,y
  getTimeData: function (type) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'http://127.0.0.1/StatusWeChatServer/getSelfTimeScore.php',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        class_id: that.data.class_id,
        type: type,
        skey:that.data.skey
      },
      method: "POST",
      dataType: 'json',
      success: function (res) {
        x = res.data['x']
        y = res.data['y']
        wx.hideLoading()
        that.getAvg()
        
      
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
      color: ["#37A2DA"],
      legend: {
        data: ['记录值'],
        right: 10
      },
      grid: {
        top: '15%',
        left: '1%',
        right: '3%',
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        position: function (point, params, dom, rect, size) {
          var x = 0; // x坐标位置
          var y = 5; // y坐标位置
          // 当前鼠标位置
          var pointX = point[0];
          var pointY = point[1];
          var boxWidth = size.contentSize[0];
          var boxHeight = size.contentSize[1];
          if (boxWidth > pointX) {
            x = pointX + 20;
          } else {
            x = pointX - boxWidth - 20;
          }
          return [x, y];
        },
        formatter: "时间：{b} \n 记录值：{c}"
      },
      xAxis: {
        type: 'category',
        data: x,
        axisLabel: {
          interval: Labelinterval,
          rotate: 45
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
        name: '记录值',
        type: 'line',
        smooth: true,
        symbolSize: 0,
        data: y
      }]
    };
    return option;
  },

  tapWeek: function () {
    Labelinterval = 0;
    this.getTimeData("w")
    this.init_echarts()
    this.setData({
      dailyGraphNotshow: false
    })
  },

  tapMonth: function () {
    Labelinterval = 0;
    this.getTimeData("m")
    this.init_echarts()
    this.setData({
      dailyGraphNotshow: false
    })
  },

  tapYear: function () {
    Labelinterval = 0;
    this.getTimeData("y")
    this.init_echarts()
    this.setData({
      dailyGraphNotshow: false
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