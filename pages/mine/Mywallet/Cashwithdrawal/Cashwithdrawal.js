// pages/mine/Mywallet/Cashwithdrawal/Cashwithdrawal.js
var tool = require('../../../../utils/request.js');
const app = getApp()
Page({
  tabItemClick: function (e) {
    console.log(e)
    this.setData({
      current: e.currentTarget.dataset.pos
    })
  },
  atk:function(e) {
    var input=e.detail.value
    if(input){
      this.setData({
        a:1,
      })
    }
    else{
      this.setData({
        a:0,
      })
    }
    this.setData({
      cardvalue: e.detail.value
    })
  },
  atkk: function (e) {
    var inputs = e.detail.value
    if (inputs) {
      this.setData({
       b:1,
      })
    }
    else {
      this.setData({
        b:0,
      })
    }

    this.setData({
      wechatvalue: e.detail.value
    })
  },
  wancheng: function () {
    if(this.data.current == 0){
       this.setData({
         withdrawaltype: 1,
         withdrawalamount:this.data.cardvalue
       })
    } else if (this.data.current == 1){
      this.setData({
        withdrawaltype: 2,
        withdrawalamount: this.data.wechatvalue
      })
    }

    if (this.data.withdrawalamount == 0){
      wx.showModal({
        title: '提示',
        content: '提现金额应大于0元',
        showCancel: false
      })
    } else if (this.data.withdrawalamount > this.data.balance){
      wx.showModal({
        title: '提示',
        content: '余额不足',
        showCancel: false
      })
    } else if (this.data.withdrawalamount <= this.data.balance){
      funwithdrawal(this)
    }
    

  },
  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['转出到银行卡', '转出微信钱包'],
    current:0,
    a:0,
    b:0,
    balance:'',
    //转出银行卡金额
    cardvalue:'',
    //转出微信钱包金额
    wechatvalue:'',
    //提现方式,1.提现到银行卡,2.提现到微信账户
    withdrawaltype:'',
    //提现金额
    withdrawalamount:'',
    //银行卡
    card:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.balance){
        this.setData({
          balance: options.balance
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

  //银行卡输入
  cardinput:function(e){
    card:e.detail.value
  },

  //全部转到银行卡
  cardall:function(){
    this.setData({
      cardvalue:this.data.balance
    })
  },

  //全部转到微信钱包
  wechatall: function () {
    this.setData({
      wechatvalue: this.data.balance
    })
  },
})


function funwithdrawal(that){
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/account/sendWithdrawRequest',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
      userid: wx.getStorageSync('userid'),
      withdrawNum:that.data.withdrawalamount,
      type:that.data.withdrawaltype,
      bankcard:that.data.card,
    }
  )
  aa.then(res => {
    console.log('用户提现', res.data)
    if (res.data.success == 1) {
      wx.showToast({
        title: '提现成功',
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