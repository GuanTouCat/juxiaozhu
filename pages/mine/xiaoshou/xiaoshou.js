// pages/mine/xiaoshou/xiaoshou.js
var tool = require('../../../utils/request.js');
const app = getApp()
Page({
  shenhe: function (e) {
    wx.navigateTo({
      url: '../../mine/xsshenhe/xsshenhe',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    select: false,
    //城市列表
    city: [],
    //城市下标
    cityindex: '',
    name:'',
    cardno:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取城市列表
    getcitylist(this)
  },
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      city: name,
      select: false
    })
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
  nameinput:function(e){
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
  //城市选择
  citychange: function (e) {
    this.setData({
      cityindex: e.detail.value
    })
  },

  //确定
  confirm: function () {
    funconfirm(this)
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


function funconfirm(that) {

  // if (!that.data.cityindex) {
  //   wx.showModal({
  //     title: '提示',
  //     content: '请选择城市',
  //     showCancel: false
  //   })
  //   return;
  // }



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
    getApp().globalData.url + '/rzapi/privilege/applySale',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      realName: that.data.name,
      idCardNo:that.data.cardno,
      districtId: getApp().globalData.districtId,
    }
  )
  aa.then(res => {
    console.log('销售申请', res.data)
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
