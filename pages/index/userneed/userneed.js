// pages/index/userneed/userneed.js
var util = require('../../../utils/util.js');
var tool = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ["综合", "成品家具", "全屋定制", "窗帘墙纸", "灯具软饰"],
    current: 0,//当前选中的Tab项
    //需求展示列表
    needlist: [],
    //分类
    classifyId:'',
    pageIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //获取需求列表
      getneedlist(this)
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

  //下拉加载
  onPullDownRefresh: function () {
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    console.log('分页值', this.data.pageIndex)
    getneedlist(this)
  },

  //上拉加载
  onReachBottom: function () {
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    console.log('分页值', this.data.pageIndex)
    getneedlist(this)
  },

  /**
     * Tab的点击切换事件
     */
  tabItemClick: function (e) {
    this.setData({
      current: e.currentTarget.dataset.pos,
      needlist: [],
      pageIndex: 0,
    })
    if (e.currentTarget.dataset.pos == 0){
     this.setData({
       classifyId:'',
     })
    } else if (e.currentTarget.dataset.pos == 1) {
      this.setData({
        classifyId: '1',
      })
    } else if (e.currentTarget.dataset.pos == 2) {
      this.setData({
        classifyId: '2',
      })
    } else if (e.currentTarget.dataset.pos == 3) {
      this.setData({
        classifyId: '3',
      })
    } else if (e.currentTarget.dataset.pos == 4) {
      this.setData({
        classifyId: '4',
      })
    }
    //获取需求列表
    getneedlist(this)
  },
  //我要发布
  confirm:function(){
    wx.navigateTo({
      url: '/pages/mine/fabu/fabu',
    })
  },
  //需求详情
  needdetail:function(e){
    var needid = e.currentTarget.dataset.needid
    var userid =  e.currentTarget.dataset.userid
      wx.navigateTo({
        url: '/pages/index/userneed/needdetail/needdetail?needid=' + needid + '&touserid=' + userid,
      })
  },
})

function getneedlist(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/userRequest/getRequestList',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      districtId:wx.getStorageSync('areaid'),
      rownum: that.data.pageIndex * 10,
      classifyId: that.data.classifyId,
    }
  )
  aa.then(res => {
    console.log('获取需求列表', res.data)
    if (res.data.result) {
      // that.setData({
      //   needlist: res.data.result
      // })
      for (var i = 0; i < res.data.result.length; i++) {
        that.data.needlist.push(res.data.result[i])
      }
      uniqueList(that.data.needlist, that)
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
    needlist: r
  })
  wx.stopPullDownRefresh()
}