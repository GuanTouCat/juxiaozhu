var tool = require('../../../../utils/request.js');
var uploadImage = require('../../../../utils/uploadFile.js');
var util = require('../../../../utils/util.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    select: false,
    //城市列表
    city: [],
    //城市下标
    cityindex: '',
    select2: false,
    //店铺列表
    shoplist: [{ shopname: '新店', shopid: '1' },
    { shopname: '品牌', shopid: '2' },
    ],
    //店铺列表下标
    shopindex: '',
    //头像图片地址
    headimgurl: [],
    //营业执照图片地址
    businessimgurl: [],
    //详情图图片地址
    detailimgurl: [],
    //店名输入
    shopname: '',
    //地址输入
    address: '',
    //店铺简介输入
    shopdescribe: '',
    //姓名输入
    name: '',
    //联系电话输入
    phone: '',
    //判断头像是否上传,1已上传，0未上传
    uoloadheadimg: 0,
    //判断营业执照是否上传,1已上传，0未上传
    uoloadbusinessimg: 0,
    //判断详情图是否上传,1已上传，0未上传
    uoloaddetailimg: 0,
    //店铺分类
    shopclassify: [],
    //店铺分类下标
    shopclassifyindex: '',
    //店铺子分类
    shopclassifychild: [],
    //已选择的店铺子分类下标
    chooseclassifychild: [],
    //店铺风格
    shopstyle: [],
    //已选择的店铺风格店铺风格
    chooseshopstyle: [],
    //最低参考价格输入
    referenceprice: '',
    //最高参考价格输入
    referencepricehigh: '',
    //店长须知是否选中，1已选中，0未选中
    Isselected: 1,
    //申请店长回调是否成功,0未成功,1成功
    Issuccess: 0,
    //扫二级销售的店铺申请码进入，获取二级销售的userID
    secondSaleApplyuserID: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.secondSaleApplyuserID){
      this.setData({
        secondSaleApplyuserID:options.secondSaleApplyuserID
      })
   }

    //获取城市列表
    getcitylist(this)
    //获取店铺分类
    getshopclassify(this)
    //获取店铺风格
    getshopstyle(this)
  },
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  bindshop() {
    this.setData({
      select2: !this.data.select2
    })
  },
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      city: name,
      select: false
    })
  },
  mySelect2(e) {
    var name = e.currentTarget.dataset.dd
    this.setData({
      shop: name,
      select2: false
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
      console.log(e)
      console.log(picnum)
    //上传前先清空一下数据
    if (imgtype == 1) {
      that.setData({
        headimgurl: []
      })
    } else if (imgtype == 2) {
      that.setData({
        businessimgurl: []
      })
    } else if (imgtype == 3) {
      that.setData({
        detailimgurl: []
      })
    }
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
              console.log(result)
              console.log("======上传成功图片地址为：", result);
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 1000
              })
              if (imgtype == 1) {
                that.data.headimgurl.push(result)
                that.setData({
                  uoloadheadimg: 1
                })
              } else if (imgtype == 2) {
                that.data.businessimgurl.push(result)
                that.setData({
                  uoloadbusinessimg: 1
                })
              } else if (imgtype == 3) {
                that.data.detailimgurl.push(result)
                that.setData({
                  uoloaddetailimg: 1
                })
              }
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
  //城市选择
  citychange: function (e) {
    this.setData({
      cityindex: e.detail.value
    })
  },

  //店铺类型选择
  shopchange: function (e) {
    this.setData({
      shopindex: e.detail.value,
    })
  },

  //店铺分类选择
  shopclassifychange: function (e) {
    this.setData({
      shopclassifyindex: e.detail.value,
      shopclassifychild: this.data.shopclassify[e.detail.value].subclass
    })
  },

  //店铺风格选择
  shopstylechange: function (e) {
    this.setData({
      shopstyleindex: e.detail.value,
    })
  },
  //店名输入
  shopnameinput: function (e) {
    this.setData({
      shopname: e.detail.value
    })
  },

  //地址输入
  addressinput: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  //店铺简介输入
  shopdescribeinput: function (e) {
    this.setData({
      shopdescribe: e.detail.value
    })
  },

  //姓名输入
  nameinput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  //联系电话输入
  phoneinput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  //最低参考价格输入
  referencepriceinput: function (e) {
    this.setData({
      referenceprice: e.detail.value
    })
  },

  //最高参考价格输入
  referencepricehighinput: function (e) {
    this.setData({
      referencepricehigh: e.detail.value
    })
  },

  //店铺子分类选择
  checkboxChange: function (e) {
    console.log('wocanimamaa', e.detail.value)
    this.setData({
      chooseclassifychild: e.detail.value
    })
  },

  //店铺风格选择
  shopstyleboxChange: function (e) {
    console.log('aaaaaaaa', e.detail.value)
    this.setData({
      chooseshopstyle: e.detail.value
    })
  },

  //协议须知选中
  selected: function () {
    this.setData({
      Isselected: 0,
      disabled: true,
    })
  },
  //协议须知未选中
  noselected: function () {
    this.setData({
      Isselected: 1,
      disabled: false,
    })
  },

  //商家服务协议
  merchantsdeal: function () {
    wx.navigateTo({
      url: '/pages/mine/merchantsdeal/merchantsdeal',
    })
  },

  //确定
  confirm: function () {
    funconfirm(this)
  },
})


