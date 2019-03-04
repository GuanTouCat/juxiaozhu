// pages/mine/tequan/erjixiaoshoutequan/erjixiaoshouguanli/erjixiaoshouguanli.js
var tool = require('../../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //店长数据展示
    datalist: '',
    //销售管理店铺老板userID
    shopbossuserid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.shopbossuserid) {
      this.setData({
        shopbossuserid: options.shopbossuserid
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
    //获取店长数据展示
    getdatalist(this)
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

function getdatalist(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/viewShopSalePandect',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: that.data.shopbossuserid,
    }
  )
  aa.then(res => {
    console.log('获取店长数据展示', res.data)
    if (res.data.success == 1) {
      that.setData({
        datalist: res.data.result
      })
    }
  })
}