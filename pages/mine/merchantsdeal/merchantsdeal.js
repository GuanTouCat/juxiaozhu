// pages/mine/merchantsdeal/merchantsdeal.js
var tool = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   html:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户协议
    getUserProcotol(this)

    wx.downloadFile({
      url: 'https://tango007.heeyhome.com/upload/15277/juxiaozhushanghuxieyi.pdf',
      success: function (res) {
        console.log(res)
        var Path = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          success: function (res) {
            console.log('打开成功');
          }
        })
      },
      fail: function (res) {
        console.log(res);
      }
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
})

function getUserProcotol(that) {
  var aa = tool.request(
    getApp().globalData.url + '/rzapi/user/getUserProcotol',
    'POST',
    {

    }
  )
  aa.then(res => {
    console.log('获取用户协议', res.data)
    if (res.data.result) {
      that.setData({
        html: res.data.result.content.replace('<img', '<img style="max-width:100%;height:auto" ') //防止富文本图片过大,
      })
    }
  })
}