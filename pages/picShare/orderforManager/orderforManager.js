// pages/picShare/orderforManager/orderforManager.js
const ajax = require('../../../utils/requestNew');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
    data: {

    },
    checkUserTel(e) {//点击查看用户手机号
        // let idx = e.currentTarget.dataset.idx;
        let shopId = e.currentTarget.dataset.shopid;
        let wantId = e.currentTarget.dataset.wantid;
        wx.showModal({
            title: '提示',
            content: '确认花费' + this.data.cost +'元购买吗？',
            confirmText: '确认支付',
            cancelText: '取消',
            success: res => {
                if (res.confirm) {
                    this.pay(wantId, shopId)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    getUserList(){//获取意向用户名单
        let data = {
            openId: wx.getStorageSync('openid'),
            userId: wx.getStorageSync('userid'),
        };
        let url = app.globalData.url + '/rzapi/share/getUserWantList';
        ajax.postAjax(url, data).then(res =>{
            if (res.data.result.length > 0) {
                this.setData({
                    userList: res.data.result
                })
            }else {
                this.setData({
                    isHaveUser:true
                })
            }
        })
    },
    getMyPage() {
        let url1 = app.globalData.url + '/rzapi/user/getMyPage';
        let data1 = {
            openId: wx.getStorageSync('openid'),
            userid: wx.getStorageSync('userid'),
        }
        ajax.postAjax(url1, data1).then(res => {
            if (res.data.success == 1) {
                this.setData({
                    balance: Number(res.data.result.balance)
                })
            }
        })
    },
    pay (wantId, shopId) {
        if (this.data.balance >= this.data.cost) {//判断用户余额 比设置金额大就调用自己的后端接口
            let url =  app.globalData.url + '/rzapi/share/payByBalance';
            let data = {
                userId: wx.getStorageSync('userid'),
                openId: wx.getStorageSync('openid'),
                wantId,
                shopId,
                cost: this.data.cost
            };
            ajax.postAjax(url, data).then(res => {
                if (res.data.success == 1){
                    this.getUserList();
                    this.getMyPage()
                }
            })
        } else if (0 <= this.data.balance < this.data.cost) {//比设置金额小就调用微信来支付剩余的钱
            let url = app.globalData.url + '/rzapi/share/payByMix';
            let data = {
                openId: wx.getStorageSync('openid'),
                userId: wx.getStorageSync('userid'),
                wantId,
                shopId,
                cost: this.data.cost,
                balance: this.data.balance
            };
            ajax.postAjax(url, data).then(res =>{
                let nonceStr = res.data.result.noncestr;
                let timeStamp = res.data.result.timestamp;
                let pk = "prepay_id=" + res.data.result.prepayid;
                let signType = "MD5";
                let paySign = res.data.result.sign;
                wx.requestPayment({
                    timeStamp,
                    nonceStr,
                    package: pk,
                    signType,
                    paySign,
                    success: res => {
                        // let newUserList  = this.data.userList;
                        // newUserList[idx].del = 1;
                        // this.setData({
                        //     userList:newUserList
                        // })
                        this.getUserList();
                        this.getMyPage()
                    },
                    fail: res => {

                    }
                })
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
        this.getUserList()
        //获取本人的余额
        this.getMyPage()

        //获取想要查看用户手机号需要支付的金额
        let url2 = app.globalData.url + '/rzapi/share/sharePhoneCost';
        let data2 =  {}
        ajax.getAjax(url2, data2).then(res =>{
            if (res.data.success == 1){
                this.setData({
                    cost: Number(res.data.result)
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
