// pages/details/groupBuy/changeUserStatus/changeUserStatus.js
var ajax = require('../../../../utils/requestNew.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        value:undefined,
        balance:undefined,
        allList:[],
        statusList:['等待商家确定','已付定','已完成','取消',],
        userList:[],
        isHaveUser:false
    },
    checkUserTel(e) {//点击查看用户手机号
        let idx = e.currentTarget.dataset.idx;
        let userId = e.currentTarget.dataset.userid;
        wx.showModal({
            title: '提示',
            content: '确认购买吗？',
            confirmText: '确认支付',
            cancelText: '取消',
            success: res => {
                if (res.confirm) {
                    this.pay(idx, userId)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    getUserList(groupId){//获取参与本期拼团活动的用户
        let data1 = {
            openId: wx.getStorageSync('openid'),
            groupId: groupId,
            userid: wx.getStorageSync('userid'),
            roleId: wx.getStorageSync('roleid')
        };
        let url1 = app.globalData.url + '/rzapi/group/joinUserList';
        ajax.postAjax(url1, data1).then(res =>{
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
    pay (idx, userId) {
        if (this.data.balance >= this.data.cost) {//判断用户余额 比设置金额大就调用自己大后端接口
            let url =  app.globalData.url + '/rzapi/group/payByBalance';
            let data = {
                userId: wx.getStorageSync('userid'),
                openId: wx.getStorageSync('openid'),
                groupId: this.data.groupId,
                touserId: userId,
                cost: this.data.cost
            };
            ajax.postAjax(url, data).then(res => {
                if (res.data.success == 1){
                    // let newUserList  = this.data.userList;
                    // newUserList[idx].shoePhone = 1;
                    // this.setData({
                    //     userList:newUserList
                    // })
                    this.getUserList(this.data.groupId)
                }

            })
        } else if (0 <= this.data.balance < this.data.cost) {//比设置金额小就调用微信支付剩余的钱
            let url = app.globalData.url + '/rzapi/group/payByMix';
            let data = {
                openId: wx.getStorageSync('openid'),
                userId: wx.getStorageSync('userid'),
                groupId: this.data.groupId,
                touserId: userId,
                cost: this.data.cost,
                balance: this.data.balance
            }
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
                        let newUserList  = this.data.userList;
                        newUserList[idx].shoePhone = 1;
                        this.setData({
                            userList:newUserList
                        })
                    },
                    fail: res => {

                    }
                })
            })
        }




    },
    changeStatus(e) {//改变用户订单状态
        console.log(e)
        let index = e.currentTarget.dataset.idx;
        let id = e.currentTarget.dataset.id;
        let value = e.detail.value;
        let newUserList = this.data.userList;
        let url = app.globalData.url + '/rzapi/group/updateJoinUserStatus';
        let data = {
            openId: wx.getStorageSync('openid'),
            id,
            status: value
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1) {
                newUserList[index].status = value;
                this.setData({
                    userList: newUserList
                })
            }else {
                wx.showToast({
                    title: '网络请求错误',
                    icon:'none'
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
            this.setData({
                shopId: options.shopId,
                groupId:options.groupId,
                startTime: options.start,
                endTime: options.end,
                content: options.content
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
        //获取本期拼团活动信息
        let data = {
            openId: wx.getStorageSync('openid'),
            shopId: this.data.shopId
        };
        let url = app.globalData.url + '/rzapi/group/shopGroupList';
        ajax.postAjax(url, data).then(res => {
            if (res.data.result.length > 0){
                let allList = res.data.result.map(item =>{
                    let startTime = item.startTime.replace(/-/g, ".");
                    let endTime = item.endTime.replace(/-/g, ".");
                    item.startTime = startTime;
                    item.endTime = endTime;
                    return item
                });
                this.setData({
                    allList
                });
                this.getUserList(this.data.groupId)
            }
        })

        //获取本人的余额
        let url1 = app.globalData.url + '/rzapi/user/getMyPage';
        let data1 = {
            openId: wx.getStorageSync('openid'),
            userid: wx.getStorageSync('userid'),
        }
        ajax.postAjax(url1, data1).then(res => {
            if (res.data.result) {
                this.setData({
                    balance: Number(res.data.result.balance)
                })
            }
        })

        //获取想要查看用户手机号需要支付的金额
        let url2 = app.globalData.url + '/rzapi/group/groupPhoneCost';
        let data2 =  {}
        ajax.getAjax(url2, data2).then(res =>{
            if (res.data.result){
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
