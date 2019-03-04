// pages/mine/tequan/xiaoshoutequan/xiaoshoutequan.js
var tool = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ["店铺管理", "店铺审核","二级销售管理"],
    current: 0,//当前选中的Tab项
    //销售审核列表
    salesauditlist:[],
    //销售查看店铺列表
    salesstorelist:[],
    //二级销售管理列表
    secondSalelist: [],
    //一级销售查看二级销售申请码
    secondSaleApplyCode:'',
    display: 'none',
    //判断二级销售申请码弹框,0不显示，1显示
    showbounced: 0,
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
    //获取销售查看店铺列表
    getsalesstorelist(this)
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
     * Tab的点击切换事件
     */
  tabItemClick: function (e) {
    this.setData({
      current: e.currentTarget.dataset.pos,
    })
    if (e.currentTarget.dataset.pos == 0){
      //获取销售查看店铺列表
      getsalesstorelist(this)
    } else if (e.currentTarget.dataset.pos == 1){
      //获取销售待审核店铺列表
      getsalesauditlist(this)
    } else if (e.currentTarget.dataset.pos == 2) {
      //获取一级销售查看二级销售申请码
      getsecondSaleApplyCode(this)
      //获取二级销售列表
      getsecondSalelist(this)
    }
  },
  //销售审核店铺
  storeaudit:function(e){
   var id = e.currentTarget.dataset.id
   var status = e.currentTarget.dataset.status
    funstoreaudit(this,id,status)
  },

  //销售管理店铺
  xiaoshouguanli:function(e){
    //获取管理店铺老板的userID
    getshopbossuserid(this,e.currentTarget.dataset.shopid)
  },

  //一级销售查看二级销售申请码
  showApplyCode:function(){
    this.setData({
      display: 'display',
      showbounced: 1,
    })
  },
  //取消蒙层
  hidebounced:function(){
    this.setData({
      display: 'none',
      showbounced: 0,
    })
  },
  //删除二级销售
  deletesecondSale:function(e){
    var that = this
    var secondSaleid = e.currentTarget.dataset.id
    var secondSaleuserid = e.currentTarget.dataset.userid
    wx.showModal({
      title: '提示',
      content: '您确定要删除该二级销售吗',
      confirmText: '删除',
      cancelText: '取消',

      success: function (res) {
        if (res.confirm) {
          console.log('用户点击删除')
          fundeletesecondSale(that, secondSaleid, secondSaleuserid)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})

function getsalesstorelist(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/viewShopRecord',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取销售店铺列表', res.data)
    if (res.data.success == 1) {
      that.setData({
        salesstorelist: res.data.result
      })
    }
  })
}


function getsalesauditlist(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/viewToCheckShop',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      districtId: wx.getStorageSync('areaid'),
    }
  )
  aa.then(res => {
    console.log('获取销售待审核店铺列表', res.data)
    if (res.data.success == 1) {
      that.setData({
        salesauditlist: res.data.result
      })
    }
  })
}


function funstoreaudit(that,id,status) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/shopAuditYes',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      id:id,
      status:status,
    }
  )
  aa.then(res => {
    console.log('销售审核店铺', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 1500
      })
      //获取销售待审核店铺列表
      getsalesauditlist(that)
    }
  })
}



function getshopbossuserid(that,shopid) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/shop/getUploadId',
    'POST',
    {
      shopId:shopid,
    }
  )
  aa.then(res => {
    console.log('获取销售管理店铺老板的userID', res.data)
    if (res.data.success == 1) {
      wx.navigateTo({
        url: '/pages/mine/tequan/xiaoshoutequan/xiaoshouguanli/xiaoshouguanli?shopbossuserid='+res.data.result,
      })
    }
  })
}

function getsecondSaleApplyCode(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/secondSaleApply',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('一级销售查看二级销售申请码', res.data)
    if (res.data.success == 1) {
       that.setData({
         secondSaleApplyCode:res.data.result
       })
    }
  })
}

function getsecondSalelist(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/secondarySaleList',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取二级销售列表', res.data)
    if (res.data.success == 1) {
      that.setData({
        secondSalelist: res.data.result
      })
    }
  })
}


function fundeletesecondSale(that, secondSaleid, secondSaleuserid){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/removeSecondarySale',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: secondSaleuserid,
      id: secondSaleid,
    }
  )
  aa.then(res => {
    console.log('删除二级销售', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1500
      })
      //获取二级销售列表
      getsecondSalelist(that)
    }else{
      wx.showToast({
        title: '删除失败',
        icon: 'loading',
        duration: 1500
      })
    }
  })
}