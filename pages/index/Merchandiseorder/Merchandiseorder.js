// pages/index/Merchandiseorder/Merchandiseorder.js
var tool = require('../../../utils/request.js');
let ajax = require('../../../utils/requestNew')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coupon:[],
      current:1,
      idx:undefined
  },
    tabItemClick(e) {
    let type = e.currentTarget.dataset.type;
        if  (type == 1){
            this.setData({
                current: 1
            })
        }else if (type == 2){
            this.setData({
                current: 2
            })
        }
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
    getOrderCouponList(this)
      let url = app.globalData.url + '/rzapi/group/getMyJoinGroup';
      let data = {
          openId: wx.getStorageSync('openid'),
          userId: wx.getStorageSync('userid')
      }
      ajax.postAjax(url, data).then(res =>{
          if (res.data.success == 1){
              let newUserList = res.data.result.map(item =>{
                  if (item.status == 0){
                      item.statusTxt = '等待商家确认';
                      return item
                  } else if (item.status == 1){
                      item.statusTxt = '已付定';
                      return item
                  } else {
                      item.statusTxt = '已完成';
                      return item
                  }
              })
              this.setData({
                  groupList:newUserList
              })
          }
      })

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
    jumporderlist1(e){
      let idx = e.currentTarget.dataset.idx;
      console.log(idx)
      this.setData({
          idx
      })
    },
  //跳店铺抵用券列表
  jumporderlist:function(e){

    wx.navigateTo({
      url: '/pages/index/Merchandiseorder/storecodelist?shopid=' + e.currentTarget.dataset.shopid,
    })
  },
})
function getOrderCouponList(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/account/getOrderList',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取用户购买的订单(已店铺为单位)', res.data)
    if (res.data.result) {
      that.setData({
        coupon: res.data.result
      })
    }
  })
}
