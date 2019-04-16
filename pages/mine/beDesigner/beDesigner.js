// pages/mine/beDesigner/beDesigner.js
const ajax = require('../../../utils/requestNew');
const app = getApp();
let myName  =/^([\u4e00-\u9fa5]{2,5})$/;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: undefined,
        ID: undefined
    },
    testID (id) {
    // 1 "验证通过!", 0 //校验不通过
        let format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    //号码规则校验
    if(!format.test(id)){
        wx.showToast({
            title: '身份证号码不合规',
            icon:'none'
        })
        return
    }
    //区位码校验
    //出生年月日校验   前正则限制起始年份为1900;
    let year = id.substr(6,4),//身份证年
        month = id.substr(10,2),//身份证月
        date = id.substr(12,2),//身份证日
        time = Date.parse(month+'-'+date+'-'+year),//身份证日期时间戳date
        now_time = Date.parse(new Date()),//当前时间戳
        dates = (new Date(year,month,0)).getDate();//身份证当月天数
    if(time>now_time||date>dates){
        wx.showToast({
            title: '出生日期不合规',
            icon:'none'
        })
        return
    }
    //校验码判断
    let c = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);   //系数
    let b = new Array('1','0','X','9','8','7','6','5','4','3','2');  //校验码对照表
    let id_array = id.split("");
    let sum = 0;
    for(let k=0;k<17;k++){
        sum+=parseInt(id_array[k])*parseInt(c[k]);
    }
    if(id_array[17].toUpperCase() != b[sum%11].toUpperCase()){
        wx.showToast({
            title: '身份证校验码不合规',
            icon:'none'
        })
        return
    }
    this.applyDesign()
    },
    designerName(e) {
        let name = e.detail.value;
        this.setData({
            name
        })
    },
    designerID(e) {
        let ID = e.detail.value;
        this.setData({
            ID
        })
    },
    confirm() {
        if (!this.data.name) {
            wx.showToast({
                title: '请输入姓名',
                icon:'none'
            });
            return
        }else if (!myName.test(this.data.name)) {
            wx.showToast({
                title: '格式错误',
                icon:'none'
            });
            return
        } else if (!this.data.ID) {
            wx.showToast({
                title: '请输入身份证号',
                icon:'none'
            });
            return
        }
        this.testID(this.data.ID)
    },
    applyDesign() {
        let url = app.globalData.url + '/rzapi/share/applyDesign';
        let data = {
            openId: wx.getStorageSync('openid'),
            userId: wx.getStorageSync('userid'),
            districtId: wx.getStorageSync('areaid'),
            realName: this.data.name,
            idNo: this.data.ID
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                wx.showToast({
                    title: '校验通过',
                    icon:'none'
                })
            }else {
                wx.showToast({
                    title: res.data.errmsg,
                    icon:'none'
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
