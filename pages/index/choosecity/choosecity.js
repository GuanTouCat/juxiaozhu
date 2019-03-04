// pages/index/choosecity/choosecity.js
var tool = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //城市列表
    city: [],
    cityid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取城市列表
    getcitylist(this)
    if (wx.getStorageSync('areaid')){
      this.setData({
        cityid: wx.getStorageSync('areaid')
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
  //改变城市
  changecity:function(e){
   this.setData({
     cityid: e.currentTarget.dataset.cityid
   })
    //将用户地区ID存入缓存
    wx.setStorageSync('areaid', e.currentTarget.dataset.cityid)
    getApp().globalData.location = e.currentTarget.dataset.cityname

    wx.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 1500
    })

    //设置定时器的原因是，返回上一页是异步执行
    setTimeout(function () {
      wx.navigateBack();
      var pages = getCurrentPages()
      var backpage = pages[pages.length - 2]
      backpage.setData({
        backtag: 1,
      });
    }, 1500)

  },

})


function getcitylist(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/classify/getAllDistrict',
    'POST',
    {

    }
  )
  aa.then(res => {
    console.log('获取所有的地区', res.data)
    if (res.data.result) {
      that.setData({
        city: res.data.result
      })
    }
  })
}
