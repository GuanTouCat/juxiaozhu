// pages/picShare/searchShop/searchShop.js
const ajax = require('../../../utils/requestNew');
const app = getApp();
const getInf = (str, key)=> str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
Page({

    /**
    * 页面的初始数据
    */
    data: {
        enterWord:undefined,
        isEnterWord:false,
        searchList:[],
        searchListCopy:[],
        checkBoxs: [],
        checkedList: [],
        id:undefined,
        roomId: undefined
    },
    enterInput(e) {//监听正在输入行为获取输入值
        console.log(e);
        this.setData({
            enterWord: this.trim(e.detail.value),
        });
        if (e.detail.cursor > 0) {
            this.setData({
                isEnterWord:true
            })
        }else {
            this.setData({
                isEnterWord:false
            })
        }
        this.searchTap()
    },
    clickResult(e) {//点击搜索结果
        let shopName = e.currentTarget.dataset.shopname;
        let checkedList = this.data.checkedList;
        let currentId = e.currentTarget.dataset.id;
        let checkBoxs = this.data.checkBoxs;
        let index = this.data.index;
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];  //上一个页面
        let addRoom = prevPage.data.addRoom;
        let editRoom = prevPage.data.editRoom;//取上页data里的数据也可以修改
        let isSelect = checkedList.filter(item =>{
            if (this.data.roomId == item.roomId) {
                return item
            }
        });
        console.log(isSelect[0])
        if (isSelect.length <= 0 || !this.data.id){//增加
            console.log('我是增加')
            let checkedListCell = {};
            checkedListCell.roomId = this.data.roomId;
            checkedListCell.shopName = shopName;
            checkedListCell.shopId = currentId || 0;
            checkedList.push(checkedListCell);
            addRoom.push(checkedListCell)
            prevPage.setData({addRoom})//设置数据
        } else if(this.data.id){//修改
            isSelect[0].id = this.data.id;
            isSelect[0].shopName = shopName;
            isSelect[0].shopId = currentId || 0;
            delete isSelect[0].pattern;
            editRoom.push(isSelect[0])
            prevPage.setData({editRoom})//设置数据
        }
        checkBoxs[index].shopName = shopName;
        checkBoxs[index].shopId = currentId;
        wx.setStorageSync('checkBoxs', checkBoxs);
        wx.setStorageSync('checkedList', checkedList);
        wx.navigateBack({
            delta: 1
        })
    },
    searchTap: function () {//搜索关键字
        this.getSearchList();
        let data = this.data.searchList;
        let newData = this.data.searchListCopy;
        for (let i = 0; i < data.length; i++) {
            let dic = data[i];
            let newDic = newData[i];
            let name = dic["name"];
            newDic["name"] = getInf(name, this.data.enterWord);
        }
        this.setData({
            searchListCopy: newData,
        })
    },
    trim: function (s) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    },
    getSearchList() {
        let url = app.globalData.url + '/rzapi/shop/searchShopBrief';
        let data = {
            openId: wx.getStorageSync('openid'),
            shopName: this.data.enterWord
        };
        ajax.postAjax(url, data).then(res =>{
            let shopSearchList = res.data.result;
            // ShopSearchList.map(item =>{
            //     return item.shopName
            // })
            this.setData({
                searchList: shopSearchList,
                searchListCopy: shopSearchList
            })
        })
    },
    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        this.setData({
            location:wx.getStorageSync('location'),
            index:options.index,
            id: options.id,
            roomId: options.roomId
        });
        console.log(options.id)
        // let checkBoxs = this.data.checkBoxs;
        // let index = options.index;
        // checkBoxs[index].checked = options.checked;
        // this.setData({
        //     checkBoxs
        // })

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
        this.setData({
            checkBoxs:wx.getStorageSync('checkBoxs'),
            checkedList: wx.getStorageSync('checkedList') || this.data.checkedList
        })
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
