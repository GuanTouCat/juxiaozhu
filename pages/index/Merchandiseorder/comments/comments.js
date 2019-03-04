// pages/index/Merchandiseorder/comments/comments.js
var tool = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  //星级评价列表
  starlist:[
    '/images/comments/starnochoose.png',
    '/images/comments/starnochoose.png',
    '/images/comments/starnochoose.png',
    '/images/comments/starnochoose.png',
    '/images/comments/starnochoose.png',
  ],
  //用户评论
    usercomments:'',
  //星级评价
    starcomments:'',
    shopid:'',
    display: 'none',
    //判断弹框,0不显示，1显示
    showbounced: 0,
    couponid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.shopid && options.couponid){
      this.setData({
        shopid:options.shopid,
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

  starTap: function (e) {
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.starlist; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = '/images/comments/starchoose.png'
      } else { // 其他是空心
        tempUserStars[i] = '/images/comments/starnochoose.png'
      }
    }
    // 重新赋值就可以显示了
    this.setData({
      starlist: tempUserStars,
      starcomments:index + 1,
    })
  },
  //提交评价
  confirm:function(){
    funconfirm(this)
  },
  //输入评价内容
  opinions:function(e){
    this.setData({
      usercomments:e.detail.value
    })
  },
  //点击红包
  clickRedPacket:function(){
    funclickRedPacket(this)
  },
})


function funconfirm(that) {
  
  if (!that.data.starcomments) {
    wx.showModal({
      title: '提示',
      content: '请选择星级评价',
      showCancel: false
    })
    return;
  }

  if (!that.data.usercomments) {
    wx.showModal({
      title: '提示',
      content: '请输入评价',
      showCancel: false
    })
    return;
  }

  var aa = tool.request(
    getApp().globalData.url + '/rzapi/comment/publishComment',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      star:that.data.starcomments,
      content:that.data.usercomments,
      shopid:that.data.shopid,
      couponid: that.data.couponid,
    }
  )
  aa.then(res => {
    console.log('用户评论订单', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '评价成功',
        icon: 'success',
        duration: 1000
      })

      //设置定时器的原因是，返回上一页是异步执行
      setTimeout(function () {
       that.setData({
         showbounced:1,
         display:'block',
       })
      }, 1000)
    }
  })
}

function funclickRedPacket(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/comment/clickRedPacket',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      couponid: that.data.couponid,
    }
  )
  aa.then(res => {
    console.log('用户点击红包', res.data)
    if (res.data.success == 1) {
        that.setData({
          showbounced: 0,
          display: 'none',
        })
        
      wx.showModal({
        title: '提示',
        content: '恭喜您获得' + res.data.result.packetNum + '元红包，请到钱包余额查看',
        confirmText: '知道了',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击查看')
            wx.navigateBack();
            var pages = getCurrentPages()
            var backpage = pages[pages.length - 2]
            backpage.setData({
              backtag: 1,
            });

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
  })
}