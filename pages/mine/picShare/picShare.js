// pages/mine/picShare/picShare.js
const ajax = require('../../../utils/requestNew');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
    data: {
      photoArr:[],
      pageSize: 0
    },
    getPhotoArr(pageSize) {
        let url = app.globalData.url + '/rzapi/share/getShareList';
        let data = {
            rownum: pageSize * 10,
            districtId:wx.getStorageSync('areaid'),
            openId:wx.getStorageSync('openid'),
            userId:wx.getStorageSync('userid'),
            patternId: '',
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                this.setData({
                    photoArr: this.data.photoArr.concat(res.data.result)
                })
            }
        })
    },
    toPhotoDetail(e){
        let shareId = e.currentTarget.dataset.shareid;
        let avatorPic = e.currentTarget.dataset.avatorpic;
        let nickname = e.currentTarget.dataset.nickname;
        let pattern = e.currentTarget.dataset.pattern;
        let patternId = e.currentTarget.dataset.patternid;
        let createtime = e.currentTarget.dataset.createtime;
        wx.navigateTo({
            url: '/pages/picShare/picShareDetail/picShareDetail?shareId=' + shareId + '&avatorPic=' + avatorPic
                + '&nickname=' + nickname + '&pattern=' + pattern + '&patternId=' + patternId + '&createtime=' + createtime + '&type=' + 1
        })
    },
    deletePic (e) {
        let shareId = e.currentTarget.dataset.shareid;
        let index = e.currentTarget.dataset.index;
        let photoArr = this.data.photoArr;
        console.log(index)
        wx.showModal({
            content:'确定要删除吗?',
            success: res=>{
                if (res.confirm) {
                    let url = app.globalData.url + '/rzapi/share/deletePicShare';
                    let data = {
                        openId: wx.getStorageSync('openid'),
                        shareId
                    };
                    ajax.postAjax(url, data).then(res =>{
                        if (res.data.success == 1){
                            photoArr.splice(index, 1);
                            this.setData({
                                photoArr
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPhotoArr(this.data.pageSize)
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
        this.setData({
            pageSize: ++this.data.pageSize
        });
        this.getPhotoArr(this.data.pageSize)
    },
})
