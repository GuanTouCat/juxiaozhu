// pages/mine/mine.js
var tool = require('../../utils/request.js');
const app = getApp()
Page({
  mymoney:function(e){
    console.log('mm', e.currentTarget.dataset.mm)
    wx.navigateTo({
      url: "../mine/Mywallet/Mywallet?a=" + e.currentTarget.dataset.roleid + '&b=' + e.currentTarget.dataset.rolename + '&c=' + e.currentTarget.dataset.mm,
    })
  },
  integral:function(e){
    console.log('jf',e.currentTarget.dataset.point)
    wx.navigateTo({
      url: '../mine/Myintegral/Myintegral?a=' + e.currentTarget.dataset.point,
    })
  },
  tequan: function () {
   if(this.data.userrole == 0){
     wx.navigateTo({
       url: '../mine/tequan/tequan',
     })
   } else if (this.data.userrole == 1){
     wx.navigateTo({
       url: '/pages/mine/tequan/dianyuantequan/dianyuantequan',
     })
   } else if (this.data.userrole == 2) {
    wx.navigateTo({
      url: '/pages/mine/tequan/xiaoshoutequan/xiaoshoutequan',
    })
   } else if (this.data.userrole == 3) {
     wx.navigateTo({
       url: '/pages/mine/tequan/dianzhangtequan/dianzhangteqaun',
     })
   } else if (this.data.userrole == 4) {
     wx.navigateTo({
       url: '/pages/mine/tequan/erjixiaoshoutequan/erjixiaoshoutequan',
     })
   }



  },
  fenxiao: function () {
    wx.navigateTo({
      url: '/pages/mine/fenxiao/fenxiao',
    })
  },
  fabu: function (e) {
    wx.navigateTo({
      url: '/pages/mine/fabu/fabu',
    })
    // wx.showToast({
    //   title: '功能暂未开放',
    //   icon: 'loading',
    //   duration: 1000,
    //   mask: true
    // })
  },

  //我的分享码
  myQR:function(){

   wx.navigateTo({
     url: '/pages/mine/XcxQrcode/XcxQrcode',
   })

  },
  //我的收藏
  myFavo:function(){
     wx.navigateTo({
       url: '/pages/mine/myFavo/myFavo',
     })
  },

  //设置
  setting:function(){
    wx.navigateTo({
      url: '/pages/mine/setting/setting',
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    mine:[],
    //用户身份,0.普通用户,1.店员,2.销售,3.店铺老板)
    userrole:'',
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
    // 获取我的界面信息接口
    getMyPage(this)
    //获取用户身份
    getuserrole(this)
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
function getMyPage(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/user/getMyPage',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取我的界面', res.data)
    if (res.data.result) {
      that.setData({
        mine: res.data.result 
      })
    }
  })
}


function getuserrole(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/user/getMyPage',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取用户身份', res.data)
    if (res.data.result) {
      that.setData({
        userrole: res.data.result.roleId
      })
      //将用户角色存入缓存
      wx.setStorageSync('roleid', res.data.result.roleId)
    }
  })
}