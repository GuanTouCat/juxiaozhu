//index.js
//获取应用实例
var e = require("../../utils/location.js");
var tool = require('../../utils/request.js');
let ajax = require('../../utils/requestNew.js');
var QQMapWX = require("../../utils/qqmap-wx-jssdk.min.js");
var qqmapsdk = new QQMapWX({key: '4DNBZ-TMI6J-R4XFS-FUX3K-5AEWV-TPFWM'});
var a = void 0;
const app = getApp();
Page({
    // 查看是否授权
    data: {
    //轮播图
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    inputShowed: false,
    inputVal: "",
    code:'',
    classify:[],
    lunbo: [],
    firstpage:[],
    loginer:[],
    userInfo: {},
    //用户当前位置
    location:'',
    isShopShow:false,
    pageSize:0,
    photoArr:[]
    },

    getPhotoArr(pageSize) {
        let url = app.globalData.url + '/rzapi/share/getShareList';
        let data = {
            rownum: pageSize * 10,
            districtId:wx.getStorageSync('areaid'),
            openId:wx.getStorageSync('openid'),
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
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    find: function (e) {
        wx.navigateTo({
            url: '../index/find/find?city=' + this.data.location
        })
    },
    fenlei: function (e) {
        wx.navigateTo({
            url: '../index/result/result?city=' + this.data.location,
        })
    },
    xuqiu:function (e) {
        wx.navigateTo({
            url: '/pages/index/userneed/userneed'
        })
    },
    sendLocation: function () {//获取城市地址
        wx.getLocation({
            type: 'gcj02',
            success: city => {
                wx.setStorageSync('latitude',city.latitude);
                wx.setStorageSync('longitude',city.longitude);
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: city.latitude,
                        longitude: city.longitude
                    },
                    success: res => {
                        this.setData({
                            location: res.result.ad_info.city
                        });
                        wx.setStorageSync('location', res.result.ad_info.city);
                    },
                });
            },
            fail:function () {

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
    checkuser() {//判断是否授权
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: res => {
                            //用户已经授权过
                            wx.redirectTo({
                                url: '/pages/index/index'
                            });
                            getusercode(this)
                        },
                    });
                } else {
                    wx.redirectTo({
                        url: '/pages/userauthorization/userauthorization'
                    })
                }
            },
        })
    },
    // 页面加载
    onLoad: function (options) {
        this.sendLocation();
        //判断用户是否授权
        this.checkuser();
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse){
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
        //店铺详情页分享进来
        if(options.shopid){
            wx.navigateTo({
            url: '/pages/details/details?shopid=' + options.shopid,
            })
        }
        //首页分享进来成为下级
        if(options.userid){
            app.globalData.superioruserid = options.userid
        }
        //扫销售码进来&&扫个人分享码进来&&扫申请店长码进来
        if (options.scene){
            var scene = decodeURI(options.scene)
            console.log('扫销售码进来&&扫个人分享码进来&&扫申请店长码进来', options.scene)
            //判断字符串是否包含'!'
            if (options.scene.indexOf('!') >= 0) {
                //字符分割,扫销售码进入
                if (options.scene.split("!")[0] == 'districtId'){
                    app.globalData.districtId = options.scene.split("!")[1]
                }
                if (options.scene.split("!")[0] == 'shopid'){
                    //判断字符串是否包含'*'
                    if (options.scene.split("!")[1].indexOf('*') >= 0){
                    if (options.scene.split("!")[1].split("*")[0]){
                        getApp().globalData.superioruserid = options.scene.split("!")[1].split("*")[0]
                    }
                    if (options.scene.split("!")[1].split("*")[1] != 'nothing'){
                        getApp().globalData.sharingcode = options.scene.split("!")[1].split("*")[1]
                    }
                    }
                }
                if (options.scene.split("!")[0] == 'shopApply'){
                    getApp().globalData.shopApply = 1
                }
                //扫二级销售码进入
                if (options.scene.split("!")[0] == 'secondarySale'){
                    getApp().globalData.secondarySale = options.scene.split("!")[1]
                }
                //扫二级销售店铺码进入
                if (options.scene.split("!")[0] == 'secondApply') {
                    getApp().globalData.secondSaleApplyuserID = options.scene.split("!")[1]
                }
            }
        }
    },

    // 页面显示
    onShow: function () {
        console.log(wx.getStorageSync('location'))
        if (wx.getStorageSync('location')) {
            this.setData({
                location: wx.getStorageSync('location')
            });
            //获取首页的列表
            getFirstPage(this);
            getSlideList(this);
            this.getPhotoArr(this.data.pageSize)
        }else {
            //获取轮播图
            getSlideList(this)
        }
    },
    loadData: function () {
        var e = this;
        return void e.setData({
          hidden: !1,
          myhidden: !0
        });
    },
    details: function (e) {
        wx.navigateTo({
          url: "../../pages/details/details?shopid=" + e.currentTarget.dataset.shopid,
        })
    },

    //点击更多跳转
    jumpmore:function(e){
        getApp().globalData.kindtype = e.currentTarget.dataset.kindtype
        wx.navigateTo({
            url: '/pages/index/result/result?entryType=1' + '&location=' + this.data.location,
        })
    },
    //分类跳转
    kindlist:function(e){
        let kindtype = e.currentTarget.dataset.kindtype;
    getApp().globalData.kindtype = e.currentTarget.dataset.kindtype;
    if (kindtype == 1) {
        wx.navigateTo({
            url:'/pages/index/groupEntry/groupEntry'
        })
    }
    else if (kindtype == 3){
        wx.navigateTo({
            url:'/pages/picShare/picShare'
        })
    }
    else {
        wx.showToast({
          title: '暂未开放',
            icon:'none'
        })
    }
    },
    //城市选择
    choosecity:function(){
    wx.navigateTo({
        url: '/pages/index/choosecity/choosecity',
    })
    },
    mallEntry() {
        wx.switchTab({
            url: '/pages/mall/mall'
        })
    },
    groupEntry() {
       wx.navigateTo({
           url: '/pages/index/groupEntry/groupEntry'
       })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.data.pageSize = 0;
        this.data.photoArr = []
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
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '给您分享了居小助!',
            // path: 'pages/detail/detail?taskid='+this.data.IDD,
                path: 'pages/index/index?userid='+ wx.getStorageSync('userid'),
            success: function (res) {
            // 转发成功
            wx.showToast({
                title: '转发成功',
                icon: 'succes',
                duration: 1000,
                mask: true
            })
            },
            fail: function (res) {
            // 转发失败
            }
        }
    },
})

    //获取用户code
    function getusercode(that) {
        wx.login({
            success: function (res) {
                if (res.code) {
                that.setData({
                  code: res.code
                })
                }
                //用户登录
                userlogin(that)
            }
        })
    }


    //获取首页的分类接口
    function getMainClassifyList(that){
    var aa = tool.request(
        getApp().globalData.url + '/rzapi/classify/getMainClassifyList',
        'GET',
        {}
    )
    aa.then(res => {
        console.log('获取首页分类', res.data)
        if (res.data.result) {
            that.setData({
                classify:res.data.result
            })
        }
    })
    }
    //获取轮播图接口
    function getSlideList(that){
        var aa = tool.request(
        getApp().globalData.url + '/rzapi/slide/getSlideList',
    'GET',
    {

    }
    )
    aa.then(res => {
    console.log('获取轮播图列表', res.data)
    if (res.data.result) {
        that.setData({
        lunbo: res.data.result
        })
    }
    })
    }

    //获取首页列表接口
    function getFirstPage(that){
        var aa = tool.request(
        getApp().globalData.url + '/rzapi/firstPage/getFirstPageList',
    'POST',
    {
        rownum:'0',
        districtId:wx.getStorageSync('areaid'),
        openId:wx.getStorageSync('openid'),
        userid:wx.getStorageSync('userid'),
    }
    )
    aa.then(res => {
    console.log('获取首页列表', res.data)
    if (res.data.success == 1) {
        that.setData({
            firstpage: res.data.result,
            isShopShow:true
        })
    }
    })
    }
    function userlogin(that){
        var aa = tool.request(
        getApp().globalData.url + '/rzapi/user/login',
    'POST',
    {
        code:that.data.code,
        nickname: that.data.userInfo.nickName,
        gender: that.data.userInfo.gender,
        avatorPic: that.data.userInfo.avatarUrl,
        city:that.data.location,
        invitePid: getApp().globalData.superioruserid,
    }
    )
    aa.then(res => {
        console.log('获取登陆信息', res.data)
        if (res.data.result.openId) {
            //将用户的openid存入缓存
            wx.setStorageSync('openid', res.data.result.openId)
        }
        if(res.data.result.id){
            //将用户id存入缓存
            wx.setStorageSync('userid', res.data.result.id)
        }
        if (res.data.result.districtId){
            //将用户地区ID存入缓存
            wx.setStorageSync('areaid', res.data.result.districtId)
        }

        if (res.data.result.roleId){
            //将用户角色存入缓存
            wx.setStorageSync('roleid', res.data.result.roleId)
        }

        //获取首页的列表
        getFirstPage(that);

        //扫销售码进来，代码放在这里是因为考虑到新用户可能没有信息授权,注意一定要用全局变量判断
        if (getApp().globalData.districtId != ''){
            if (res.data.result.roleId == 0){
                wx.navigateTo({
                    url: '/pages/mine/xiaoshou/xiaoshou',
                })
            }else{
                wx.showModal({
                    title: '提示',
                    content: '您当前不是普通用户',
                    showCancel: false
                })
            }
        }

        //扫申请店长码进来，代码放在这里是因为考虑到新用户可能没有信息授权,注意一定要用全局变量判断
        if (getApp().globalData.shopApply == 1) {
            if (res.data.result.roleId == 0) {
                wx.navigateTo({
                    url: '/pages/mine/dianzhang/dianzhang',
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '您当前不是普通用户',
                    showCancel: false
                })
            }
        }

        //扫个人分享码进来
        if (getApp().globalData.sharingcode != ''){
            wx.navigateTo({
                url: "/pages/details/details?shopid=" + getApp().globalData.sharingcode,
            })
        }

        //扫二级销售码进入
        if (getApp().globalData.secondarySale != ''){
            if (res.data.result.roleId == 0) {
                wx.navigateTo({
                  url: '/pages/mine/erjixiaoshou/erjixiaoshou?secondarySale=' + getApp().globalData.secondarySale,
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '您当前不是普通用户',
                    showCancel: false
                })
            }
        }
        //扫二级销售的店铺申请码进入
        if (getApp().globalData.secondSaleApplyuserID != ''){
            if (res.data.result.roleId == 0) {
                wx.navigateTo({
                  url: '/pages/mine/dianzhang/Inaudit/Inaudit?secondSaleApplyuserID=' + getApp().globalData.secondSaleApplyuserID,
                })
            } else {
                wx.showModal({
                  title: '提示',
                  content: '您当前不是普通用户',
                  showCancel: false
                })
            }
        }
    })
}













