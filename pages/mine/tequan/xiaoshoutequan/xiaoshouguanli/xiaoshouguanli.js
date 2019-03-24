// pages/mine/tequan/dianzhangtequan/dianzhangteqaun.js
var util = require('../../../../../utils/util.js');
var tool = require('../../../../../utils/request.js');
var uploadImage = require('../../../../../utils/uploadFile.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ["店铺信息修改", "发布活动", "店员审核", "图片展示", "数据展示"],
    current: 0,//当前选中的Tab项

    tabList1: ["蓄水券发布", "店铺活动发布", "系统抵用券修改"],
    current1: 0,//当前选中的Tab项
    //活动开始时间
    startdate: '',
    enddate: '',
    //优惠券使用时间
    couponsstartdate: '',
    couponsenddate: '',
    //活动名称
    activityname: '',
    //优惠券名称
    couponsname: '',
    //优惠券内容
    couponscontent: '',
    //份数
    couponsnum: '',
    //售价
    couponsprice: '',
    //满减金额
    fullreductionprice: '',
    //折扣金额
    discountprice: '',
    //店长数据展示
    datalist: '',
    //店长图片展示
    piclist: [],
    //店长上传图片
    uploadpic: [],
    //待审核店员列表
    checkpending: [],


    // 店铺修改信息
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
    //修改店铺的ID
    changeshopid: '',

    //店铺活动发布上传图片
    shopactimg: '',
    //判断店铺活动图片是否上传,1已上传，0未上传
    uploadshopactimg: 0,
    //店铺活动内容输入
    shopactcontent: '',

    //抵用券使用张数列表
    voucherslist: ['1', '2', '3', '4', '5'],
    //抵用券使用张数下标
    voucherslistindex: '',
    //店铺抵用券详情信息
    vouchersdetail: '',

    //销售管理店铺老板userID
    shopbossuserid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //先获取当前的日期，在没有订单的时候点击重试，需要用到这个参数
    var time1 = util.formatTime1(new Date());
    this.setData({
      startdate: time1,
      enddate: time1,
      couponsstartdate: time1,
      couponsenddate: time1,
    });

    if(options.shopbossuserid){
          this.setData({
            shopbossuserid: options.shopbossuserid
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
    //获取店长数据展示
    getdatalist(this)
    //获取店长图片展示
    getpiclist(this)
    //获取店员待审核列表
    getcheckpending(this)

    //获取城市列表
    getcitylist(this)
    //获取店铺分类
    getshopclassify(this)
    //获取店铺风格
    getshopstyle(this)
    //获取店铺基本信息
    getShopBasic(this)

    //获取店铺抵用券详情
    getvouchersdetail(this)
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
  },

  //二级筛选
  tabItemClick1: function (e) {
    this.setData({
      current1: e.currentTarget.dataset.pos,
    })
  },

  StartDateChange: function (e) {
    this.setData({
      startdate: e.detail.value
    });
    if (this.data.startdate && this.data.enddate) {
      if (this.data.startdate <= this.data.enddate) {

      }
      if (this.data.startdate > this.data.enddate) {
        wx.showModal({
          title: '提示',
          content: '起始日期大于结束日期',
          showCancel: false
        })
        return;
      }
    }
  },

  EndDateChange: function (e) {
    this.setData({
      enddate: e.detail.value
    });
    if (this.data.startdate && this.data.enddate) {
      if (this.data.startdate <= this.data.enddate) {

      }
      if (this.data.startdate > this.data.enddate) {
        wx.showModal({
          title: '提示',
          content: '起始日期大于结束日期',
          showCancel: false
        })
        return;
      }
    }
  },


  couponsStartDateChange: function (e) {
    this.setData({
      couponsstartdate: e.detail.value
    });
    if (this.data.couponsstartdate && this.data.couponsenddate) {
      if (this.data.couponsstartdate <= this.data.couponsenddate) {

      }
      if (this.data.couponsstartdate > this.data.couponsenddate) {
        wx.showModal({
          title: '提示',
          content: '起始日期大于结束日期',
          showCancel: false
        })
        return;
      }
    }
  },

  couponsEndDateChange: function (e) {
    this.setData({
      couponsenddate: e.detail.value
    });
    if (this.data.couponsstartdate && this.data.couponsenddate) {
      if (this.data.couponsstartdate <= this.data.couponsenddate) {

      }
      if (this.data.couponsstartdate > this.data.couponsenddate) {
        wx.showModal({
          title: '提示',
          content: '起始日期大于结束日期',
          showCancel: false
        })
        return;
      }
    }
  },
  //活动名称输入
  activityname: function (e) {
    this.setData({
      activityname: e.detail.value
    })
  },
  //优惠券名称输入
  couponsname: function (e) {
    this.setData({
      couponsname: e.detail.value
    })
  },
  //优惠券内容
  couponscontent: function (e) {
    this.setData({
      couponscontent: e.detail.value
    })
  },
  //份数输入
  couponsnum: function (e) {
    this.setData({
      couponsnum: e.detail.value
    })
  },
  //售价输入
  couponsprice: function (e) {
    this.setData({
      couponsprice: e.detail.value
    })
  },
  //满减金额输入
  fullreductionprice: function (e) {
    this.setData({
      fullreductionprice: e.detail.value
    })
  },
  //折扣金额输入
  discountprice: function (e) {
    this.setData({
      discountprice: e.detail.value
    })
  },
  //活动确认发布
  confirmrelease: function () {
    funrelease(this)
  },

  //店长删除图片
  deletepic: function (e) {
    var picid = e.currentTarget.dataset.picid
    var that = this
    wx.showModal({
      title: '提示',
      content: '您确定要删除该图片吗',
      confirmText: '删除',
      cancelText: '取消',

      success: function (res) {
        if (res.confirm) {
          console.log('用户点击删除')
          fundeletepic(that, picid)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

    //上传店铺图片
    joinPicture1: function (e) {
        // var picnum = e.currentTarget.dataset.picnum
        this.setData({
            uploadpic:[]
        })
        wx.chooseImage({
            count: 9, // 默认最多一次选择9张图
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: res => {
                console.log(res)
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths;
                console.log('我选择上传了几张'+ res.tempFilePaths);
                let nowTime = util.formatTime(new Date());
                //支持多图上传
                for (let i = 0; i < tempFilePaths.length; i++) {
                    //显示消息提示框
                    wx.showLoading({
                        title: '上传中' + (i + 1) + '/' + tempFilePaths.length,
                        mask: true
                    });
                    uploadImage(tempFilePaths[i], 'cbb/' + nowTime + '/',
                        result => {
                            wx.showToast({
                                title: '上传成功',
                                icon: 'success',
                                duration: 1000
                            })
                            this.data.uploadpic.push(result);
                            funuploadpic(this, result)
                        },
                        result =>{
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



    //店铺发布活动选择照片
  joinPicture2: function (e) {
    var that = this
    var picnum = e.currentTarget.dataset.picnum
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
                shopactimg: result,
                uploadshopactimg: 1,
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

  //店长审核店员
  auditassistant: function (e) {
    var status = e.currentTarget.dataset.status
    var turnoverid = e.currentTarget.dataset.turnoverid
    var shopid = e.currentTarget.dataset.shopid
    var userid = e.currentTarget.dataset.userid
    var realname = e.currentTarget.dataset.realname
    funauditassistant(this, status, turnoverid, shopid, userid,realname)
  },
  //移交店长
  turnover: function () {
    wx.navigateTo({
      url: '/pages/mine/tequan/xiaoshoutequan/xiaoshouyijiao/xiaoshouyijiao?' + this.data.shopbossuserid,
    })
  },



  //选择照片
  joinPicture: function (e) {
    var that = this
    var picnum = e.currentTarget.dataset.picnum
    var imgtype = e.currentTarget.dataset.type  //1.头像，2.营业执照，3.详情图
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
    this.setData({
      chooseclassifychild: e.detail.value
    })
  },

  //店铺风格选择
  shopstyleboxChange: function (e) {
    this.setData({
      chooseshopstyle: e.detail.value
    })
  },

  //修改店铺信息
  shopinforchange: function () {
    funconfirm(this)
  },

  //店铺活动发布
  shopactrelease: function () {
    funshopactrelease(this)
  },

  //店铺活动内容输入
  shopactcontent: function (e) {
    this.setData({
      shopactcontent: e.detail.value
    })
  },

  //抵用券数选择
  voucherschange: function (e) {
    this.setData({
      voucherslistindex: e.detail.value,
    })
  },

  //抵用券张数修改
  vouchersrelease: function () {
    funvouchersrelease(this)
  },

})


function funrelease(that) {
  if (!that.data.activityname) {
    wx.showModal({
      title: '提示',
      content: '请输入活动名称',
      showCancel: false
    })
    return;
  }


  if (!that.data.couponsname) {
    wx.showModal({
      title: '提示',
      content: '请输入优惠券名称',
      showCancel: false
    })
    return;
  }

  if (!that.data.couponscontent) {
    wx.showModal({
      title: '提示',
      content: '请输入优惠券内容',
      showCancel: false
    })
    return;
  }


  if (!that.data.couponsnum) {
    wx.showModal({
      title: '提示',
      content: '请输入份数',
      showCancel: false
    })
    return;
  }

  if (!that.data.couponsprice) {
    wx.showModal({
      title: '提示',
      content: '请输入售价',
      showCancel: false
    })
    return;
  }


  if (!that.data.fullreductionprice) {
    wx.showModal({
      title: '提示',
      content: '请输入满减金额',
      showCancel: false
    })
    return;
  }


  if (!that.data.discountprice) {
    wx.showModal({
      title: '提示',
      content: '请输入折扣金额',
      showCancel: false
    })
    return;
  }


  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/publishActivity',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: that.data.shopbossuserid,
      actname: that.data.activityname,
      actcontent: that.data.couponscontent,
      starttime: that.data.startdate,
      endtime: that.data.enddate,
      goodsName: that.data.couponsname,
      goodsStart: that.data.couponsstartdate,
      goodsEnd: that.data.couponsenddate,
      goodsPrice: that.data.couponsprice,
      priceCondition: that.data.fullreductionprice,
      priceDiscount: that.data.discountprice
    }
  )
  aa.then(res => {
    console.log('店长发布活动', res.data)
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
    } else {
      wx.showModal({
        title: '提示',
        content: res.data.errmsg,
        showCancel: false
      })
    }
  })
}


function getdatalist(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/viewShopSalePandect',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: that.data.shopbossuserid,
    }
  )
  aa.then(res => {
    console.log('获取店长数据展示', res.data)
    if (res.data.success == 1) {
      that.setData({
        datalist: res.data.result
      })
    }
  })
}


function getpiclist(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/viewShopInfoPic',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: that.data.shopbossuserid,
    }
  )
  aa.then(res => {
    console.log('获取店长图片展示', res.data)
    if (res.data.success == 1) {
      that.setData({
        piclist: res.data.result
      })
    }
  })
}

function fundeletepic(that, picid) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/operateShopInfoPic',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: that.data.shopbossuserid,
      pid: picid,
    }
  )
  aa.then(res => {
    console.log('店长删除图片', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1500
      })
      getpiclist(that)
    }
  })
}



function funuploadpic(that, result) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/uploadShopInfoPic',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: that.data.shopbossuserid,
      pics: result,
    }
  )
  aa.then(res => {
    console.log('店长上传店铺图片', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 1500
      })
      getpiclist(that)
    }
  })
}


