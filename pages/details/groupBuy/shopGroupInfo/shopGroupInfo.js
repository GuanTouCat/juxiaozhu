// pages/details/groupBuy/shopGroupInfo/shopGroupInfo.js
var ajax = require('../../../../utils/requestNew.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // userList:[],
      userList:[],
      isHaveUser:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)
        this.setData({
            shopId: options.shopId,
            startTime: options.start,
            endTime: options.end,
            content: options.content
        })
      if (options.groupId){
          this.setData({
              groupId:options.groupId
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
      let data1 = {
          openId: wx.getStorageSync('openid'),
          groupId: this.data.groupId,
          userid: wx.getStorageSync('userid'),
          roleId: wx.getStorageSync('roleid')
      }
      let url1 = app.globalData.url + '/rzapi/group/joinUserList';
      ajax.postAjax(url1, data1).then(res =>{
          if (res.data.result.length > 0) {
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
                  userList: newUserList
              })
          }else {
                this.setData({
                    isHaveUser:true
                })
          }
      })

      // let data = {
      //     openId: wx.getStorageSync('openid'),
      //     shopId: this.data.shopId
      // };
      // let url = app.globalData.url + '/rzapi/group/shopGroupList';
      // ajax.postAjax(url, data).then(res => {
      //     if (res.data.result.length > 0){
      //         // let allList = res.data.result.map(item =>{
      //         //     let startTime = item.startTime.replace(/-/g, ".")
      //         //     let endTime = item.endTime.replace(/-/g, ".")
      //         //     item.startTime = startTime;
      //         //     item.endTime = endTime
      //         //     return item
      //         // })
      //         // let currentList = allList.filter(item =>{
      //         //     if (item.del == 1) {
      //         //         return item
      //         //     }
      //         // })
      //         // this.setData({
      //         //     currentList
      //         // })
      //
      //
      //     }
      // })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
