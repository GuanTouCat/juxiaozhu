// pages/picShare/picShare.js
const ajax = require('../../utils/requestNew');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      current:0,
      tabId: '',
      tabLists:[],
      photoArr:[],
      pageSize: 0
  },
    tabClick(e) {
        let current = e.currentTarget.dataset.idx;
        let tabId = e.currentTarget.dataset.id;
        this.setData({
            current,
            tabId,
            pageSize: 0
        });
        this.getPhotoArr(tabId, this.data.pageSize)
    },
    getPhotoArr(tabId, pageSize) {
        let url = app.globalData.url + '/rzapi/share/getShareList';
        let data = {
            rownum: pageSize * 10,
            districtId:wx.getStorageSync('areaid'),
            openId:wx.getStorageSync('openid'),
            patternId: tabId,
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                if (pageSize == 0){
                    this.setData({
                        photoArr: res.data.result
                    })
                } else {
                    this.setData({
                        photoArr: this.data.photoArr.concat(res.data.result)
                    })
                }
            }
        })
    },
    getTableLists() {
        let url = app.globalData.url + '/rzapi/share/getPatternClassify';
        let data = {};
        ajax.postAjax(url,data).then(res =>{
            if (res.data.success == 1){
                let all = {pattern: "全部", del: "1", id: ""};
                let tabLists = res.data.result;
                tabLists.unshift(all)
                this.setData({
                    tabLists
                })
            }
        })
    },
    toPhotoDetail(e){
      let shareId = e.currentTarget.dataset.shareid;
      let avatorPic = e.currentTarget.dataset.avatorpic;
      let nickname = e.currentTarget.dataset.nickname;
      let pattern = e.currentTarget.dataset.pattern;
      let createtime = e.currentTarget.dataset.createtime;
        wx.navigateTo({
            url: '/pages/picShare/picShareDetail/picShareDetail?shareId=' + shareId + '&avatorPic=' + avatorPic
            + '&nickname=' + nickname + '&pattern=' + pattern + '&createtime=' + createtime
        })
    },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        this.getTableLists()
        this.getPhotoArr(this.data.tabId, this.data.pageSize)
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
      })
      this.getPhotoArr(this.data.tabId, this.data.pageSize)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
