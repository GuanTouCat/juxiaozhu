// pages/index/find/find.js
var ajax = require('../../../utils/requestNew.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
    data: {
      tabLists:['店铺','卖场'],
      isShowShop:true,
      key:3,
      searchName:undefined,
      shopList:[],
      mallList:[],
      current: 0,
      noHaveShop:false,
      noHaveMall:false
    },
    switchCell(e){
        let idx = e.currentTarget.dataset.idx;
        this.setData({
            current:idx
        })
        if (idx == 0){
            this.setData({
                isShowShop:true
            })
        }else {
            this.setData({
                isShowShop:false
            })
        }
    },
    getSearchShopResult (searchName) {//获取店铺名称搜索结果
        let data = {
            openId:wx.getStorageSync('openid'),
            districtId: wx.getStorageSync('areaid'),
            latitude: wx.getStorageSync("latitude"),
            longitude: wx.getStorageSync("longitude"),
            shopName:searchName
        }
        let url = getApp().globalData.url + '/rzapi/shop/getSearchResult';
        ajax.postAjax(url,data).then(res =>{
            if (res.data.result.length > 0) {
                for (let i = 0; i< res.data.result.length; i++){
                    let isNullAct = Object.keys(res.data.result[i].activity).length !== 0;
                    res.data.result[i].isNullAct = isNullAct;
                    let isNullGroup = Object.keys(res.data.result[i].group).length !== 0;
                    res.data.result[i].isNullGroup = isNullGroup
                }
                let shopList = res.data.result;
                this.setData({
                    shopList,
                    noHaveShop: false
                })
            } else {
                this.setData({
                    shopList: [],
                    noHaveShop: true
                })
                // wx.showToast({
                //     title: '无搜索结果',
                //     icon:'none',
                //     duration: 2000
                // })
            }

        })
    },

    getSearchMallResult(searchName) {//获取商场名称搜索结果
        let data = {
            openId:wx.getStorageSync('openid'),
            districtId: wx.getStorageSync('areaid'),
            latitute: wx.getStorageSync("latitude"),
            longitude: wx.getStorageSync("longitude"),
            marketName:searchName
        }
        let url = getApp().globalData.url + '/rzapi/market/marketSearchResult';
        ajax.postAjax(url,data).then(res =>{
            if (res.data.result.length > 0) {
                this.setData({
                    mallList: res.data.result,
                    noHaveMall:false
                })
            } else {
                this.setData({
                    mallList:[],
                    noHaveMall:true
                })
                // wx.showToast({
                //     title: '无搜索结果',
                //     icon:'none',
                //     duration: 2000
                // })
            }

        })
    },
    //监听键盘确认建
    confirmInput: function (e) {
        console.log(e)
        let searchName = e.detail.value
        this.setData({
            searchName
        })
        this.getSearchShopResult(searchName)
        this.getSearchMallResult(searchName)
    },
    toShop:function(e) {
        console.log(e)
        let shopId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/details/details?shopid=' + shopId
        })
    },
    toMall(e) {
        let name = e.currentTarget.dataset.mallname;
        let address = e.currentTarget.dataset.address;
        let marketId = e.currentTarget.dataset.marketid;
        let isHas = e.currentTarget.dataset.ishas;
        let shopAvator = e.currentTarget.dataset.img;
        wx.navigateTo({
            url: '/pages/mall/mallDetails/mallDetails?marketId=' + marketId + '&isHas=' + isHas + '&name=' + name
                + '&address=' + address + '&shopAvator=' + shopAvator
        })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        location:options.city
    })
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

})
