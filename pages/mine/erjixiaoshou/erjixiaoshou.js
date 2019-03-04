// pages/mine/erjixiaoshou/erjixiaoshou.js
var tool = require('../../../utils/request.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    cardno: '',
    //一级销售的userID
    firstlySaleuserID:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.secondarySale != ''){
        this.setData({
          firstlySaleuserID: options.secondarySale
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

  //姓名输入
  nameinput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  //身份证号输入
  cardnoinput: function (e) {
    this.setData({
      cardno: e.detail.value
    })
  },


  //确定
  confirm: function () {
    funconfirm(this)
  },
})




function funconfirm(that) {

  if (!that.data.name) {
    wx.showModal({
      title: '提示',
      content: '请输入姓名',
      showCancel: false
    })
    return;
  }


  if (!that.data.cardno) {
    wx.showModal({
      title: '提示',
      content: '请输入身份证号',
      showCancel: false
    })
    return;
  }

  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/toBeSecondSale',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      realName: that.data.name,
      idCardNo: that.data.cardno,
      districtId: wx.getStorageSync('areaid'),
      parentid:that.data.firstlySaleuserID,
    }
  )
  aa.then(res => {
    console.log('二级销售申请', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '申请成功',
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
    }
  })
}
