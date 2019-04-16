// pages/details/groupBuy/groupDetail/groupDetail.js
var ajax = require('../../../../utils/requestNew.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        beforeList:[],
        startTime:"点击选择开始时间",
        oldStart:undefined,
        endTime:"点击选择结束时间",
        oldEnd:undefined,
        content: '',
        currentList:[],
        // userRole:undefined,
        isRelease:false,
        isAutoHeight:false
    },
    bindStartDateChange(e) {//开始时间
        let startTime = e.detail.value.replace(/-/g, '.');
        this.setData({
            startTime,
            oldStart:e.detail.value//为了以'-'分割的时间传给后端
        })
    },
    bindEndDateChange(e) {//结束时间
        let endTime = e.detail.value.replace(/-/g, '.');
        this.setData({
            endTime,
            oldEnd:e.detail.value
        })
    },
    // bindConfirm(e) {//活动内容
    //     console.log(e)
    //     this.setData({
    //         content:e.detail.value
    //     })
    // },
    bindInput(e){
        console.log(e)
        this.setData({
            content:e.detail.value
        })
    },
    confirmBtn() {//提交活动
        if (this.data.startTime === "开始时间" || !this.data.oldStart) {
            wx.showToast({
                title: '请选择开始时间',
                icon: 'none'
            })
        }else if (this.data.endTime === "结束时间" || !this.data.oldEnd) {
            wx.showToast({
                title: '请选择结束时间',
                icon: 'none'
            })
        }else if(!this.data.content){
            wx.showToast({
                title: '请输入活动内容',
                icon: 'none'
            })
        }else {
            let url = app.globalData.url + '/rzapi/group/startShopGroup';
            let data = {
                openId: wx.getStorageSync('openid'),
                shopId: this.data.shopId,
                groupContent: this.data.content,
                startTime: this.data.oldStart,
                endTime: this.data.oldEnd
            }
            ajax.postAjax(url, data).then(res =>{
                if (res.data.success == 1){
                    wx.showToast({
                        title: '发布成功'
                    })
                    this.setData({
                        isRelease: true
                    })
                }else {
                    wx.showToast({
                        title: res.data.errmsg,
                        icon: 'none'
                    })
                }
            })
        }
    },
    getGroupInfo (shopId) {//获取团购信息
        let data = {
            openId: wx.getStorageSync('openid'),
            shopId: shopId
        };
        let url = app.globalData.url + '/rzapi/group/shopGroupList';
        ajax.postAjax(url, data).then(res => {
            if (res.data.result.length > 0){
                let allList = res.data.result.map(item =>{//将日期中的"-"改为"."
                    let startTime = item.startTime.replace(/-/g, ".");
                    let endTime = item.endTime.replace(/-/g, ".");
                    item.startTime = startTime;
                    item.endTime = endTime;
                    return item
                })
                let beforeList = allList.filter(item => {//筛选历史团购
                    if (item.del == 0) {
                        return item
                    }
                }).reverse();
                let currentList = allList.filter(item => {//筛选本期团购
                    if (item.del == 1) {
                        return item
                    }
                })
                if (currentList.length > 0){
                    this.setData({
                        isRelease:true,
                        isAutoHeight:true,
                        startTime: currentList[0].startTime,
                        endTime: currentList[0].endTime,
                        content: currentList[0].groupContent
                    })
                }else {
                    this.setData({
                        isRelease:false,
                        isAutoHeight:false
                    })
                }
                this.setData({
                    beforeList,
                    currentList,
                })
            }
        })
    },
    checkUserRole (e) {
        let groupId =  e.currentTarget.dataset.groupid;
        let start = e.currentTarget.dataset.start;
        let end = e.currentTarget.dataset.end;
        let content = e.currentTarget.dataset.content;
        // if (this.data.entry == 2){//从我的里进入
        //     return
        // } else {
            let shopId = e.currentTarget.dataset.shopid;
            if (this.data.userID == wx.getStorageSync('userid')){
                wx.navigateTo({
                    url:'/pages/details/groupBuy/changeUserStatus/changeUserStatus?shopId=' + shopId + '&groupId=' + groupId
                    + '&start=' + start + '&end=' + end + '&content=' + content
                })
            }
        // }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.shopId){
            console.log(options.shopId)
            this.setData({
                shopId: options.shopId,
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
            //  获取本人信息（这里主要是获取shopId）
            let url1 = app.globalData.url + '/rzapi/privilege/getUpdateCoupon';
            let data1 = {
                openId: wx.getStorageSync('openid'),
                userid: wx.getStorageSync('userid')
            }
            ajax.postAjax(url1, data1).then(res =>{
                if (res.data.success == 1){
                    this.getGroupInfo(res.data.result.shopId)
                    this.setData({
                        shopId: res.data.result.shopId
                    })

                    let url3 = app.globalData.url + '/rzapi/shop/getUploadId';
                    let data3 = {
                        shopId: res.data.result.shopId,
                    }
                    ajax.postAjax(url3, data3).then(res =>{
                        if (res.data.result) {
                            this.setData({
                                userID:res.data.result
                            })
                        }
                    })
                }
            })


        // let url = app.globalData.url + '/rzapi/user/getMyPage';
        // let data = {
        //     openId: wx.getStorageSync('openid'),
        //     userid: wx.getStorageSync('userid'),
        // }
        // ajax.postAjax(url, data).then(res =>{
        //     if (res.data.result) {
        //         this.setData({
        //             userRole: res.data.result.roleId
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
