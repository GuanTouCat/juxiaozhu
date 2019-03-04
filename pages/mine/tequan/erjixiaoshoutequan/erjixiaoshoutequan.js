// pages/mine/tequan/erjixiaoshoutequan/erjixiaoshoutequan.js
var tool = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display: 'none',
    //判断二级销售店铺申请码弹框,0不显示，1显示
    showbounced: 0,
    //二级销售店铺申请码
    secondSaleApplyCode: '',
    //二级销售查看店铺列表
    secondSalestorelist: [],
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
    //获取二级销售店铺申请码
    getsecondSaleApplyCode(this)
    //获取二级销售店铺列表
    getsecondSalestorelist(this)
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

  //一级销售查看二级销售申请码
  showApplyCode: function () {
    this.setData({
      display: 'display',
      showbounced: 1,
    })
  },
  //取消蒙层
  hidebounced: function () {
    this.setData({
      display: 'none',
      showbounced: 0,
    })
  },
  //销售管理店铺
  xiaoshouguanli: function (e) {
    //获取管理店铺老板的userID
    getshopbossuserid(this, e.currentTarget.dataset.shopid)
  },
})

function getsecondSaleApplyCode(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/secondarySaleCode',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取二级销售店铺申请码', res.data)
    if (res.data.success == 1) {
      that.setData({
        secondSaleApplyCode: res.data.result
      })
    }
  })
}


function getsecondSalestorelist(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/secondSaleShopList',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取二级销售店铺列表', res.data)
    if (res.data.success == 1) {
      that.setData({
        secondSalestorelist: res.data.result
      })
    }
  })
}


function getshopbossuserid(that, shopid) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/shop/getUploadId',
    'POST',
    {
      shopId: shopid,
    }
  )
  aa.then(res => {
    console.log('获取销售管理店铺老板的userID', res.data)
    if (res.data.success == 1) {
      wx.navigateTo({
        url: '/pages/mine/tequan/erjixiaoshoutequan/erjixiaoshouguanli/erjixiaoshouguanli?shopbossuserid=' + res.data.result,
      })
    }
  })
}
