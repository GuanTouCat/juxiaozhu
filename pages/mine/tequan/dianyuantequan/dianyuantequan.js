// pages/mine/tequan/dianyuantequan/dianyuantequan.js
var util = require('../../../../utils/util.js');
var tool = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     //核销数据列表
    verificationlist:[],
    //扫码数据
    code:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
     //获取店员当天的核销数据
    getverificationlist(this)
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

  //扫一扫
  scan: function () {
    var that = this
    wx.scanCode({
      success: (res) => {
        console.log("扫码结果", res.result);
        if (res.result) {
          this.setData({
            code: res.result
          })
          wx.showModal({
            title: '提示',
            content: '是否核销',
            confirmText: '确定',
            cancelText: '取消',

            success: function (res) {
              console.log(res)
              if (res.confirm) {
                console.log('用户点击确定')
                checkcode(that)
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
})

function getverificationlist(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/viewChargeOffRecord',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取店员当天核销的优惠券', res.data)
    if (res.data.success == 1) {
      that.setData({
        verificationlist: res.data.result
      })
    }
  })
}


function checkcode(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/coupon/toWriteOffCoupon',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      buyuserid:that.data.code,
    }
  )
  aa.then(res => {
    console.log('店员核销优惠券', res.data)
    if (res.data.success == 1) {
      if(res.data.result.length > 0){
        wx.navigateTo({
          url: '/pages/mine/tequan/dianyuantequan/verificationlist/verificationlist?buyuserid=' + that.data.code,
        })
      }
    }
  })
}
