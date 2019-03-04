// pages/mine/tequan/dianyuantequan/verificationlist/verificationlist.js
var util = require('../../../../../utils/util.js');
var tool = require('../../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //待核销抵用券
    verificationlist:[],
    code:'',
    //员抵用券是否选中,0未选中,1选中
    selected: 0,
    //已选择的抵用券ID
    choosegoodsid: '',
    //抵用券类型
    type:'',
    //审核回调是否成功,0未成功,1成功
    Issuccess: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.buyuserid){
        this.setData({
          code: options.buyuserid
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
      //获取待核销列表
    checkcode(this)
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

  //选择抵用券
  choose: function (e) {
    this.setData({
      selected: 1,
      choosegoodsid: e.currentTarget.dataset.id,
      type:e.currentTarget.dataset.type
    })
  },
  //确认核销
  verification:function(){
    funverification(this)
  },

})

function checkcode(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/coupon/toWriteOffCoupon',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      buyuserid: that.data.code,
    }
  )
  aa.then(res => {
    console.log('待核销优惠券列表', res.data)
    if (res.data.success == 1) {
       that.setData({
         verificationlist:res.data.result
       })
    }
  })
}


function funverification(that) {

  //点击核销之后，做个限制，防止多次点击，造成申核销多次
  that.setData({
    Issuccess: 1
  })
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/coupon/writeOffCoupon',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      id: that.data.choosegoodsid,
      type:that.data.type,
    }
  )
  aa.then(res => {
    console.log('核销抵用券', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '核销成功',
        icon: 'success',
        duration: 1000
      })

      checkcode(that)
    }else{
      wx.showModal({
        title: '提示',
        content: res.data.errmsg,
        showCancel: false
      })
      that.setData({
        Issuccess: 0
      })
    }
  })
}