function getcitylist(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/classify/getAllDistrict',
    'POST',
    {

    }
  )
  aa.then(res => {
    console.log('获取所有的地区', res.data)
    if (res.data.result) {
      that.setData({
        city: res.data.result
      })
    }
  })
}


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


function getshopstyle(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/classify/getAllStyle',
    'POST',
    {

    }
  )
  aa.then(res => {
    console.log('获取店铺风格', res.data)
    if (res.data.result) {
      that.setData({
        shopstyle: res.data.result
      })
    }
  })
}


function funconfirm(that) {

  if (!that.data.cityindex) {
    wx.showModal({
      title: '提示',
      content: '请选择城市',
      showCancel: false
    })
    return;
  }

  if (!that.data.shopname) {
    wx.showModal({
      title: '提示',
      content: '请输入店名',
      showCancel: false
    })
    return;
  }

  if (!that.data.shopindex) {
    wx.showModal({
      title: '提示',
      content: '请选择店铺类型',
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


  if (!that.data.address) {
    wx.showModal({
      title: '提示',
      content: '请输入地址',
      showCancel: false
    })
    return;
  }

  if (that.data.chooseshopstyle.length <= 0) {
    wx.showModal({
      title: '提示',
      content: '请选择店铺风格',
      showCancel: false
    })
    return;
  }

  if (!that.data.shopdescribe) {
    wx.showModal({
      title: '提示',
      content: '请输入店铺简介',
      showCancel: false
    })
    return;
  }


  if (!that.data.name) {
    wx.showModal({
      title: '提示',
      content: '请输入姓名',
      showCancel: false
    })
    return;
  }
  if (!that.data.phone) {
    wx.showModal({
      title: '提示',
      content: '请输入联系电话',
      showCancel: false
    })
    return;
  }


  if (!that.data.referenceprice) {
    wx.showModal({
      title: '提示',
      content: '请输入最低参考价格',
      showCancel: false
    })
    return;
  }

  if (!that.data.referencepricehigh) {
    wx.showModal({
      title: '提示',
      content: '请输入最高参考价格',
      showCancel: false
    })
    return;
  }



  //点击申请之后，做个限制，防止多次点击，造成申请多次
  that.setData({
    Issuccess: 1
  })

  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/secondApplyShop',
    'POST',
    {
      secondid:that.data.secondSaleApplyuserID,
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      shopAvator: that.data.headimgurl,
      districtId: that.data.city[that.data.cityindex].id,
      shopName: that.data.shopname,
      classifyId: that.data.shoplist[that.data.shopindex].shopid,
      shopLoc: that.data.address,
      shopIntro: that.data.shopdescribe,
      shopTel: that.data.phone,
      licensePic: that.data.businessimgurl,
      shopInfoPic: that.data.detailimgurl,
      styleId: that.data.chooseshopstyle,
      classifyId: that.data.chooseclassifychild,
      pclassify: that.data.shopclassify[that.data.shopclassifyindex].id,
      realName: that.data.name,
      latitude: wx.getStorageSync("latitude"),
      longitude: wx.getStorageSync("longitude"),
      lowerLimit: that.data.referenceprice,
      higherLimit: that.data.referencepricehigh,
    }
  )
  aa.then(res => {
    console.log('店长申请店铺', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '申请成功',
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
    } else {
      wx.showModal({
        title: '提示',
        content: res.data.errmsg,
        showCancel: false
      })
      that.setData({
        Issuccess: 0
      })
    }
  })
}
