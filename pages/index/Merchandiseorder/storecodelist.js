// pages/index/Merchandiseorder/Merchandiseorder.js
var tool = require('../../../utils/request.js');
const app = getApp()
Page({
    tabItemClick: function (e) {
        console.log(e)
        this.setData({
            current: e.currentTarget.dataset.pos
        })
        if (this.data.tabList[this.data.current] == '待核销' ){
            this.setData({
                type: 0
            })
        } else if (this.data.tabList[this.data.current] == '已核销' ){
            this.setData({
                type: 1
            })
        }else{
            this.setData({
                type: ''
            })
        }

        //获取单个店铺下的抵用券
        getorderlist(this)
    },
    /**
     * 页面的初始数据
     */
    data: {
        tabList: ['全部', '待核销', '已核销'],
        current: 0,
        type:'',
        orderlist: [],
        shopid:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.shopid){
            this.setData({
                shopid:options.shopid
            })
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
        //获取单个店铺下的抵用券
        getorderlist(this)
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

    //我的二维码
    myQR: function () {
        console.log('wocanimaamaam')
        wx.navigateTo({
            url: '/pages/mine/myQR/myQR',
        })
    },
    //订单评论
    comments:function(e){
        wx.navigateTo({
            url: '/pages/index/Merchandiseorder/comments/comments?shopid=' + this.data.shopid + '&couponid=' + e.currentTarget.dataset.couponid,
        })
    },

    //追加评论
    addcomments:function(e){
        wx.navigateTo({
            url: '/pages/index/Merchandiseorder/addcomments/addcomments?shopid=' + this.data.shopid + '&couponid=' + e.currentTarget.dataset.couponid,
        })
    },
})
function getorderlist(that) {
    var aa = tool.request(
        getApp().globalData.url + '/rzapi/account/getOrderCouponList',
        'POST',
        {
            openId: wx.getStorageSync('openid'),
            userid: wx.getStorageSync('userid'),
            shopid: that.data.shopid,
            type:that.data.type,
        }
    )
    aa.then(res => {
        console.log('获取用户购买的单个店铺下的抵用券', res.data)
        if (res.data.result) {
            that.setData({
                orderlist: res.data.result
            })
        } else {
            wx.showModal({
                title: '提示',
                content: res.data.errmsg,
                showCancel: false
            })
        }
    })
}
