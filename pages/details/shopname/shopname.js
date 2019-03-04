// pages/details/shopname/shopname.js
var tool = require('../../../utils/request.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopbrief:[],
    IDD:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type){
      console.log('aaaaaaaa', options.type)
      this.setData({
        IDD:options.type
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
    //店铺简介接口
    getShopBrief(this)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
//获取店铺简介接口
function getShopBrief(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/shop/getShopBrief',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      shopid: that.data.IDD,
    }
  )
  aa.then(res => {
    console.log('aaaaaa', res.data)
    if (res.data.result) {
      that.setData({
        shopbrief: res.data.result
      })
    }

    wx.setNavigationBarTitle({
      title: res.data.result.shopName,
    })
  })
}