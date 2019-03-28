// pages/index/Merchandiseorder/mallOrderDetail/mallOrderDetail.js
let ajax = require('../../../../utils/requestNew')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
    data: {
        tabList: ['全部', '待核销', '已核销'],
        current: 0,
        marketOrderList:[]
    },
    tabItemClick: function (e) {
        let idx = e.currentTarget.dataset.idx;
        this.setData({
            current: idx
        });
        this.getCellOrderList(idx)
    },

    getCellOrderList(status){
        let url = app.globalData.url + '/rzapi/market/getMarketOrderDetail';
        let data = {
            openId: wx.getStorageSync('openid'),
            userId: wx.getStorageSync('userid'),
            marketId: this.data.marketId,
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                let allOrderList = res.data.result;
                let waitOrderList = allOrderList.filter(item =>{
                    if (item.status == 0){
                        return item
                    }
                });
                let alreadyOrderList = allOrderList.filter(item =>{
                    if (item.status == 1){
                        return item
                    }
                });
                if (status == 0){//全部订单
                    this.setData({
                        marketOrderList: allOrderList
                    })
                } else if (status == 1) {//待核销订单
                    this.setData({
                        marketOrderList: waitOrderList
                    })
                }else {//已核销订单
                    this.setData({
                        marketOrderList: alreadyOrderList
                    })
                }

            }
        })
    },
      /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            marketId: options.marketId
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
        this.getCellOrderList(this.data.current)//获得初始全部订单
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
