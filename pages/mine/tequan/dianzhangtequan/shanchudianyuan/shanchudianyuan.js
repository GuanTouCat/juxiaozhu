// pages/mine/tequan/dianzhangtequan/shanchudianyuan/shanchudianyuan.js
var util = require('../../../../../utils/util.js');
var tool = require('../../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //移交店长店员列表
    turnoverlist: [],
    //员工是否选中,0未选中,1选中
    selected: 0,
    //已选择的员工userid
    chooseuserid: '',
    id:'',
    userid:'',
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
    //获取移交店长店员列表
    getturnoverlist(this)
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
  //选择员工
  choose: function (e) {
    this.setData({
      selected: 1,
      chooseuserid: e.currentTarget.dataset.userid,
      id: e.currentTarget.dataset.id,
      userid: e.currentTarget.dataset.userid
    })
  },
  //确认删除
  comfirmturnover: function (e) {
    funturnover(this)
  },

})


function getturnoverlist(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/getSelectEmpList',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取移交店长店员', res.data)
    if (res.data.success == 1) {
      that.setData({
        turnoverlist: res.data.result
      })
    }
  })
}

function funturnover(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/removeShopEmp',
    'POST',
    {
     id:that.data.id,
     userid:that.data.userid,
    }
  )
  aa.then(res => {
    console.log('删除店员', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1500
      })

      getturnoverlist(that)

    }
  })
}