// pages/details/details.js
var tool = require('../../utils/request.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
    key: 'G37BZ-FUVCO-R4JW2-S7JUI-P3ES5-QGBZK' // 必填
});
const app = getApp();
Page({
  //收藏店铺
  shoucang:function() {
    clickToFavo(this)
  },
  //取消收藏店铺
  quxiaoshoucang:function(){
    cancelToFavo(this)
  },
  tabItemClick: function (e) {
    this.setData({
      current: e.currentTarget.dataset.pos
    })
  },
  tabItemClick2: function (e) {
    this.setData({
      current2: e.currentTarget.dataset.pos
    })
    if (e.currentTarget.dataset.pos == 0){
       this.setData({
         commentType:''
       })
    } else if (e.currentTarget.dataset.pos == 1){
      this.setData({
        commentType: 1
      })
    } else if (e.currentTarget.dataset.pos == 2) {
      this.setData({
        commentType: 2
      })
    } else if (e.currentTarget.dataset.pos == 3) {
      this.setData({
        commentType: 3
      })
    }

    getShopIndexCoupon2(this)
  },
  shopname: function (e) {
    wx.navigateTo({
      url: "../details/shopname/shopname?type=" + e.currentTarget.dataset.shopid,
    })
  },
  // oder: function (e) {
  //   wx.navigateTo({
  //     url: "../details/order/order",
  //   })
  // },
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    tabList: ['优惠券', '评价'],
    tabList2: ['全部','好评','中评','差评'],
    current: 0,//当前选中的Tab项
    current2:0,
    firstpagedetails: [],
    shangpin:[],
    allevaluate:[],
    type1:'3',
    commentType:'',
    shopid:'',
    favo:'',
    IDD:'',
    //店铺详情信息
    shopdetail:[],
    shopPicList:[],
    count: 0,
    arr:[],
    aspectFill:'',
      lat:undefined,
      lng:undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.shopid) {
       this.setData({
         IDD: options.shopid
       })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取店铺详情信息
    getShopSpecific(this)
    //评价接口
    getShopIndexCoupon2(this)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '给您分享了' + this.data.shopdetail.shopName+'!',
      // path: 'pages/detail/detail?taskid='+this.data.IDD,
      path: 'pages/index/index?shopid=' + this.data.IDD,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
    toGroupIndex(){
        wx.navigateTo({
            url: '/pages/details/groupBuy/groupBuy?shopId='+ this.data.IDD + "&title=" + this.data.shopdetail.shopName
        })
    },
    toGPS: function () {//打开腾讯地图
        // 调用接口
        demo.reverseGeocoder({
            location:{
                latitude: wx.getStorageSync('latitude'),
                longitude:  wx.getStorageSync('longitude')
            },
            success: res => {
                if (this.data.lat && this.data.lng){
                    wx.openLocation({
                        latitude: this.data.lat, // 纬度，范围为-90~90，负数表示南纬
                        longitude: this.data.lng, // 经度，范围为-180~180，负数表示西经
                        scale: 28, // 缩放比例
                        // address: '苏州喜悦尚中心'
                    })
                } else {
                    wx.showToast({
                        title: '抱歉！暂无商家位置信息',
                        icon:"none"
                    })
                }
            },
            fail: function (res) {},
            complete: function (res) {}
        });
    },
  //购买优惠券
    buy:function(e){
      var that = this
      var shopid = e.currentTarget.dataset.shopid
      var goodsid = e.currentTarget.dataset.goodsid
      var price = e.currentTarget.dataset.price
      wx.showModal({
        title: '提示',
        content: '该抵用券购买需支付'+price+'元',
        confirmText: '确认支付',
        cancelText: '取消',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确认支付')
            pay(that,shopid,goodsid,price)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    },
    previewImage:function(e) {//预览轮播图
        let index = e.currentTarget.dataset.index
        let arr = this.data.shopdetail.shopPicList.map(item =>{
            return item.picUrl
        })
        wx.previewImage({
            current: this.data.shopdetail.shopPicList[index].picUrl, // 当前显示图片的http链接
            urls: arr // 需要预览的图片http链接列表
        })
    }

})
//获取首页记录详情接口
function getShopSpecific(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/shop/getShopSpecific',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      shopid: that.data.IDD,
      rownum:'0',
    }
  )
  aa.then(res => {
    console.log('获取店铺详情信息', res.data)
    if (res.data.result) {
        let person = res.data.result.shopPicList;
        let obj = {};
        person = person.reduce((cur,next) => {
            obj[next.picUrl] ? "" : obj[next.picUrl] = true && cur.push(next);
            return cur;
        },[]) //设置cur默认类型为数组，并且初始值为空的数组

        if (res.data.result.shopGroup){
            let currentList = res.data.result.shopGroup
            let startTime = currentList.startTime.replace(/-/g, ".");
            let endTime = currentList.endTime.replace(/-/g, ".");
            that.setData({
                currentList: res.data.result.shopGroup,
                startTime,
                endTime
            })
        }
      that.setData({
        shopdetail: res.data.result,
        favo: res.data.result.isFavo,
        shopPicList:person,
          key:res.data.result.creditCount,
          lat:Number(res.data.result.latitude),
          lng:Number(res.data.result.longitude),

      })
        checkImgInfo(res.data.result.shopPicList, that)
    }
    wx.setNavigationBarTitle({
      title: res.data.result.shopName,
    })
  })
}


