// pages/picShare/chooseTag/chooseTag.js
const ajax = require('../../../utils/requestNew');
const  app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        id: undefined,
        current: undefined,
        chooseTags: []
    },
    clickTag(e) {
        let current = e.currentTarget.dataset.idx;
        let id = e.currentTarget.dataset.id;
        this.setData({
            current,
            id
        })
    },
    toUploadImg() {
        if (this.data.current >= 0){
            wx.navigateTo({
                url: '/pages/picShare/release/release?tagId=' + this.data.id
            })
        } else {
            wx.showToast({
                title: '请选择分类',
                icon: 'none'
            })
        }

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
        let url = app.globalData.url + '/rzapi/share/getPatternClassify';
        let data = {};
        ajax.postAjax(url,data).then(res =>{
            if (res.data.success == 1){
                this.setData({
                    chooseTags: res.data.result
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

})
