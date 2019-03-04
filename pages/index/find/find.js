// pages/index/find/find.js
var tool = require('../../../utils/request.js');
const app = getApp()
Page({
  wxSearchInput: function (e) {
    var that = this;
    console.log('aaaaa', e.detail.value)
    if (e.detail.value.length > 0) {
      that.setData({
        wxSearchData: e.detail.value,
      })
    }
    console.log('bbbbb',that.data.wxSearchData)
  },
  //监听键盘确认建
  wxSearchConfirm: function (e) {

  },
  /**
   * 页面的初始数据
   */
  data: {
    lists: [],              // 接收搜索的内容
    wxSearchData: '',       // 输入的值
  },

  result: function () {
    getApp().globalData.wxSearchData=this.data.wxSearchData;
    wx.navigateTo({
      url: '/pages/index/searchresult/searchresult',
    })
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

})
