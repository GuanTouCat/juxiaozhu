// pages/mall/mall.js
var ajax = require('../../utils/requestNew.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
    data: {
        marketList:[],
        lunbo:[{picUrl:'http://rzpro.oss-cn-hangzhou.aliyuncs.com/iconnew/ju1.jpg'}]
    },
    toMallDetail(e){
        let name = e.currentTarget.dataset.mallname;
        let address = e.currentTarget.dataset.address;
        let marketId = e.currentTarget.dataset.marketid;
        let isHas = e.currentTarget.dataset.ishas;
      wx.navigateTo({
          url: '/pages/mall/mallDetails/mallDetails?marketId=' + marketId + '&isHas=' + isHas + '&name=' + name + '&address=' + address
      })
    },
    toOpenMap() {
        console.log('2123323423')
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
        let url = app.globalData.url + '/rzapi/market/marketList';
        let data = {
            openId: wx.getStorageSync('openid'),
            districtId: wx.getStorageSync('areaid'),
            latitute: wx.getStorageSync('latitude'),
            longitude: wx.getStorageSync('longitude')
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1 ){
                this.setData({
                    marketList: res.data.result
                })
            }else {
                wx.showToast({
                  title: '网络请求异常',
                    icon: 'none'
                })
            }
        })
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
