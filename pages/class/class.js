// pages/class/class.js
let ajax = require('../../utils/requestNew')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      bigClassList:[],
      middleClassList:[],
      shopList:[],
      pclassId:1,
      classId:5,
      isShowShopList:false,
      current:0,
      midCurrent:0,
      pageSize:0
  },
    clickBigClass(e) {
        let current = e.currentTarget.dataset.current;
        let id = e.currentTarget.dataset.id;
        console.log(id)
        let middleClassList = this.data.bigClassList[id-1].subclass;
        this.setData({
            pageSize: 0,
            middleClassList,
            pclassId:id,
            current,
            midCurrent:0,
            classId:middleClassList[0].id
        })
        this.getShopList(middleClassList[0].id)
    },
    clickMidClass(e) {
      // this.setData({
      //     shopList:[]
      // })
        let current = e.currentTarget.dataset.current;
        let classId = e.currentTarget.dataset.classid;
        this.setData({
            pageSize: 0,
            midCurrent: current,
            classId
        })
        this.getShopList(classId)
    },
    toShop(e) {
      let shopId = e.currentTarget.dataset.shopid;
      wx.navigateTo({
          url:'/pages/details/details?shopid=' +shopId
      })
    },
    getShopList(classId) {
        let url = app.globalData.url + '/rzapi/shop/getSonClassifyShop';
        let data = {
            openId: wx.getStorageSync('openid'),
            districtId: wx.getStorageSync('areaid'),
            pclassifyId: this.data.pclassId,
            classifyId: classId,
            rownum: this.data.pageSize
        }
        ajax.postAjax(url, data).then(res =>{
            if (res.data.result.length > 0){
                this.setData({
                    shopList: res.data.result,
                    isShowShopList: true
                })
            } else {
                this.setData({
                    shopList: [],
                    isShowShopList: false
                })
            }

        })
    },

    scrolltolower(e) {
      console.log(e)
        this.setData({
            pageSize: ++this.data.pageSize
        })
        let url = app.globalData.url + '/rzapi/shop/getSonClassifyShop';
        let data = {
            openId: wx.getStorageSync('openid'),
            districtId: wx.getStorageSync('areaid'),
            pclassifyId: this.data.pclassId,
            classifyId: this.data.classId,
            rownum: this.data.pageSize *10
        }
        ajax.postAjax(url, data).then(res =>{
            if (res.data.result.length > 0){
                this.setData({
                    shopList: this.data.shopList.concat(res.data.result)
                })
            } else {
            }

        })

    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let url = app.globalData.url + '/rzapi/classify/getClassifyTree';
      let data = {}
      ajax.postAjax(url, data).then(res =>{
          if (res.data.success == 1){
              // let bigClassList = res.data.result.map(item =>{
              //    return item.classifyName
              // })
              // let middleClassList = res.data.result.map(item =>{
              //     return item.subclass.classifyName
              // })
              this.setData({
                  bigClassList:res.data.result,
                  middleClassList: res.data.result[0].subclass,
              })
              this.getShopList(this.data.classId)
          }
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
    console.log('我是上啦还是下')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      // console.log('我上啦了')
      // this.setData({
      //     pageSize: ++this.data.pageSize
      // })
      // this.getShopList(undefined,this.data.pageSize*10)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
