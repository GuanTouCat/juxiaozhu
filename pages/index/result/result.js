// pages/index/result/result.js
var tool = require('../../../utils/request.js');
let ajax = require('../../../utils/requestNew.js')
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
      if (this.data.entryType == 3){
          this.sonShopGroup()
      } else {
          getSonClassifyShop(this, this.data.pageIndex)
      }

  },
  tabItemClick2: function (e) {
      let id = e.currentTarget.dataset.id
      this.setData({
          current2: e.currentTarget.dataset.poss,
          classifyId:id,
          pageIndex: 0,
          lists: [],
      })
      if (this.data.entryType == 3){
          this.sonShopGroup(id)
      } else {
          getSonClassifyShop(this, this.data.pageIndex)
      }
  },
  search: function () {
    wx.navigateTo({
      url: '../../index/find/find?city=' + this.data.location
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
        classifyId:'',
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
        isEnded:false,
        entryType:undefined
  },
    getGroupShop() {
      let url = app.globalData.url + '/rzapi/group/shopGroup';
      let data = {
          openId: wx.getStorageSync('openid'),
          districtId: wx.getStorageSync('areaid'),
          pclassifyId: app.globalData.kindtype,
          rownum:0
      }
      ajax.postAjax(url, data).then(res =>{
          if (res.data.result) {
              this.setData({
                  tabList2: res.data.result.classifyList,
              })
          }
          if (res.data.result.shopList.length > 0){
              this.setData({
                  lists: res.data.result.shopList,
              })
          }else {
              this.setData({
                  isEnded:true
              })
          }
      })

    },

    sonShopGroup(id) {
        let url = app.globalData.url + '/rzapi/group/sonShopGroup';
        let data = {
            openId: wx.getStorageSync('openid'),
            districtId: wx.getStorageSync('areaid'),
            pclassifyId: app.globalData.kindtype,
            classifyId:id || this.data.classifyId,
            rownum: this.data.pageIndex * 10,
            order: this.data.sort
        }
        ajax.postAjax(url, data).then(res =>{
            console.log(res)
            let data = res.data.result
            if (data.length > 0) {
                this.setData({
                    lists: data
                })
            }
        })

    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // getMainClassifyShop(this);
      console.log(options.entryType)
      if (options.entryType){
          this.setData({
              entryType:options.entryType
          })
      }
      if (options.location){
          this.setData({
              location : options.location
          })
      }
      if (this.data.entryType == 3){
          console.log(333333333)
          this.getGroupShop()
      } else {
          getMainClassifyShop(this, this.data.pageIndex)
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

  //下拉刷新
  onPullDownRefresh: function () {
      console.log('我下拉了')
      console.log(this.data.pageIndex)
      wx.showNavigationBarLoading({
          success: e =>{
              // this.setData({
              //     pageIndex: 0
              // })
              // console.log(this.data.pageIndex)
              // if (this.data.entryType == 1) {
              //     getMainClassifyShop(this, this.data.pageIndex)
              // }else if (this.data.entryType == 3){
              //     this.sonShopGroup()
              // } else {
              //     getSonClassifyShop(this, this.data.pageIndex)
              // }
              wx.hideNavigationBarLoading();
              wx.stopPullDownRefresh();
          },
          fail:event=>{
              wx.showToast({
                  title: '网络不给力',
                  icon:"none"
              })
          }
  })
  },

  //上拉加载
  onReachBottom: function () {
      console.log('我上拉了')
      // if (this.data.isEnded) return;
    this.setData({
      pageIndex: ++this.data.pageIndex
    });


    console.log('分页值', this.data.pageIndex);
      if (this.data.entryType == 1){
          getMainClassifyShop(this, this.data.pageIndex)
      } else if (this.data.entryType == 3){
          this.sonShopGroup()
      } else {
          getSonClassifyShop(this, this.data.pageIndex)
      }
  },

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
      var aa = tool.request(
          getApp().globalData.url + '/rzapi/shop/getSonClassifyShop',
          'POST',
          {
              openId: wx.getStorageSync('openid'),
              rownum: 0,
              lowerLimit: this.data.firstarea,
              higherLimit: this.data.secondarea,
              shopType: this.data.storetypeindex + 1,
              favorate: this.data.goodreputation[this.data.reputationindex],
              order: this.data.sort,
              districtId: wx.getStorageSync('areaid'),
              classifyId: this.data.tabList2[this.data.current2].id,
              pclassifyId:this.data.tabList2[this.data.current2].parentId,
              latitude: wx.getStorageSync("latitude"),
              longitude: wx.getStorageSync("longitude"),
          }
      )
      aa.then(res => {
          console.log('获取筛选内容', res.data)
          // if (res.data.result.length > 0) {
              this.setData({
                  lists:res.data.result,
                  entryType:0
              })

              // for (var i = 0; i < res.data.result.length; i++) {
              //   that.data.lists.push(res.data.result[i])
              // }

              // uniqueList(that.data.lists, that)
          // }
      })
  },
})

function getMainClassifyShop(that, pageIndex) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/shop/getMainClassifyShop',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      shopName: getApp().globalData.wxSearchData,
      rownum: pageIndex * 10,
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
    console.log('首页点击大分类进入', res.data);
    if (res.data.result) {
      that.setData({
        tabList2: res.data.result.classifyList,
      })
    }
    if (res.data.result.shopList.length > 0){
        that.setData({
            lists: that.data.lists.concat(res.data.result.shopList),
        })
    }else {
        that.setData({
            isEnded:true
        })
    }
  })
}



function getSonClassifyShop(that, pageIndex){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/shop/getSonClassifyShop',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      rownum: pageIndex * 10,
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
    if (res.data.result.length > 0) {
      that.setData({
        lists:that.data.lists.concat(res.data.result),
        entryType:0
      })

      // for (var i = 0; i < res.data.result.length; i++) {
      //   that.data.lists.push(res.data.result[i])
      // }

      // uniqueList(that.data.lists, that)
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
