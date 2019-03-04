// pages/index/Merchandiseorder/addcomments/addcomments.js
var tool = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopid: '',
    couponid: '',
    //用户评论
    usercomments: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.shopid && options.couponid) {
      this.setData({
        shopid: options.shopid,
        couponid: options.couponid,
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
  //输入评价内容
  opinions: function (e) {
    this.setData({
      usercomments: e.detail.value
    })
  },
  //提交评价
  confirm: function () {
    funconfirm(this)
  },
})


function funconfirm(that) {
  if (!that.data.usercomments) {
    wx.showModal({
      title: '提示',
      content: '请输入评价',
      showCancel: false
    })
    return;
  }

  var aa = tool.request(
    getApp().globalData.url + '/rzapi/comment/publishAddComment',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      content: that.data.usercomments,
      couponid: that.data.couponid,
    }
  )
  aa.then(res => {
    console.log('用户追加评价', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '追加评价成功',
        icon: 'success',
        duration: 1500
      })

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