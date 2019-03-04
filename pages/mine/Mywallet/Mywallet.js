// pages/mine/Mywallet/Mywallet.js
var tool = require('../../../utils/request.js');
const app = getApp()
Page({
  tabItemClick: function (e) {
    console.log(e)
    this.setData({
      current: e.currentTarget.dataset.pos
    })
  },
  tixian: function () {
    wx.navigateTo({
      url: '/pages/mine/Mywallet/Cashwithdrawal/Cashwithdrawal?balance='+this.data.mm,
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['收益明细', '提现记录'],
    current:0,
    shouyi:[],
    jilu:[],
    id:'',
    mm:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.a) {
      console.log('aaaaaaaa', options.a)
      this.setData({
        id: options.a
      })
    }
    if (options.c){
      console.log('cccccccc',options.c)
      this.setData({
        mm:options.c
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
    // 收益详情接口
    getIncomeList(this)
    // 提现记录接口
    getWithdrawList(this)

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
// 收益详情
  function getIncomeList(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/account/getIncomeList',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取收益详情', res.data)
    if (res.data.result) {
      that.setData({
        shouyi: res.data.result
      })
    }
  })
}
//提现记录
function getWithdrawList(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/account/getWithdrawList',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取提现记录', res.data)
    if (res.data.result) {
      that.setData({
       jilu: res.data.result
      })
    }
  })
}