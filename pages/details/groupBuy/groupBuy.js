// pages/details/groupBuy/groupBuy.js
var ajax = require('../../../utils/requestNew.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // html: '<div class="div_class" style="line-height: 60px; color: red;">Hello&nbsp;World!</div>',
        currentList: [],
        beforeList:[],
    },
    toJoin() {
        wx.navigateTo({
            url: '/pages/details/groupBuy/entryInfo/entryInfo?shopId=' + this.data.shopId
        })
    },
    checkGroupDetail (e) {//查看每个团购的详情
        console.log(e)
        let shopId = e.currentTarget.dataset.shopid;
        let entry = e.currentTarget.dataset.entry;
        let groupId =  e.currentTarget.dataset.groupid;
        let start = e.currentTarget.dataset.start;
        let end = e.currentTarget.dataset.end;
        let content = e.currentTarget.dataset.content;
            wx.navigateTo({
                url:"/pages/details/groupBuy/shopGroupInfo/shopGroupInfo?shopId=" + shopId + "&entry=" +
                    entry + '&groupId=' + groupId + '&start=' + start + '&end=' + end + '&content=' + content
            })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            shopId: options.shopId
        })
        wx.setNavigationBarTitle({
            title: options.title,
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
        let data = {
            openId: wx.getStorageSync('openid'),
            shopId: this.data.shopId
        };
        let url = app.globalData.url + '/rzapi/group/shopGroupList';
        ajax.postAjax(url, data).then(res => {
            if (res.data.result.length > 0){
                let allList = res.data.result.map(item =>{//将日期中的-改为.
                    let startTime = item.startTime.replace(/-/g, ".")
                    let endTime = item.endTime.replace(/-/g, ".")
                    item.startTime = startTime;
                    item.endTime = endTime
                    return item
                })
                let beforeList = allList.filter(item => {
                    if (item.del == 0) {
                        return item
                    }
                });
                let currentList = allList.filter(item =>{
                    if (item.del == 1) {
                        return item
                    }
                })
                this.setData({
                    beforeList,
                    currentList
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
