// pages/index/userneed/needdetail/needdetail.js
var tool = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   //详情标题
   title:'',
   //详情内容
    content:'',
    //时间
    time:'',
    //详情截图
    pic:'',
    //电话号码
    phone:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  if (options.title && options.content && options.time && options.phone) {
      this.setData({
        title: options.title,
        content: options.content,
        time: options.time,
        pic: options.pic,
        phone: options.phone,
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

  

})


