// pages/index/find/find.js
var ajax = require('../../../utils/requestNew.js');
const app = getApp()
Page({
  // wxSearchInput: function (e) {
  //   var that = this;
  //   console.log('aaaaa', e.detail.value)
  //   if (e.detail.value.length > 0) {
  //     that.setData({
  //       wxSearchData: e.detail.value,
  //     })
  //   }
  //   console.log('bbbbb',that.data.wxSearchData)
  // },
  /**
   * 页面的初始数据
   */
    data: {
      lists: [],              // 接收搜索的内容
      wxSearchData: '', // 输入的值
      isShow:true,
      isShowShop:true,
      key:3,
      shopName:undefined,
      shopList:[],
      // mallList:[
      //     {
      //         url:'https://ws4.sinaimg.cn/large/006tKfTcgy1g0ucc4omirj30jm08qqcy.jpg',
      //         name:'北派卖场',
      //         key:3,
      //         address:'江苏省苏州市吴中区'
      //     },
      //     {
      //         url:'https://ws4.sinaimg.cn/large/006tKfTcgy1g0ucc4omirj30jm08qqcy.jpg',
      //         name:'北派卖场',
      //         key:4,
      //         address:'江苏省苏州市吴中区'
      //     }
      // ]
    },
    switchCell(e){
        let type = e.currentTarget.dataset.type;
        console.log(type)
        if (type == 1){
            this.setData({
                isShow:true,
                isShowShop:true
            })
        }else {
            this.setData({
                isShow:false,
                isShowShop:false
            })
        }
    },
    //监听键盘确认建
    confirmInput: function (e) {
        console.log(e)
        let shopName = e.detail.value
        let data = {
            openId:wx.getStorageSync('openid'),
            districtId: wx.getStorageSync('areaid'),
            latitude: wx.getStorageSync("latitude"),
            longitude: wx.getStorageSync("longitude"),
            shopName
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
                    shopList
                })
            } else {
                this.setData({
                    shopList:[]
                })
                wx.showToast({
                    title: '无搜索结果',
                    icon:'none',
                    duration: 2000
                })
            }

        })
    },
    toShop:function(e) {
        console.log(e)
        let shopId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/details/details?shopid=' + shopId
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
