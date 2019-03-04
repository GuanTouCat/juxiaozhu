// pages/mine/fabu/fabu.js
var tool = require('../../../utils/request.js');
var uploadImage = require('../../../utils/uploadFile.js');
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [],
    current: 0,//当前选中的Tab项
    //需求展示列表
    needlist: [],
    //店铺分类
    shopclassify: [],
    //店铺分类下标
    shopclassifyindex: '',
    //联系人数列表
    contactlist: ['3', '4', '5', '6', '7', '8', '9', '10'],
    //联系人数列表下标
    contactlistindex:'',
    //上传截图地址
    screenshots: '',
    //判断截图是否上传,1已上传，0未上传
    uploadscreenshots:0,
    //联系电话
    phone:'',
    //标题
    title:'',
    //内容
    content:'',
    //需求期限列表,以周为单位
    timelimit:['1','2','3'],
    //需求期限列表下标
    timelimitindex:'',
    //我的购买列表
    buyneedlist:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //当用户角色为店员或店长时
    if (wx.getStorageSync('roleid') == 1 || wx.getStorageSync('roleid') == 3){
      this.setData({
        tabList: ["我的发布", "我要发布", "我的购买"]
      })
     }else{
      this.setData({
        tabList: ["我的发布", "我要发布"]
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
    //获取店铺分类
    getshopclassify(this)
    //获取我的发布列表
    getneedlist(this)
    //获取我的购买列表
    getbuyneedlist(this)
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
     * Tab的点击切换事件
     */
  tabItemClick: function (e) {
    this.setData({
      current: e.currentTarget.dataset.pos,
    })
    if (e.currentTarget.dataset.pos == 0){
      //获取我的发布列表
      getneedlist(this)

    } else if (e.currentTarget.dataset.pos == 2){
      //获取我的购买列表
      getbuyneedlist(this)
    }
  },
  //店铺分类选择
  shopclassifychange: function (e) {
    this.setData({
      shopclassifyindex: e.detail.value,
    })
  }, 

  //联系人数选择
  contactchange:function(e){
    this.setData({
      contactlistindex: e.detail.value,
    })
  },
  //需求周期选择
  timelimitchange:function(e){
    this.setData({
      timelimitindex: e.detail.value,
    })
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
  phoneinput:function(e){
     this.setData({
       phone:e.detail.value
     })
  },
  //标题输入
  titleinput:function(e){
    this.setData({
      title:e.detail.value
    })
  },
  //内容输入
  contentinput:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  //确认发布
  confirm:function(){
    funconfirm(this)
  },

  //查看购买需求详情
  buyneeddetail:function(e){
    wx.navigateTo({
      url: '/pages/mine/fabu/buyneeddetail/buyneeddetail?title='+e.currentTarget.dataset.title+'&content='+e.currentTarget.dataset.content+'&time='+e.currentTarget.dataset.time+'&pic='+e.currentTarget.dataset.pic+'&phone='+e.currentTarget.dataset.phone,
    })
  },
  
  //查看我的发布
  myrelease:function(e){
    wx.navigateTo({
      url: '/pages/mine/fabu/myrelease/myrelease?needid='+e.currentTarget.dataset.needid+'&userid='+e.currentTarget.dataset.userid,
    })
  },

  //下架需求
  soldout:function(e){
    funsoldout(this,e.currentTarget.dataset.id)
  },
})


function getshopclassify(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/classify/getClassifyTree',
    'POST',
    {

    }
  )
  aa.then(res => {
    console.log('获取店铺分类', res.data)
    if (res.data.result) {
      that.setData({
        shopclassify: res.data.result
      })
    }
  })
}

function funconfirm(that){
  if (!that.data.phone) {
    wx.showModal({
      title: '提示',
      content: '请输入联系电话',
      showCancel: false
    })
    return;
  }

  if (!that.data.shopclassifyindex) {
    wx.showModal({
      title: '提示',
      content: '请选择店铺分类',
      showCancel: false
    })
    return;
  }

  if (!that.data.contactlistindex) {
    wx.showModal({
      title: '提示',
      content: '请选择最大联系人数',
      showCancel: false
    })
    return;
  }

  if (!that.data.timelimitindex){
    wx.showModal({
      title: '提示',
      content: '请选择需求展示周期',
      showCancel: false
    })
    return;
  }


  if (!that.data.title) {
    wx.showModal({
      title: '提示',
      content: '请输入需求标题',
      showCancel: false
    })
    return;
  }

  if (!that.data.content) {
    wx.showModal({
      title: '提示',
      content: '请输入需求内容',
      showCancel: false
    })
    return;
  }

  var aa = tool.request(
    getApp().globalData.url + '/rzapi/userRequest/insertRequest',
    'POST',
    { 
      openId:wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      headline:that.data.title,
      demandIntro:that.data.content,
      demandPic:that.data.screenshots,
      districtId: wx.getStorageSync('areaid'),
      classifyId: that.data.shopclassify[that.data.shopclassifyindex].id,
      phonenumber:that.data.phone,
      checkCount: that.data.contactlist[that.data.contactlistindex],
      endTime:that.data.timelimit[that.data.timelimitindex] * 7,
    }
  )
  aa.then(res => {
    console.log('用户发布需求', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '发布成功',
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

function getneedlist(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/userRequest/getMyRequest',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取我的发布', res.data)
    if (res.data.result) {
      that.setData({
        needlist: res.data.result
      })
    }
  })
}


function getbuyneedlist(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/userRequest/getMyBought',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
    }
  )
  aa.then(res => {
    console.log('获取我的购买', res.data)
    if (res.data.result) {
      that.setData({
        buyneedlist: res.data.result
      })
    }
  })
}


function funsoldout(that,id){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/userRequest/requestFullfill',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      id:id,
    }
  )
  aa.then(res => {
    console.log('下架发布需求', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '下架成功',
        icon: 'success',
        duration: 1500
      })
      //获取我的发布列表
      getneedlist(that)
    }
  })
}