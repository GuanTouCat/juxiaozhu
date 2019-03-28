// pages/mine/tequan/dianyuantequan/verificationlist/verificationlist.js
var util = require('../../../../../utils/util.js');
let ajax = require('../../../../../utils/requestNew');
var tool = require('../../../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tabLists:[{type:1,name:'店铺'},{type:2,name:'卖场'}],
    //待核销抵用券
    verificationlist:[],
    code:'',
    //员抵用券是否选中,0未选中,1选中
    selected: 0,
    //已选择的抵用券ID
    choosegoodsid: '',
    //抵用券类型
    type:'',
    //审核回调是否成功,0未成功,1成功
    Issuccess: 0,
      current:0,
      circleCurrent:undefined,
      currentType: 1,
      marketId:'',
      marketType:''
  },
    tabClick(e){
        let currentType = e.currentTarget.dataset.type;
        let current = e.currentTarget.dataset.idx;
        this.setData({
            current,
            currentType
        })
        if (current == 1){
            checkcode(this,2)
        }else {
            checkcode(this,'')
        }
    },
    buyMallTicket(e){
      let circleCurrent = e.currentTarget.dataset.idx;
      let id = e.currentTarget.dataset.id;
      let marketType = e.currentTarget.dataset.type;
      this.setData({
          circleCurrent,
          marketId: id,
          marketType
      })
    },
    getMarketList(){
        let url = app.globalData.url + '/rzapi/market/writeOffMarketCoupon';
        let data = {
            openId: wx.getStorageSync('openid'),
            userid: wx.getStorageSync('userid'),
            buyuserid: this.data.code,
        }
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){

            }
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.buyuserid){
        this.setData({
          code: options.buyuserid
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
      //获取待核销列表
    checkcode(this)



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

  //选择抵用券
  choose: function (e) {
    this.setData({
      selected: 1,
      choosegoodsid: e.currentTarget.dataset.id,
      type:e.currentTarget.dataset.type
    })
  },
  //确认核销
  verification:function(){
    funverification(this)
  },

})

function checkcode(that, type) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/coupon/toWriteOffCoupon',
    'POST',
    {
      openId: wx.getStorageSync('openid'),
        userid: wx.getStorageSync('userid'),
      buyuserid: that.data.code,
        type
    }
  )
  aa.then(res => {
    console.log('待核销优惠券列表', res.data)
    if (res.data.success == 1) {
        if (that.data.current == 0){
            that.setData({
                verificationlist:res.data.result,

            })
        } else {
            that.setData({
                marketList:res.data.result
            })
        }

    }
  })
}


function funverification(that) {

  //点击核销之后，做个限制，防止多次点击，造成核销多次
  // that.setData({
  //   Issuccess: 1
  // })
    if (that.data.current == 0){
        var aa = tool.request(
            getApp().globalData.url + '/rzapi/coupon/writeOffCoupon',
            'POST',
            {
                openId: wx.getStorageSync('openid'),
                userid: wx.getStorageSync('userid'),
                id: that.data.choosegoodsid,
                type:that.data.type,
            }
        )
        aa.then(res => {
            console.log('核销抵用券', res.data)
            if (res.data.success == 1) {
                wx.showToast({
                    title: '核销成功',
                    icon: 'success',
                    duration: 1000
                })

                checkcode(that)
            }else{
                wx.showModal({
                    title: '提示',
                    content: '请选择要核销的优惠券',
                    showCancel: false
                })
                // that.setData({
                //     Issuccess: 0
                // })
            }
        })
    } else {
        let url = app.globalData.url + '/rzapi/coupon/writeOffMarketCoupon';
        let data = {
            openId: wx.getStorageSync('openid'),
            userid: wx.getStorageSync('userid'),
            id: that.data.marketId,
            type: that.data.marketType

        }
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                wx.showToast({
                    title: '核销成功',
                    icon: 'success',
                    duration: 1000
                })
                that.setData({
                    circleCurrent:''
                })
                checkcode(that, 2)
            }else {
                wx.showToast({
                    title: '请选择要核销的优惠券',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    }

}
