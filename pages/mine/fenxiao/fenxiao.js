// pages/mine/fenxiao/fenxiao.js
var tool = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ["用户头像", "用户昵称", "消费金额"],
    current: 0,//当前选中的Tab项
    //分销中心用户列表
    fenxiaolist: [],
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
     //获取分销列表
    getfenxiaolist(this)
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

function getfenxiaolist(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/user/getMySubordinate',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取分销列表', res.data)
    if (res.data.success == 1) {
      that.setData({
        fenxiaolist: res.data.result
      })
    }
  })
}