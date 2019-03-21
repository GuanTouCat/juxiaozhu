// pages/details/groupBuy/entryInfo/entryInfo.js
var ajax = require('../../../../utils/requestNew.js');
const app = getApp()
Page({

    /**
    * 页面的初始数据
    */
    data: {
        location:undefined,
        locationId : undefined,
        lat:undefined,
        lng:undefined,
        isClickAddress:false,
        currentList:[],
        isShowMap:false
    },
    toMapLocation:function () {//进入地图选择页面
        wx.navigateTo({
          url: '../mapLocation/mapLocation'
        })
        // this.setData({
        //     isShowMap:true
        // })
    },
    // confirm:function(){
    //     this.setData({
    //         isShowMap:false
    //     })
    // },
    formSubmit:function(e){
        let name = e.detail.value.userName;
        let phone = e.detail.value.phone;
        // let address =
        let myTel =/^1[34578]\d{9}$/;
        if (!name) {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none'
            })
        }else if (!phone || !myTel.test(phone)) {
            wx.showToast({
                title: '请输入电话/手机号有误',
                icon: 'none'
            })
        }else if (!this.data.location) {
            wx.showToast({
                title:'请选择小区',
                icon:'none'
            })
        }else {
            let data = {
                openId: wx.getStorageSync('openid'),
                userId: wx.getStorageSync('userid'),
                groupId: this.data.currentList[0].id,
                name,
                tel:phone,
                plotName:this.data.location,
                plotLat:this.data.lat,
                plotLon:this.data.lng
            };
            let url = app.globalData.url + '/rzapi/group/joinShopGroup';
            ajax.postAjax(url, data).then(res => {
                console.log(res.data.success)
                if (res.data.success == 1){
                    wx.navigateTo({
                        url: '../success/success'
                    })
                } else {
                    wx.showToast({
                        title: res.data.errmsg,
                        icon:'none',
                        duration:2000

                    })
                }
            });
        }

    },
    // ClickAddress:function () {
    //     this.setData({
    //         isClickAddress:true
    //     })
    // },
    bindMessage:function(e) {
        console.log(e)
    },
    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        // this.setData({
        //     location: options.location,
        //     lat: options.lat,
        //     lng: options.lng
        // })
        this.setData({
            shopId:options.shopId
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
        let url = getApp().globalData.url + '/rzapi/group/shopGroupList';
        ajax.postAjax(url, data).then(res => {
            if (res.data.result.length > 0){
                let allList = res.data.result.map(item =>{
                    let startTime = item.startTime.replace(/-/g, ".")
                    let endTime = item.endTime.replace(/-/g, ".")
                    item.startTime = startTime;
                    item.endTime = endTime
                    return item
                })
                console.log(allList)
                let currentList = allList.filter(item =>{
                    if (item.del == 1){
                        return item
                    }
                })
                this.setData({
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
