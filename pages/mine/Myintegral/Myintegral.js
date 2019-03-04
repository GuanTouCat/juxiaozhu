// pages/mine/Myintegral/Myintegral.js
var tool = require('../../../utils/request.js');
const app = getApp()
Page({
  tabItemClick: function (e) {
    console.log(e)
    this.setData({
      current: e.currentTarget.dataset.pos
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    tabList:['积分记录','兑换记录'],
    current: 0,
    jifen:[],
    a:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.a){
      console.log('a', options.a)
      this.setData({
        a:options.a
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
    getPointList(this)
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
function getPointList(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/account/getPointList',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取积分记录', res.data)
    if (res.data.result) {
      that.setData({
        jifen: res.data.result
      })
    }
  })
}