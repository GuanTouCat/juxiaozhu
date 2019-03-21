// pages/details/groupBuy/mapLocation/mapLocation.js
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js');
var demo = new QQMapWX({
    key: '4DNBZ-TMI6J-R4XFS-FUX3K-5AEWV-TPFWM' // 必填
});

Page({

    /**
    * 页面的初始数据
    */
    data: {
        addressList:[],
        currentLat: undefined,
        currentLon: undefined,
        suggestion:undefined,
        keyword:'小区',
        isShowSuggestionList:false,
    },
    // bindupdated:function (e) {
    //     console.log(e)
    //
    // },
    bindupdated:function(e, lat, lng) {
        console.log(e)
        this.setData({
            markers: [{
                latitude: lat,
                longitude: lng,
                iconPath:'/images/details/location.png'}]
        })
    },
    handleGetMessage(e){
        console.log(e.detail.data[0][1])
        let location = e.detail.data[0][0];
        let lat = e.detail.data[0][1];
        let lng = e.detail.data[0][2];
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
            location,
            lat,
            lng
        })

    },
    bindregionchange:function(e){
        console.log(e)
        this.mapCtx.getCenterLocation({
                success: res =>{
                    console.log(res)
                    this.mapCtx.translateMarker({
                        markerId:0,
                        duration:200,
                        destination:{
                            latitude: res.latitude,
                            longitude: res.longitude
                        },
                        success: req =>{
                            this.configMap(this.data.keyword, res.latitude, res.longitude)
                        }
                    })
                }
        }
        )
    },
    bindpoitap:function(e){
        console.log(e)
    },
    configMap: function (keyword, lat, lng) {//进入本页面显示最近范围内的小区
        console.log(lat)
        // 调用接口
        demo.search({
            keyword,
            location: {
                latitude: lat,
                longitude: lng
            },
            success: res =>  {
                console.log(res)
                this.setData({
                    addressList: res.data,
                    markers: [{
                        id:0,
                        latitude: lat,
                        longitude: lng,
                        title:"当前位置",
                        iconPath: "/images/details/location.png",
                        width: 30,
                        height: 30,
                        anchor:{}}],
                    // circles:[{
                    //     latitude: lat,
                    //     longitude: lng,
                    //     color: '#fff',
                    //     fillColor: "#3395F8",
                    //     radius: 100,
                    //     strokeWidth: 2
                    // }]
                })
            },
            fail: function (res) {
            },
            complete: res => {
            }
        });
    },
    formSubmit:function (e) {//点击搜索按钮
        console.log(e.detail.value.searchKeyword);
        let keyword = e.detail.value.searchKeyword;
        if (keyword) {
            this.setData({
              keyword
            });
            this.configMap(keyword)
        } else {
            wx.showToast({
                title: '请输入关键词',
                icon: 'none'
            })
        }
    },
    formReset:function () {//点击取消按钮
        // this.setData({
        //     searchKeyword:'',
        //     tips:[],
        //     isShowSuggestionList:false,
        // })
        wx.navigateBack({
            delta: 1
        })
    },
    includePoints(lat, lng) {
        this.mapCtx.includePoints({
            padding: [0],
            points: [{
                latitude: lat,
                longitude: lng,
            }, {
                latitude: lat,
                longitude: lng,
            }]
        })
    },
    getSuggest:function (e) {//获取搜索关键词列表
        let suggestion = e.detail.value;
        if (suggestion) {
            demo.getSuggestion({
                keyword:suggestion,
                success: res => {
                    console.log('tips',res)
                    this.setData({
                        tips: res.data,
                        suggestion,
                        isShowSuggestionList:true,
                    });
                    if (res.data == []){
                        wx.showModal({
                            title: '没有找到您想要的结果',
                            confirmColor: "#E75858",
                            showCancel: false,
                        })
                    }

                },
                fail: function (res) {
                },
                complete: function (res) {
                }
            })
        } else {
            this.setData({
                tips:[],//清空搜索下拉框
                isShowSuggestionList:false,
            })
        }
    },
    chooseSelectCell: function (e) {
        console.log(e)
        let type = e.currentTarget.dataset.type;
        let title = e.currentTarget.dataset.title;
        let id = e.currentTarget.dataset.id;
        let lat = e.currentTarget.dataset.lat;
        let lng = e.currentTarget.dataset.lng;
        if (type == 1) {///点击初始结果返回上一页
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];
            prevPage.setData({
                location: title,
                locationId:id
            })
            wx.navigateBack({
                delta: 1
            })
        }else {//点击搜索结果
            this.configMap(this.data.keyword, lat, lng);
            this.setData({
                isShowSuggestionList:false,
                suggestion:'',
                searchKeyword:'',
            })
            this.includePoints(lat, lng);
        }
    },
    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        // this.getLocation()
        this.setData({
            currentLat:wx.getStorageSync('latitude'),
            currentLon:wx.getStorageSync('longitude'),
        });
    },

    /**
    * 生命周期函数--监听页面初次渲染完成
    */
    onReady: function () {
      this.mapCtx = wx.createMapContext('map')
    },

    /**
    * 生命周期函数--监听页面显示
    */
    onShow: function () {
        this.configMap(this.data.keyword, this.data.currentLat, this.data.currentLon);
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
