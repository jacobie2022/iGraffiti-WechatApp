//main.js
//获取应用实例
var app = getApp()
const ctx = wx.createCanvasContext('myCanvas')
// 步数参数，要不要写进page的data里面？
// var step = 0
Page({
  data: {
    step: 0,
    Paths: '',
    pen: 5,           //画笔粗细默认值
    color: '#000000', //画笔颜色默认值
    isPopping: false, //是否已经弹出
    isPenPopping: false, //画笔滑动条是否弹出
    animPalette: {},  //旋转动画
    //item位移,透明度
    animC01: {}, animC02: {}, animC03: {}, animC04: {}, animC05: {}, animC06: {}, animC07: {}, animC08: {}, animC09: {}, animC10: {}, animC11: {}, animC12: {}, animC13: {}, animC14: {}, animC15: {}, animC16: {}, animC17: {}, animC18: {},
    /*animC19: {}, animC20: {}, animC21: {}, animC22: {}, animC23: {}, animC24: {}, animC25: {},*/
  },
  startX: 0, //保存X坐标轴变量
  startY: 0, //保存X坐标轴变量
  isClear: false, //是否启用橡皮擦标记,ture清除,false未启用

  //手指触摸动作开始
  touchStart: function (e) {
    //得到触摸点的坐标
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y
    this.context = wx.createContext()

    if (this.isClear) {
      this.context.setStrokeStyle('#ffffff')  //设置线条样式
      this.context.setLineCap('round')  //设置线条端点的样式
      this.context.setLineJoin('round')  //设置两线相交处的样式
      this.context.setLineWidth(20)  //设置线条宽度
      this.context.beginPath()  //开始一个路径 
      this.context.arc(this.startX, this.startY, 5, 0, 2 * Math.PI, true)
      this.context.fill()  //填充路径内颜色
    }
    else {
      this.context.setStrokeStyle(this.data.color)
      this.context.setLineWidth(this.data.pen)
      this.context.setLineCap('round')
      this.context.beginPath()
    }
  },
  //手指触摸后移动
  touchMove: function (e) {
    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y
    if (this.isClear) {
      this.context.moveTo(this.startX, this.startY)
      this.context.lineTo(startX1, startY1);  //绘制直线
      this.context.stroke();  //描边已画路径
      this.startX = startX1;
      this.startY = startY1;
    }
    else {
      this.context.moveTo(this.startX, this.startY)
      this.context.lineTo(startX1, startY1)
      this.context.stroke()
      this.startX = startX1;
      this.startY = startY1;
    }
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: this.context.getActions() // 获取绘图动作数组
    })
  },
  //手指触摸动作结束
  touchEnd: function () {
    // 为什么单独赋值不能运算
    var _this = this
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        // success
        // 每次画完都要把画完的临时路径发到缓存里
        // 不知道缓存能存多少东西
        console.log(res.tempFilePath)
        console.log(_this.data.step)
        wx.setStorage({
          key: _this.data.step.toString(),
          data: res.tempFilePath,
        })
        // 步数+1
        _this.data.step++
        // console.log(this.data.step)
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
    this.setData({
      step: _this.data.step
    });
    console.log(this.data.step)
  },
  // 撤销
  revoke: function () {
    if (this.data.step >= 1) {
      this.data.step--
      var _this = this
      wx.getStorage({
        key: _this.data.step.toString(),
        success: function (res) {
          console.log(res.data)
          var imageTempPath = res.data
          wx.getImageInfo({
            src: res.data,
            success: function (res) {
              console.log("成功获取图片")
              // 需要再看看保存下来的图片的尺寸
              ctx.drawImage(imageTempPath, 10, 10, res.height, res.width);
            }
          })
        },
      })
      wx.removeStorage({
        key: _this.data.step.toString(),
        success: function (res) {
          console.log("清除成功")
        },
      })
    }
    else {

    }
  },
  saveImage: function () {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log("保存成功")
          }
        })
      }
    })
  },
  //启动橡皮擦方法
  clearCanvas: function () {
    this.isClear = true;
  },
  penSelect: function (e) { //更改画笔大小的方法
    console.log(e.currentTarget);
    this.setData({
      // pen: parseInt(e.currentTarget.dataset.param)
      pen: e.detail.value
    });
    this.isClear = false;
  },
  colorSelect: function (e) { //更改画笔颜色的方法
    console.log(e.currentTarget);
    this.setData({
      color: e.currentTarget.dataset.param
    });
    this.isClear = false;
  },
  showPenSlider: function () {
    if (this.data.isPenPopping) { }
    else { }
  },
  palette: function () {
    if (this.data.isPopping) {
      this.fold();
      this.setData({
        isPopping: false
      })
    }
    else {
      this.pop();
      this.setData({
        isPopping: true
      })
    }
  },
  pop: function () {
    var anim_palette = wx.createAnimation({
      duration: 500,  //动画持续时间500ms
      timingFunction: 'ease-out'  //低速结束
    })
    var anim_c01 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c02 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c03 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c04 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c05 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c06 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c07 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c08 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c09 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c10 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c11 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c12 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c13 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c14 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c15 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c16 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c17 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c18 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    /*var anim_c19 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var anim_c20 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var anim_c21 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var anim_c22 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var anim_c23 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var anim_c24 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var anim_c25 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })*/
    anim_palette.rotateZ(180).step();
    anim_c01.translate(10, 55).rotateZ(360).opacity(1).step();
    anim_c02.translate(10, 115).rotateZ(360).opacity(1).step();
    anim_c03.translate(30, 85).rotateZ(360).opacity(1).step();
    anim_c04.translate(50, 55).rotateZ(360).opacity(1).step();
    anim_c05.translate(50, 115).rotateZ(360).opacity(1).step();
    anim_c06.translate(70, 85).rotateZ(360).opacity(1).step();
    anim_c07.translate(90, 55).rotateZ(360).opacity(1).step();
    anim_c08.translate(90, 115).rotateZ(360).opacity(1).step();
    anim_c09.translate(110, 85).rotateZ(360).opacity(1).step();
    anim_c10.translate(130, 55).rotateZ(360).opacity(1).step();
    anim_c11.translate(130, 115).rotateZ(360).opacity(1).step();
    anim_c12.translate(150, 85).rotateZ(360).opacity(1).step();
    anim_c13.translate(170, 55).rotateZ(360).opacity(1).step();
    anim_c14.translate(170, 115).rotateZ(360).opacity(1).step();
    anim_c15.translate(190, 85).rotateZ(360).opacity(1).step();
    anim_c16.translate(210, 55).rotateZ(360).opacity(1).step();
    anim_c17.translate(210, 115).rotateZ(360).opacity(1).step();
    anim_c18.translate(230, 85).rotateZ(360).opacity(1).step();
    /*anim_c19.translate(50,410).rotateZ(360).opacity(1).step();
      anim_c20.translate(10,430).rotateZ(360).opacity(1).step();
      anim_c21.translate(50,450).rotateZ(360).opacity(1).step();
      anim_c22.translate(10,470).rotateZ(360).opacity(1).step();
      anim_c23.translate(50,490).rotateZ(360).opacity(1).step();
      anim_c24.translate(10,510).rotateZ(360).opacity(1).stepPath();
      anim_c25.translate(50,530).rotateZ(360).opacity(1).step();*/
    this.setData({
      animPalette: anim_palette.export(),
      animC01: anim_c01.export(), animC02: anim_c02.export(),
      animC03: anim_c03.export(), animC04: anim_c04.export(),
      animC05: anim_c05.export(), animC06: anim_c06.export(),
      animC07: anim_c07.export(), animC08: anim_c08.export(),
      animC09: anim_c09.export(), animC10: anim_c10.export(),
      animC11: anim_c11.export(), animC12: anim_c12.export(),
      animC13: anim_c13.export(), animC14: anim_c14.export(),
      animC15: anim_c15.export(), animC16: anim_c16.export(),
      animC17: anim_c17.export(), animC18: anim_c18.export(),
      /*animC19: anim_c19.export(), animC20: anim_c20.export(),
        animC21: anim_c21.export(), animC22: anim_c22.export(),
        animC23: anim_c23.export(), animC24: anim_c24.export(),
        animC25: anim_c25.export(),*/
    })
  },
  fold: function () {
    var anim_palette = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c01 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c02 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c03 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c04 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c05 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c06 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c07 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c08 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c09 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c10 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c11 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c12 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c13 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c14 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c15 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c16 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c17 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var anim_c18 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    /*var anim_c19 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var anim_c20 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var anim_c21 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var anim_c22 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var anim_c23 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var anim_c24 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var anim_c25 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })*/
    anim_palette.rotateZ(0).step();
    anim_c01.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c02.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c03.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c04.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c05.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c06.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c07.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c08.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c09.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c10.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c11.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c12.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c13.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c14.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c15.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c16.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c17.translate(0, 0).rotateZ(0).opacity(0).step();
    anim_c18.translate(0, 0).rotateZ(0).opacity(0).step();
    /*anim_c19.translate(0,0).rotateZ(0).opacity(0).step();
      anim_c20.translate(0,0).rotateZ(0).opacity(0).step();
      anim_c21.translate(0,0).rotateZ(0).opacity(0).step();
      anim_c22.translate(0,0).rotateZ(0).opacity(0).step();
      anim_c23.translate(0,0).rotateZ(0).opacity(0).step();
      anim_c24.translate(0,0).rotateZ(0).opacity(0).step();
      anim_c25.translate(0,0).rotateZ(0).opacity(0).step();*/
    this.setData({
      animPalette: anim_palette.export(),
      animC01: anim_c01.export(), animC02: anim_c02.export(),
      animC03: anim_c03.export(), animC04: anim_c04.export(),
      animC05: anim_c05.export(), animC06: anim_c06.export(),
      animC07: anim_c07.export(), animC08: anim_c08.export(),
      animC09: anim_c09.export(), animC10: anim_c10.export(),
      animC11: anim_c11.export(), animC12: anim_c12.export(),
      animC13: anim_c13.export(), animC14: anim_c14.export(),
      animC15: anim_c15.export(), animC16: anim_c16.export(),
      animC17: anim_c17.export(), animC18: anim_c18.export(),
      /*animC19: anim_c19.export(), animC20: anim_c20.export(),
        animC21: anim_c21.export(), animC22: anim_c22.export(),
        animC23: anim_c23.export(), animC24: anim_c24.export(),
        animC25: anim_c25.export(),*/
    })
  },
  onLoad: function (e) {
    this.setData({
      Paths: e.Paths,
      step: 0
    })
    var path = ''
    path = e.Paths
    wx.getImageInfo({
      src: path,
      success: function (res) {
        // success
        var originalWidth = res.width;//图片原始宽 
        var originalHeight = res.height;//图片原始高 
        var originalScale = originalHeight / originalWidth;//图片高宽比
        wx.getSystemInfo({
          success: function (res) {
            // success
            var imageSize = {};
            // 左右留白各10
            var windowWidth = res.windowWidth - 20;
            // 去掉最高157+留白上10下10
            var windowHeight = res.windowHeight - 177;
            // 显示区域高宽比
            var windowscale = windowHeight / windowWidth
            if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比 
              //图片缩放后的宽为屏幕宽 
              imageSize.imageWidth = windowWidth;
              imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
              // 路径+左上角x+左上角y+宽度+高度
              ctx.drawImage(e.Paths, 10, (res.windowHeight - imageSize.imageHeight - 157) / 2, imageSize.imageWidth, imageSize.imageHeight)
            } else {//图片高宽比大于屏幕高宽比 
              //图片缩放后的高为屏幕高 
              imageSize.imageHeight = windowHeight;
              imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
              // 路径+左上角x+左上角y+宽度+高度
              ctx.drawImage(e.Paths, (res.windowWidth - imageSize.imageWidth) / 2, 10, imageSize.imageWidth, imageSize.imageHeight)
            }
            ctx.draw()
          }
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  }
})