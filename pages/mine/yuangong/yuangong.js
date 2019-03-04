// pages/mine/yuangong/yuangong.js
var tool = require('../../../utils/request.js');
const app = getApp()
Page({
  shenhe: function (e) {
    wx.navigateTo({
      url: '../../mine/ygshenhe/ygshenhe',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
     name:'',
     cardno:'',
     shopname:'',
     //搜索店铺列表
     searchresults:[],
     //店铺是否选中,0未选中,1选中
     selected:0,
     //已选择的商铺ID
     chooseshopid:'',
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

  //输入姓名
  nameinput:function(e){
     this.setData({
       name:e.detail.value
     })
  },

  //输入姓身份证号
  cardnoinput: function (e) {
    this.setData({
     cardno: e.detail.value
    })
  },

  //输入店铺名称
  shopnameinput:function(e){
    this.setData({
      shopname: e.detail.value
    })
  },

  //搜索店铺
  search:function(){
    if (!this.data.shopname) {
      wx.showModal({
        title: '提示',
        content: '请输入店铺名称',
        showCancel: false
      })
      return;
    }

    getsearchresults(this)
  },

  //选择店铺
  choose:function(e){
    this.setData({
      selected:1,
      chooseshopid: e.currentTarget.dataset.shopid
    })
  },
  //确定
  confirm: function () {
    funconfirm(this)
  },
})



function getsearchresults(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/shop/searchShopBrief',
    'POST',
    {
      openId:wx.getStorageSync('openid'),
      shopName:that.data.shopname,
    }
  )
  aa.then(res => {
    console.log('申请员工搜索店铺', res.data)
    if (res.data.result.length > 0) {
      that.setData({
        searchresults: res.data.result
      })
    }else{
        wx.showModal({
          title: '提示',
          content: '未搜索到名为' + that.data.shopname +'的店铺',
          showCancel: false
        })
    }
  })
}


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



  if (!that.data.chooseshopid) {
    wx.showModal({
      title: '提示',
      content: '请选择商铺',
      showCancel: false
    })
    return;
  }

  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/applyEmployee',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      realName: that.data.name,
      idCardNo: that.data.cardno,
      shopid: that.data.chooseshopid,
    }
  )
  aa.then(res => {
    console.log('员工申请特权', res.data)
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