//收藏
function clickToFavo(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/favo/clickToFavo',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      shopid: that.data.IDD,
    }
  )
  aa.then(res => {
    console.log('是否收藏接口', res.data)
    if (res.data.result) {
      that.setData({
        favo: res.data.result.favoStatus
      })

      getShopSpecific(that)

    }
  })
}
//
// //取消收藏
// function cancelToFavo(that) {
//   var aa = tool.request(
//     getApp().globalData.url + '/rzapi/favo/clickToFavo',
//     'POST',
//     {
//       openId: wx.getStorageSync('openid'),
//       userid: wx.getStorageSync('userid'),
//       shopid: that.data.IDD,
//     }
//   )
//   aa.then(res => {
//     console.log('取消收藏', res.data)
//     if (res.data.result) {
//       that.setData({
//         favo: res.data.result.favoStatus
//       })
//       wx.showToast({
//         title: '取消成功',
//         icon: 'success',
//         duration: 1500
//       })
//       getShopSpecific(that)
//     }
//   })
// }

//获取店铺首页下半部分商品类接口（type=2）
function getShopIndexCoupon1(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/shop/getShopIndexCoupon',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      shopid: that.data.IDD,
      rownum:'0',
      type:that.data.type1,
    }
  )
  aa.then(res => {
    console.log('获取商品', res.data)
    if (res.data.result) {
      that.setData({
        shangpin: res.data.result
      })
    }
  })
}
//获取店铺首页下半部分评价类接口
function getShopIndexCoupon2(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/comment/shopComment',
    'POST',
    {
      shopid: that.data.IDD,
      rownum:0,
      commentType:that.data.commentType,
    }
  )
  aa.then(res => {
    console.log('获取评价接口', res.data)
    if (res.data.result) {
      that.setData({
        allevaluate:res.data.result
      })
    }
  })
}


function pay(that, shopid, goodsid, price) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/order/insertOrder',
    'POST',
    {
      userId: wx.getStorageSync('userid'),
      openId: wx.getStorageSync('openid'),
      shopId: shopid,
      goodsId: goodsid,
      goodsNum: 1,
      orderAmount: price
    }
  )
  aa.then(res => {
    console.log('请求支付', res.data.result)
    wx.requestPayment({
      'timeStamp': res.data.result.timestamp,
      'nonceStr': res.data.result.noncestr,
      'package': "prepay_id=" + res.data.result.prepayid,
      'signType': 'MD5',
      'paySign': res.data.result.sign,
      'success': function (res) {
        // wx.showToast({
        //   title: '支付成功',
        //   icon: 'success',
        //   duration: 1500,
        // })
        wx.showModal({
          title: '提示',
          content: '支付成功后请在订单中查看',
          showCancel: false
        })
      },
      'fail': function (res) {
        console.log('支付失败',res)
        wx.showToast({
          title: '支付失败',
          icon: 'loading',
          duration: 1500
        });
      }
    })
  })
}
function checkImgInfo (list,that) {
  console.log('图片长度', list.length);
  for (let i = 0; i<list.length; i++){
      wx.getImageInfo({
          src: list[i].picUrl,  // 这里填写网络图片路径
          success: (res) => {
              if (res.width/res.height <= 0.6){
                    that.setData({
                        aspectFill:'aspectFill'
                    })
              }
          }
      });
  }
}
// const clipImage = (src, imgW, imgH, that, cb) => {
//     // ‘canvas’为前面创建的canvas标签的canvas-id属性值
//     console.log('我执行了几次？');
//     console.log(src)
//     that.setData({
//         count : that.data.count+1
//     })
//     let ctx = wx.createCanvasContext('canvas' + that.data.count);
//     let canvasH = imgH;
//     if (imgW / imgH < 0.6) { // 长宽比大于5:4
//         canvasH = imgH * 0.6;
//     }
//     // 将图片绘制到画布
//     ctx.drawImage(src, -100, -180, 750,650);
//     // draw()必须要用到，并且需要在绘制成功后导出图片
//     ctx.draw(false, () => {
//         // setTimeout(() => {
//             //  导出图片
//             wx.canvasToTempFilePath({
//                 width: imgW,
//                 height: canvasH,
//                 destWidth: imgW,
//                 destHeight: canvasH,
//                 canvasId: 'canvas' + that.data.count,
//                 fileType: 'png',
//                 success: (res) => {
//                   console.log(res)
//                     // res.tempFilePath为导出的图片路径
//                     that.data.arr.push(res.tempFilePath)
//                     typeof cb == 'function' && cb(res.tempFilePath);
//                 }
//             })
//         // }, 700);
//     })
//
// };
