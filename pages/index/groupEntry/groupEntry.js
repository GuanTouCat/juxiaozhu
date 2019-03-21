// pages/index/groupEntry/groupEntry.js
var ajax = require('../../../utils/requestNew.js');
const app = getApp()
Page({
    /**
    * 页面的初始数据
    */
    data: {
        lunbo:[{picUrl:'https://ws4.sinaimg.cn/large/006tKfTcgy1g1989vyoxmj30jn08q0wn.jpg'}],
        indicatorDots: true, //是否显示面板指示点
        autoplay: true, //是否自动切换
        interval: 3000, //自动切换时间间隔
        duration: 1000, //滑动动画时长
    },
    kindlist:function(e){
        getApp().globalData.kindtype = e.currentTarget.dataset.kindtype;
        wx.navigateTo({
            url: '/pages/index/result/result?entryType=3'
        })
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
        // let data = {};
        // let url = getApp().globalData.url + '/rzapi/slide/getSlideList';
        // ajax.getAjax(url, data).then(res =>{
        //     if (res.data.result) {
        //         this.setData({
        //             lunbo: res.data.result
        //         })
        //     }
        // })
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
