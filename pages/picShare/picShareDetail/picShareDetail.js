// pages/picShare/picShareDetail/picShareDetail.js
const ajax = require('../../../utils/requestNew');
const app = getApp();
const reg = /([^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n])|(\s)/g;
Page({

  /**
   * 页面的初始数据
   */
    data: {
        indicatorDots: true, //是否显示面板指示点
        autoplay: false, //是否自动切换
        interval: 3000, //自动切换时间间隔
        duration: 1000, //滑动动画时长
        sharePicList:[],
        commentList:[],
        clickEvaluation:false,
        adjust:false,
        keyBoardHeight:0,
        pageSize: 0,
        page:0,
        isLike: 0,
        isFavo: 0,
        isDesign: 0,
        inpValue: undefined,
        phonenumber: undefined,
        getPhoneNumber: ''
    },
    clickEvaluation() {
        this.setData({
            clickEvaluation:true
        })
    },
    getKeyBoard(e){//获取软键盘高度
        this.calculateScrollViewHeight()
        this.setData({
            keyBoardHeight:e.detail.height,

        })
    },
    getBlur() {//监听输入框光标
        this.setData({
            clickEvaluation:false
        });
    },
    clickMask() {//点击遮罩层
        this.setData({
            clickEvaluation:false
        })
    },

    regStrFn(str){
        let indexArr = reg.exec(str);
        if(str.match(reg)) {
            str = str.replace(reg, '');
            console.log(str)
        }
        let obj = { val: str, index: indexArr};
        return obj;
    },
    inputVal(e) {
        let val = e.detail.value,
            pos = e.detail.cursor;
        this.setData({
            inpValue:val
        });
        if (!reg.test(val)){
            return
        }
        let obj = this.regStrFn(val);
        if (pos != -1 && obj.index) {
            //计算光标的位置
            pos = obj.index.index
        }
        this.setData({
            inpValue: obj.val,
        })
    },
    getShareSpecific(pageSize){//获取图片分享详情
        let url = app.globalData.url + '/rzapi/share/getShareSpecific';
        let data = {
            openId: wx.getStorageSync('openid'),
            userId: wx.getStorageSync('userid'),
            shareId: this.data.shareId,
            rownum: pageSize * 10
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                let commentList = res.data.result.comment;
                commentList.map(item =>{
                    item.createtime = this.changeDate(item.createtime)
                });
                this.setData({
                    sharePicList: res.data.result.picList,
                    commentList: this.data.commentList.concat(commentList),
                    roomInfoList: res.data.result.roomInfo,
                    isLike: res.data.result.isLike,
                    isFavo: res.data.result.isFavo,
                    isDesign: res.data.result.isDesign
                })
            }
        })
    },
    clickAwesome() {//点击点赞按钮
        this.setData({
            isLike: this.data.isLike == 0 ? 1 : 0,
        });
        let url = app.globalData.url + '/rzapi/share/clickLike';
        let data = {
            openId: wx.getStorageSync('openid'),
            userId: wx.getStorageSync('userid'),
            shareId: this.data.shareId,
            type: this.data.isLike
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                if (this.data.isLike == 1){
                    wx.showToast({
                        title: '点赞成功',
                        icon: 'none'
                    });
                    this.setData({
                        likeCount: Number(this.data.likeCount) + 1
                    })
                } else {
                    wx.showToast({
                        title: '取消点赞成功',
                        icon: 'none'
                    });
                    this.setData({
                        likeCount: Number(this.data.likeCount) - 1
                    })
                }
            }
        })
    },
    clickCollect() {//点击收藏按钮
        this.setData({
            isFavo: this.data.isFavo == 0 ? 1 : 0,
        });
        let url = app.globalData.url + '/rzapi/share/clickFavo';
        let data = {
            openId: wx.getStorageSync('openid'),
            userId: wx.getStorageSync('userid'),
            shareId: this.data.shareId,
            type: this.data.isFavo
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                if (this.data.isFavo == 1){
                    wx.showToast({
                        title: '收藏成功',
                        icon: 'none'
                    })
                    this.setData({
                        favoCount: Number(this.data.favoCount) + 1
                    })
                } else {
                    wx.showToast({
                        title: '取消收藏成功',
                        icon: 'none'
                    })
                    this.setData({
                        favoCount: Number(this.data.favoCount) - 1
                    })
                }
            }
        })
    },
    insertComment() {//提交评论
        let url = app.globalData.url + '/rzapi/share/insertComment';
        let data = {
            openId: wx.getStorageSync('openid'),
            userId: wx.getStorageSync('userid'),
            shareId: this.data.shareId,
            commentInfo: this.data.inpValue
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                wx.showToast({
                    title: '评价成功',
                    icon:'none'
                });
            }
        })
    },
    getShareBasic() {//获取点赞、收藏、评价数量
        let url = app.globalData.url + '/rzapi/share/getShareBasic';
        let data = {
            openId: wx.getStorageSync('openid'),
            shareId: this.data.shareId,
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                this.setData({
                    likeCount: res.data.result.likeCount,
                    favoCount: res.data.result.favoCount,
                    commentCount: res.data.result.commentCount
                })
            }
        })
    },
    getShareCommentList(page) {//获取评价接口
        let url = app.globalData.url + '/rzapi/share/getShareCommentList';
        let data = {
            openId: wx.getStorageSync('openid'),
            shareId: this.data.shareId,
            rownum: page * 10
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                let commentList = res.data.result;
                commentList.map(item =>{
                    item.createtime = this.changeDate(item.createtime)
                });
                this.setData({
                    commentList: this.data.commentList.concat(commentList),
                    commentCount: res.data.result.length
                })
            }
        })
    },
    changeDate(time) {//时间格式转换
        let createtime = time;
        let month = createtime.substr(0,10);
        let date = createtime.substr(11, 5);
        let newMonth = month.substr(5,2) + '月' + month.substr(8,2) + '日';
        let newTime = newMonth + ' ' + date;
        return newTime
    },
    calculateScrollViewHeight() {//计算评价输入框距底部距离
        let query = wx.createSelectorQuery();
        query.select('#scrollview').boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec(res => {
            let height = res[0].height;
            wx.getSystemInfo({
                success: res => {
                    let mainHeight = height>res.windowHeight?height:res.windowHeight
                    this.setData({
                        mainHeight
                    })
                }
            });
        });
    },
    getPhoneNumber(e) {//获取手机号
        let shopId = e.currentTarget.dataset.shopid;
        let encryptedData = e.detail.encryptedData;
        let iv = e.detail.iv;
            wx.login({
                success: res =>{
                    let code = res.code;
                    if (code && encryptedData && iv){
                        let url = app.globalData.url + '/rzapi/share/getDecryptPhone';
                        let data = {
                            code,
                            encryptedData,
                            iv
                        };
                        ajax.postAjax(url, data).then(res =>{
                            if (res.data.success == 1){
                                let phonenumber = res.data.result.phoneNumber;
                                this.setData({
                                    phonenumber,
                                    getPhoneNumber: '',
                                    clickWantButton: 'clickWantButton'
                                });
                                wx.setStorageSync('phone', phonenumber);
                                this.clickWantButton(e,shopId)
                            }
                        })
                    }else {
                        wx.showToast({
                            title: '商家会根据此手机号与您联系',
                            icon: 'none',
                            duration: 5000
                        })
                        // wx.showModal({
                        //     title: '提示',
                        //     content: '拒绝会导致商家无法获取您的手机号',
                        //     success(res) {
                        //         if (res.confirm) {
                        //         } else if (res.cancel) {
                        //             console.log('用户点击取消')
                        //         }
                        //     }
                        // })
                    }
                }
            })
    },
    clickWantButton(e,shopId) {//点击想要按钮
        let isClick = e.currentTarget.dataset.isclick;
        if (isClick){
            wx.showToast({
                title: '请勿重复提交',
                icon:'none'
            })
        } else {
            let id = e.currentTarget.dataset.shopid;
            let index = e.currentTarget.dataset.idx;
            let url = app.globalData.url + '/rzapi/share/clickWantButton';
            let data = {
                openId: wx.getStorageSync('openid'),
                userId: wx.getStorageSync('userid'),
                shopId: shopId || id,
                phonenumber: wx.getStorageSync('phone')
            };
            ajax.postAjax(url, data).then(res =>{
                if (res.data.success == 1){
                    wx.showToast({
                        title: '提交成功',
                        icon: 'none'
                    })
                    let roomInfoList = this.data.roomInfoList;
                    roomInfoList[index].isClick = true;
                    this.setData({
                        roomInfoList
                    })
                }
            })
        }
    },
    previewImage(e) {//预览图片
        let index = e.currentTarget.dataset.index;
        let arr = this.data.sharePicList.map(item =>{
            return item.sharePic
        });
        wx.previewImage({
            current: this.data.sharePicList[index].sharePic, // 当前显示图片的http链接
            urls: arr // 需要预览的图片http链接列表
        })
    },
    toEditorRoomInfo(){//进入发布页面
        wx.navigateTo({
            url: '/pages/picShare/release/release?patternId=' + this.data.patternId + '&shareId=' + this.data.shareId
        })
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        this.setData({
            shareId: options.shareId,
            avatorPic: options.avatorPic,
            nickname: options.nickname,
            pattern: options.pattern,
            patternId: options.patternId || '',
            createtime: this.changeDate(options.createtime),
            type: options.type || 0
        })
        this.getShareSpecific(this.data.pageSize);
        this.getShareBasic();
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
        if (wx.getStorageSync('phone')) {
            this.setData({
                getPhoneNumber: '',
                clickWantButton: 'clickWantButton'
            });
        }else {
            this.setData({
                getPhoneNumber: "getPhoneNumber",
                clickWantButton: ''
            })
        }

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
      this.getShareSpecific(this.data.pageSize)
    },

    /**
    * 用户点击右上角分享
    */
    onShareAppMessage: function () {

    }
})
