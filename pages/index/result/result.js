// pages/index/result/result.js
var tool = require('../../../utils/request.js');
var start_clientX;
var end_clientX;
const app = getApp()
Page({
  tabItemClick: function (e) {
    console.log(e)
    this.setData({
      current: e.currentTarget.dataset.pos,
      pageIndex: 0,
      lists: [],
    })
    if (e.currentTarget.dataset.pos == 0){
      this.setData({
        sort:''
      })
    } else if (e.currentTarget.dataset.pos == 1){
      this.setData({
        sort: 'viewCount'
      })
    } else if (e.currentTarget.dataset.pos == 2) {
      this.setData({
        sort: 'favoCount'
      })
    } else if (e.currentTarget.dataset.pos == 3) {
      this.setData({
        sort: 'creditCount'
      })
    }

    getSonClassifyShop(this)

  },
  tabItemClick2: function (e) {
    console.log(e)
    this.setData({
      current2: e.currentTarget.dataset.poss,
      pageIndex: 0,
      lists: [],
    })
    getSonClassifyShop(this)
  },
  search: function () {
    wx.navigateTo({
      url: '../../index/find/find'
    })
  },
  details:function (e) {
    console.log('eee', e.currentTarget.dataset.id)
    var sid = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '../../details/details?shopid=' + e.currentTarget.dataset.id,
      })
    },
  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['综合', '浏览量','关注量','信用'],
    current: 0,
    tabList2: [],
    current2: 0,
    lists:[],
    a:'',
    windowWidth: wx.getSystemInfoSync().windowWidth,
    //好评率
    goodreputation: ['97%以上', '99%以上','100%',],
    //好评率下标
    reputationindex: 0,
    //店铺类型
    storetype: ['新品', '品牌'],
    //店铺类型下标
    storetypeindex: 0,
    //面积1
    firstarea: '',
    //面积2
    secondarea: '',
    //排序
    sort: '',
    //是否显示筛选蒙层
    Isshowscreen:0,
    pageIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getMainClassifyShop(this)
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
    // getMainClassifyShop(this)
    // getSonClassifyShop(this)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //下拉加载
  onPullDownRefresh: function () {
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    console.log('分页值', this.data.pageIndex)
    getSonClassifyShop(this)
  },

  //上拉加载
  onReachBottom: function () {
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    console.log('分页值', this.data.pageIndex)
    getSonClassifyShop(this)
  },

  // // 滑动开始
  // touchstart: function (e) {
  //   start_clientX = e.changedTouches[0].clientX
  // },
  // // 滑动结束
  // touchend: function (e) {
  //   end_clientX = e.changedTouches[0].clientX;
  //   if (end_clientX - start_clientX > 120) {
  //     this.setData({
  //       display: "block",
  //       translate: 'transform: translateX(' + this.data.windowWidth * 0.7 + 'px);'
  //     })
  //   } else if (start_clientX - end_clientX > 0) {
  //     this.setData({
  //       display: "none",
  //       translate: ''
  //     })
  //   }
  // },

  showview: function () {
    this.setData({
      display: "block",
      Isshowscreen:1,
      translate: 'transform: translateX(' + this.data.windowWidth * 0.8 + 'px);'
    })
  },

  hideview: function () {
    this.setData({
      display: "none",
      translate: '',
      Isshowscreen:0,
    })
  },

  //好评率
  reputationClick:function(e){
    this.setData({
      reputationindex: e.currentTarget.dataset.pos
    })
  },
  
  //店铺选择
  storetypeClick:function(e){
    this.setData({
      storetypeindex: e.currentTarget.dataset.pos
    })
  },
  //好评率
  reputationClick: function (e) {
    this.setData({
      reputationindex: e.currentTarget.dataset.pos
    })
  },

  //店铺选择
  storetypeClick: function (e) {
    this.setData({
      storetypeindex: e.currentTarget.dataset.pos
    })
  },

  //面积1
  firstarea: function (e) {
    this.setData({
      firstarea: e.detail.value
    })
  },

  //面积2
  secondarea: function (e) {
    this.setData({
      secondarea: e.detail.value
    })
  },

  //筛选重置
  reset: function () {
    this.setData({
      firstarea: '',
      secondarea: '',
      reputationindex: 0,
      storetypeindex: 0,
    })
  },

  //筛选确定
  confirm: function () {
    this.hideview()
    getSonClassifyShop(this)
  },
})






function getMainClassifyShop(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/shop/getMainClassifyShop',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      shopName: getApp().globalData.wxSearchData,
      rownum: that.data.pageIndex * 10,
      lowerLimit: that.data.firstarea,
      higherLimit: that.data.secondarea,
      shopType: that.data.storetypeindex + 1,
      favorate: that.data.goodreputation[that.data.reputationindex],
      order: that.data.sort,
      districtId: wx.getStorageSync('areaid'),
      classifyId: getApp().globalData.kindtype,
      latitude: wx.getStorageSync("latitude"),
      longitude: wx.getStorageSync("longitude"),
    }
  )
  aa.then(res => {
    console.log('首页点击大分类进入', res.data)
    if (res.data.result) {
      that.setData({
        tabList2: res.data.result.classifyList,
        lists: res.data.result.shopList,
      })
    }
  })
}



function getSonClassifyShop(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/shop/getSonClassifyShop',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      rownum: that.data.pageIndex * 10,
      lowerLimit: that.data.firstarea,
      higherLimit: that.data.secondarea,
      shopType: that.data.storetypeindex + 1,
      favorate: that.data.goodreputation[that.data.reputationindex],
      order: that.data.sort,
      districtId: wx.getStorageSync('areaid'),
      classifyId: that.data.tabList2[that.data.current2].id,
      pclassifyId:that.data.tabList2[that.data.current2].parentId,
      latitude: wx.getStorageSync("latitude"),
      longitude: wx.getStorageSync("longitude"),
    }
  )
  aa.then(res => {
    console.log('获取筛选内容', res.data)
    if (res.data.result) {
      // that.setData({
      //   lists: res.data.result,
      // })

      for (var i = 0; i < res.data.result.length; i++) {
        that.data.lists.push(res.data.result[i])
      }

      uniqueList(that.data.lists, that)
    }
  })
}



//数组去重
function uniqueList(array, that) {
  console.log('执行了去重操作')
  var r = [];
  for (var i = 0, l = array.length; i < l; i++) {
    for (var j = i + 1; j < l; j++)
      //关键在这里
      if (JSON.stringify(array[i].id) == JSON.stringify(array[j].id)) {
        j = ++i;
      }
    r.push(array[i]);
  }
  that.setData({
    lists: r
  })
  wx.stopPullDownRefresh()
}