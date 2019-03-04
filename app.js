//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    wx.getLocation({
      type: "gcj02",
      success: function (n) {
        wx.setStorageSync("latitude", n.latitude - .046784), 
        wx.setStorageSync("longitude", n.longitude - .02782);
      }
    });
  },


  globalData: {
    userInfo: null,
    // url: 'http://192.168.1.110:8080',
    url:'https://tango007.heeyhome.com',
    wxSearchData:'',
    kindtype:'',
    //首页分享进来获取的上级用户的userID
    superioruserid:'',
    //扫销售码进来的获取地区ID
    districtId:'',
    //选择的地区
    location:'',
    //扫成为店长进来,0没有扫，1扫
    shopApply:0,
    //个人分享码进来
    sharingcode:'',
    //扫二级销售码进入，获取一级销售userID
    secondarySale:'',
    //扫二级销售的店铺申请码进入，获取二级销售的userID
    secondSaleApplyuserID:''
  }
})