function funauditassistant(that, status, turnoverid, shopid, userid,realname) {
  console.log('wcaoniamama', turnoverid)
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/operateApplyList',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: userid,
      id: turnoverid,
      status: status,
      shopid: shopid,
      realname: realname,
    }
  )
  aa.then(res => {
    console.log('店长审核店员', res.data)
    if (res.data.success == 1) {
      getcheckpending(that)
    }
  })
}


function getcheckpending(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/empApplyList',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: that.data.shopbossuserid,
    }
  )
  aa.then(res => {
    console.log('获取待审核店员', res.data)
    if (res.data.success == 1) {
      that.setData({
        checkpending: res.data.result
      })
    }
  })
}



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

  var districtId = ''
  if (that.data.cityindex != '') {
    districtId = that.data.city[that.data.cityindex].id
  }

  var classifyId = ''
  if (that.data.shopindex != '') {
    classifyId = that.data.shoplist[that.data.shopindex].shopid
  }

  var pclassify = ''
  if (that.data.shopclassifyindex != '') {
    pclassify = that.data.shopclassify[that.data.shopclassifyindex].id
  }

  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/editShopBasic',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: that.data.shopbossuserid,
      id: that.data.changeshopid,
      shopAvator: that.data.headimgurl,
      districtId: districtId,
      shopName: that.data.shopname,
      classifyId: classifyId,
      shopLoc: that.data.address,
      shopIntro: that.data.shopdescribe,
      shopTel: that.data.phone,
      licensePic: that.data.businessimgurl,
      shopInfoPic: that.data.detailimgurl,
      styleId: that.data.chooseshopstyle,
      classifyId: that.data.chooseclassifychild,
      pclassify: pclassify,
      realName: that.data.name,
      latitude: wx.getStorageSync("latitude"),
      longitude: wx.getStorageSync("longitude"),
      lowerLimit: that.data.referenceprice,
      higherLimit: that.data.referencepricehigh,
    }
  )
  aa.then(res => {
    console.log('店长修改店铺', res.data)
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
    } else {
      wx.showModal({
        title: '提示',
        content: res.data.errmsg,
        showCancel: false
      })
    }
  })
}

