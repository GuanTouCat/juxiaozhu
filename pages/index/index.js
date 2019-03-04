//index.js
//获取应用实例
var e = require("../../utils/location.js");
var tool = require('../../utils/request.js');
var t = require("../../utils/qqmap-wx-jssdk.min.js");
var a = void 0;
const app = getApp()
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
  },
  // 页面显示
  onShow: function () {
    if (getApp().globalData.location != '') {
      this.setData({
        location: getApp().globalData.location
      })

      //获取首页的列表
      getFirstPage(this)
      //获取首页分类
      getMainClassifyList(this)
    }

    //获取轮播图
    getSlideList(this)

   //这里是为了防止用户位置信息授权没有成功，二次保障，这段代码可有可无
    var that = this
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API

                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API

        }
        else {
          //调用wx.getLocation的API
        }
      }
    })



  var that = this
    wx.getLocation({
      type: "gcj02",
      success: function (n) {
        console.log('得到了经纬度')
        wx.setStorageSync("latitude", n.latitude - .046784),
        wx.setStorageSync("longitude", n.longitude - .02782);
        if (getApp().globalData.location == '') {
          //再一次获取地理位置，每次进首页都要自动更新
          getCityName(that)
        }
      }
    });

  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  find: function (e) {
    wx.navigateTo({
      url: '../index/find/find'
    })
  },
  fenlei: function (e) {
    wx.navigateTo({
      url: '../index/result/result',
    })
  },
  xuqiu:function (e) {
    wx.navigateTo({
      url: '/pages/index/userneed/userneed'
    })
    // wx.showToast({
    //   title: '功能暂未开放',
    //   icon: 'loading',
    //   duration: 1000,
    //   mask: true
    // })
    },
  // 页面加载
  onLoad: function (options) {

    //初次进首页获取当前用户的地理位置，这里调用的第三方的SDK
    var i = this;
    (a = new t({
      key: e.mapqqkey
    })).reverseGeocoder({
      location: {
        latitude: wx.getStorageSync("latitude"),
        longitude: wx.getStorageSync("longitude")
      },
      success: function (e) {
        console.log('获取用户当前位置', e);
        var t = e.result.ad_info.city.slice(0, -1);
        i.setData({
          location: e.result.address_component.city
        });
      }
    })

    //判断用户是否授权
    checkuser()

    // 查看是否授权
    var i = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log('用户已授权', res.userInfo)
              i.setData({
                userInfo: res.userInfo
              });
              // wx.setStorageSync('userInfo', res.userInfo)

            }
          })
          //获取用户code,这里这么写的原因是，执行是异步的
          getusercode(i)
        }
      },
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
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
      getApp().globalData.superioruserid = options.userid
    }

    //扫销售码进来&&扫个人分享码进来&&扫申请店长码进来
    if (options.scene){
      console.log('解码前', options.scene)
      var scene = decodeURI(options.scene)
      console.log('扫销售码进来&&扫个人分享码进来&&扫申请店长码进来', options.scene)
      //判断字符串是否包含'!'
      if (options.scene.indexOf('!') >= 0) {
        //字符分割,扫销售码进入
        if (options.scene.split("!")[0] == 'districtId'){
          getApp().globalData.districtId = options.scene.split("!")[1]
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
  loadData: function () {
    var e = this;
    return void e.setData({
      hidden: !1,
      myhidden: !0
    });
  },
  getUserInfo: function(e) {
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  details: function (e) {
    console.log('shopid',e.currentTarget.dataset.shopid)
    wx.navigateTo({
      url: "../../pages/details/details?shopid=" + e.currentTarget.dataset.shopid,
    })
  },

  //点击更多跳转
  jumpmore:function(e){
    getApp().globalData.kindtype = e.currentTarget.dataset.kindtype
    wx.navigateTo({
      url: '/pages/index/result/result',
    })
  },
  //分类跳转
  kindlist:function(e){
    getApp().globalData.kindtype = e.currentTarget.dataset.kindtype
    wx.navigateTo({
      url: '/pages/index/result/result',
    })
  },
  //城市选择
  choosecity:function(){
    wx.navigateTo({
      url: '/pages/index/choosecity/choosecity',
    })
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
        console.log('code', that.data.code)
      }
      //用户登录
      userlogin(that)
    }
  },
  )
}


//获取首页的分类接口
function getMainClassifyList(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/classify/getMainClassifyList',
    'GET',
    {

    }
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
        firstpage: res.data.result
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
    getFirstPage(that)
    //获取首页分类
    getMainClassifyList(that)

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

//判断是否授权
function checkuser() {
  wx.getSetting({
    success: function (res) {
      if (res.authSetting['scope.userInfo']) {
        wx.getUserInfo({
          success: function (res) {
            //从数据库获取用户信息
            //用户已经授权过
            console.log('用户已经授权过')
            wx.redirectTo({
              url: '/pages/index/index'
            })
          },
        });
      } else {
        console.log('用户没有授权过')
        wx.redirectTo({
          url: '/pages/userauthorization/userauthorization'
        })
      }
    },
  })
}





function getCityName(that) {
  wx.request({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + wx.getStorageSync("latitude") + ',' + wx.getStorageSync("longitude") + '&key=SB7BZ-6VKHO-LX4WZ-S2H4X-3DBG5-BCBLE',
    data: {},
    success: function (res) {
      that.setData({
        location: res.data.result.address_component.city
      });
      console.log('获取用户当前位置', res.data)
    },
    fail: function (res) {

    }
  })
}











