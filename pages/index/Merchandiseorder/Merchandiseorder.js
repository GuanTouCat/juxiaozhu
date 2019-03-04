// pages/index/Merchandiseorder/Merchandiseorder.js
var tool = require('../../../utils/request.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coupon:[],
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
    getOrderCouponList(this)
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

  //跳店铺抵用券列表
  jumporderlist:function(e){
    wx.navigateTo({
      url: '/pages/index/Merchandiseorder/storecodelist?shopid=' + e.currentTarget.dataset.shopid,
    })
  },
})
function getOrderCouponList(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/account/getOrderList',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取用户购买的订单(已店铺为单位)', res.data)
    if (res.data.result) {
      that.setData({
        coupon: res.data.result
      })
    }
  })
}