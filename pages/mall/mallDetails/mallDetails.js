// pages/mall/mallDetails/mallDetails.js
var ajax = require('../../../utils/requestNew.js');
const app = getApp();
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
    key: '4DNBZ-TMI6J-R4XFS-FUX3K-5AEWV-TPFWM' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
    data: {
      name: undefined,
      address: undefined,
      pageSize:0,
      marketDetail:{},
      activityShopList:[],
      lunbo:[
          // {picUrl:'https://rzpro.oss-cn-hangzhou.aliyuncs.com/market/QnWH3pOuF84.jpg'}
      ]
    },
    toGPS(){
        demo.geocoder({
            address:this.data.address,
            success: res => {
                let lat = res.result.location.lat;
                let lng = res.result.location.lng;
                if (this.data.address){
                    wx.openLocation({
                        latitude: lat, // 纬度，范围为-90~90，负数表示南纬
                        longitude: lng, // 经度，范围为-180~180，负数表示西经
                        address: this.data.address,
                        scale: 28, // 缩放比例
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
    toShopDetail(e) {
        let shopId = e.currentTarget.dataset.shopid;
        wx.navigateTo({
            url: '/pages/details/details?shopid=' + shopId
        })
    },

    getHasActMall(pageSize) {
        let url = app.globalData.url + '/rzapi/market/getMarketActInfo';
        let data = {
            openId: wx.getStorageSync('openid'),
            marketId: this.data.marketId
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                let marketDetail = res.data.result;
                let startTime = marketDetail.startTime.replace(/-/g, '.');
                let endTime = marketDetail.endTime.replace(/-/g, '.');
                marketDetail.startTime = startTime;
                marketDetail.endTime = endTime;
                this.setData({
                    marketDetail:marketDetail
                });

                let url = app.globalData.url + '/rzapi/market/getMarketActShop';
                let data = {
                    openId: wx.getStorageSync('openid'),
                    maractId: res.data.result.maractId,
                    rownum: pageSize * 10
                };
                ajax.postAjax(url, data).then(res =>{
                    if (res.data.success == 1){
                        this.setData({
                            activityShopList: this.data.activityShopList.concat(res.data.result)
                        });
                        wx.hideNavigationBarLoading();
                        wx.stopPullDownRefresh();
                    }
                })
            }else {
                wx.showToast({
                    title: '网络请求异常',
                    icon: 'none'
                })
            }
        })
    },

    getNoActMall(pageSize) {
        let url = app.globalData.url + '/rzapi/market/getMarketShops';
        let data = {
            openId: wx.getStorageSync('openid'),
            marketId: this.data.marketId,
            rownum: pageSize * 10
        }
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                this.setData({
                    activityShopList: this.data.activityShopList.concat(res.data.result)
                });
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            }
        })
    },

    buyMallTicket(e) {//购买商场券
        wx.showModal({
            title: '提示',
            content: '该券购买需支付' + this.data.marketDetail.couPrice + '元',
            confirmText: '确认支付',
            cancelText: '取消',
            success: res => {
                if (res.confirm) {
                    console.log('用户点击确认支付');
                    let goodsId = e.currentTarget.dataset.goodsid;
                    let url = app.globalData.url + '/rzapi/market/insertOrder';
                    let data = {
                        openId: wx.getStorageSync('openid'),
                        userId: wx.getStorageSync('userid'),
                        marketId: this.data.marketId,
                        goodsId,
                        goodsNum: 1,
                        orderAmount: this.data.marketDetail.couPrice
                    };
                    ajax.postAjax(url, data).then(res =>{
                        let nonceStr = res.data.result.noncestr;
                        let timeStamp = res.data.result.timestamp;
                        let pk = "prepay_id=" + res.data.result.prepayid;
                        let signType = "MD5";
                        let paySign = res.data.result.sign;
                        wx.requestPayment({
                            timeStamp,
                            nonceStr,
                            package: pk,
                            signType,
                            paySign,
                            success: res => {

                            },
                            fail: res => {

                            }
                        })
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          marketId: options.marketId,
          isHasAct: options.isHas,
          name: options.name,
          address: options.address,
          shopAvator: options.shopAvator
      })
      let lunbo = this.data.lunbo;
      lunbo.push({picUrl:this.data.shopAvator});
      this.setData({
          lunbo
      })
      wx.setNavigationBarTitle({
        title: options.name
      })
      if (options.isHas == 1) {
          this.getHasActMall(this.data.pageSize)
      }else {
          this.getNoActMall(this.data.pageSize)
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
      console.log('我下拉刷新了')
      this.setData({
          pageSize: 0
      });
      if (this.data.isHasAct == 1) {
          wx.showNavigationBarLoading({
              success: res =>{
                  this.getHasActMall(this.data.pageSize)
              }
          })
      } else {
          wx.showNavigationBarLoading({
              success: res =>{
                  this.getNoActMall(this.data.pageSize)
              }
          })
      }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      this.setData({
          pageSize: ++this.data.pageSize
      });
      if (this.data.isHasAct == 1) {
          this.getHasActMall(this.data.pageSize)
      } else {
          this.getNoActMall(this.data.pageSize)
      }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});
