// pages/mine/XcxQrcode/XcxQrcode.js
var tool = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //个人二维码
    Qrcode:'',
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
    //获取个人二维码
    getQrcode(this)
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

function getQrcode(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/qrCode/getXcxQrcode',
    'POST',
    {
      userid:wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取个人分享码', res.data)
    if (res.data.result) {
      that.setData({
        Qrcode:res.data.result
      })
    }
  })
}