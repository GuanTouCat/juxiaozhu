// pages/index/userneed/needdetail/needdetail.js
var tool = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    touserid:'',
    needid:'',
    //需求详情
    needdetail:'',
    //用户账户余额
    userbalance:'',
    //购买电话需要支付的金额
    needpay:'',
    //用户权限
    roleid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.needid && options.touserid){
       this.setData({
         needid:options.needid,
         touserid:options.touserid
       })
    }

    if (wx.getStorageSync('roleid')){
      this.setData({
        roleid:wx.getStorageSync('roleid')
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
    //获取需求详情
    getneeddetail(this)
    //获取账户余额
    getuserbalance(this)
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

  //获取联系方式
  getphone:function(){
    var that = this

    if (that.data.needdetail.checkCount > 0){
      if (wx.getStorageSync('roleid') == 1 || wx.getStorageSync('roleid') == 3) {
        wx.showModal({
          title: '提示',
          content: '查看联系方式需要支付' + that.data.needpay + '元',
          confirmText: '余额抵消',
          cancelText: '取消',

          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确认支付')
              if (that.data.userbalance - that.data.needpay >= 0) {
                //用余额支付
                payByBalance(that)
              } else {
                //余额不足
                payByMoney(that)
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '暂无权限',
          showCancel: false
        })
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '剩余获取次数为0,不能获取联系方式',
        showCancel: false
      })
    }

  }, 

})

function getneeddetail(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/userRequest/getRequestDetails',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      id:that.data.needid,
      touserid:that.data.touserid,
      roleId: wx.getStorageSync('roleid'),
    }
  )
  aa.then(res => {
    console.log('获取需求详情', res.data)
    if (res.data.result) {
      that.setData({
        needdetail: res.data.result
      })
    }
  })
}

function getuserbalance(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/userRequest/getUserBalance',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取用户余额', res.data)
    if (res.data.result) {
      that.setData({
        userbalance: res.data.result.balance,
        needpay:res.data.result.cost
      })
    }
  })
}


function payByBalance(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/userRequest/payByBalance',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      id: that.data.needid,
      touserid: that.data.touserid,
      cost:that.data.needpay,
      roleId: wx.getStorageSync('roleid'),
    }
  )
  aa.then(res => {
    console.log('余额支付', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 1500
      })
      //刷新数据
      //获取需求详情
      getneeddetail(that)
    }
  })
}


function payByMoney(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/userRequest/payForPhone',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      id: that.data.needid,
      touserid: that.data.touserid,
      cost: that.data.needpay,
      roleId: wx.getStorageSync('roleid'),
      balance: that.data.userbalance
    }
  )
  aa.then(res => {
    console.log('微信支付', res.data)
    if (res.data.success == 1) {
      wx.requestPayment({
        'timeStamp': res.data.result.timestamp,
        'nonceStr': res.data.result.noncestr,
        'package': "prepay_id=" + res.data.result.prepayid,
        'signType': 'MD5',
        'paySign': res.data.result.sign,
        'success': function (res) {
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 1500,
          })
        },
        'fail': function (res) {
          console.log('支付失败', res)
          wx.showToast({
            title: '支付失败',
            icon: 'loading',
            duration: 1500
          });
        }
      })
      //刷新数据
      //获取需求详情
      getneeddetail(that)
    }
  })
}