function getShopBasic(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/getShopBasic',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: that.data.shopbossuserid,
    }
  )
  aa.then(res => {
    console.log('获取店铺基本信息', res.data)
    if (res.data.result) {
      that.setData({
        referenceprice: res.data.result.lowerLimit,
        referencepricehigh: res.data.result.higherLimit,
        shopname: res.data.result.shopName,
        address: res.data.result.shopLoc,
        shopdescribe: res.data.result.shopIntro,
        phone: res.data.result.shopTel,
        changeshopid: res.data.result.id
      })
    }
  })
}


function funshopactrelease(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/publishShopAct',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: that.data.shopbossuserid,
      content: that.data.shopactcontent,
      actPic: that.data.shopactimg,
      startTime: that.data.startdate,
      endTime: that.data.enddate,
    }
  )
  aa.then(res => {
    console.log('店铺活动发布', res.data)
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
    } else {
      wx.showModal({
        title: '提示',
        content: res.data.errmsg,
        showCancel: false
      })
    }
  })
}


function getvouchersdetail(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/getUpdateCoupon',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: that.data.shopbossuserid,
    }
  )
  aa.then(res => {
    console.log('获取店铺抵用券详情信息', res.data)
    if (res.data.result) {
      that.setData({
        vouchersdetail: res.data.result
      })
    }
  })
}

function funvouchersrelease(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/privilege/updateCouponUpt',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      id: that.data.vouchersdetail.id,
      usePerTrade: that.data.voucherslist[that.data.voucherslistindex],
    }
  )
  aa.then(res => {
    console.log('系统抵用券修改', res.data)
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
    } else {
      wx.showModal({
        title: '提示',
        content: res.data.errmsg,
        showCancel: false
      })
    }
  })
}
