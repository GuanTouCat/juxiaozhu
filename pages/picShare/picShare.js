// pages/picShare/picShare.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      current:0,
      tabLists:['全部','客厅','餐厅','沙发','餐桌','主卧'],
      photoArr:[
          {
              img:'https://ws2.sinaimg.cn/large/006tKfTcgy1g1ha4rlcdyj301o01o0t4.jpg',
              wxName:'测试1',
              wxIcon:'https://ws4.sinaimg.cn/large/006tKfTcgy1g1etwambj5j301m01lwea.jpg',
              name:'客厅'
          },
          {
              img:'https://ws4.sinaimg.cn/large/006tKfTcgy1g1ha4nw9vcj30ku11275v.jpg',
              wxName:'测试1',
              wxIcon:'https://ws4.sinaimg.cn/large/006tKfTcgy1g1etwambj5j301m01lwea.jpg',
              name:'客厅'
          },
          {
              img:'https://ws3.sinaimg.cn/large/006tKfTcgy1g1ha4lbifhj30hw0c2tag.jpg',
              wxName:'测试1',
              wxIcon:'https://ws4.sinaimg.cn/large/006tKfTcgy1g1etwambj5j301m01lwea.jpg',
              name:'客厅'
          },
      ]
  },
    tabClick(e) {
        let current = e.currentTarget.dataset.idx;
        this.setData({
            current
        })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
