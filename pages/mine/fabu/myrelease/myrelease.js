// pages/mine/fabu/myrelease/myrelease.js
var tool = require('../../../../utils/request.js');
var util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //上传截图地址
    screenshots: '',
    //判断截图是否上传,1已上传，0未上传
    uploadscreenshots: 0,
    //联系电话
    phone: '',
    //标题
    title: '',
    //内容
    content: '',
    needid:'',
    userid:'',
    //续期详情
    needdetail:'',
    //获取已购买需求的店铺列表
    buyforstoreslist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       if(options.needid && options.userid){
            this.setData({
              needid:options.needid,
              userid:options.userid
            })
       }

    
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
    //获取发布的需求详情
    getneeddetail(this)
    //获取已购买需求的店铺列表
    getbuyforstoreslist(this)
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

  //选择照片
  joinPicture: function (e) {
    var that = this
    var picnum = e.currentTarget.dataset.picnum
    var imgtype = e.currentTarget.dataset.type  //1.头像，2.营业执照，3.详情图
    wx.chooseImage({
      count: picnum, // 默认最多一次选择9张图
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var nowTime = util.formatTime(new Date());

        //支持多图上传
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          //显示消息提示框
          wx.showLoading({
            title: '上传中' + (i + 1) + '/' + res.tempFilePaths.length,
            mask: true
          })

          //上传图片
          //你的域名下的/cbb文件下的/当前年月日文件下的/图片.png
          //图片路径可自行修改
          uploadImage(res.tempFilePaths[i], 'cbb/' + nowTime + '/',
            function (result) {
              console.log("======上传成功图片地址为：", result);
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 1000
              })

              that.setData({
                uploadscreenshots: 1,
                screenshots: result
              })
            }, function (result) {
              console.log("======上传失败======", result);
              wx.showToast({
                title: '上传失败',
                icon: 'loading',
                duration: 1000
              })

            }
          )
        }
      }
    })
  },
  //手机号输入
  phoneinput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //标题输入
  titleinput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  //内容输入
  contentinput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  //确认修改
  confirm: function () {
    changedetail(this)
  },
})


function getneeddetail(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/userRequest/getRequestDetails',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      id: that.data.needid,
      touserid: that.data.userid,
      roleId: wx.getStorageSync('roleid'),
    }
  )
  aa.then(res => {
    console.log('获取需求详情', res.data)
    if (res.data.result) {
      that.setData({
        needdetail: res.data.result,
        phone: res.data.result.phonenumber,
        title: res.data.result.headline,
        content: res.data.result.demandIntro,
        screenshots: res.data.result.demandPic,
      })
    }
  })
}

function changedetail(that){
  //获取当前时间戳  
  var timestamp = Date.parse(new Date());
  var time = util.formatTime4(timestamp, 'Y-M-D h:m:s')
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/userRequest/updateMyRequest',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      id: that.data.needid,
      headline:that.data.title,
      demandintro:that.data.content,
      demandpic	:that.data.screenshots,
      phonenumber	:that.data.phone,
      updatetime:time,
    }
  )
  aa.then(res => {
    console.log('修改需求详情', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1500
      })
      //设置定时器的原因是，返回上一页是异步执行
      setTimeout(function () {
        wx.navigateBack();
        var pages = getCurrentPages()
        var backpage = pages[pages.length - 2]
        backpage.setData({
          backtag: 1,
        });
      }, 1500)
    }
  })

}



function getbuyforstoreslist(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/userRequest/getBoughtShopname',
    'POST',
    {
      id: that.data.needid,
    }
  )
  aa.then(res => {
    console.log('获取已购买需求的店铺列表', res.data)
    if (res.data.result) {
      that.setData({
        buyforstoreslist:res.data.result
      })
    }
  })
}