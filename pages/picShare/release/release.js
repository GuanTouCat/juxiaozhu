// pages/picShare/release/release.js
var util = require('../../../utils/util.js');
const uploadImage = require('../../../utils/uploadFile.js');
const ajax = require('../../../utils/requestNew');
const  app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        uploadImgList: [],
        uploadNum:3,//上传图片最多数量
        changeNum:1,//更换图片的数量
        checkBoxs: [],
        oldCheckBoxs: [],
        deleteRoom: [],
        addRoom: [],
        editRoom: [],
        checkedObj:{},
        checkedList:[],
        isCorrectData:false
    },
    upLoad(uploadNum, index) {//上传图片
        wx.chooseImage({
            count: uploadNum,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                let tempFilePaths = res.tempFilePaths;
                let nowTime = util.formatTime(new Date());
                let uploadImgList = this.data.uploadImgList;
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
                            });
                            if (index >= 0){//>= 0 则是更换图片
                                uploadImgList.splice(index,1,result);
                                this.setData({
                                    uploadImgList
                                });
                                wx.setStorageSync('uploadImgList', uploadImgList);
                            }else {//只是上传图片
                                uploadImgList.push(result);
                                this.setData({
                                    uploadImgList
                                });
                                console.log(this.data.uploadImgList)
                                wx.setStorageSync('uploadImgList', uploadImgList);
                            }
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
    chooseImgUpload() {//选择图片
        let totalNum = this.data.uploadNum;
        let alreadyNum = this.data.uploadImgList.length;
        let newNum = totalNum - alreadyNum;
        console.log(newNum);
        this.upLoad(newNum)
    },
    changeImg(e){//更换图片
        let index = e.currentTarget.dataset.idx;
        this.upLoad(this.data.changeNum, index)
    },

    clickClassCell(e) {//多选判断
        let index = e.currentTarget.dataset.index;
        let roomId = e.currentTarget.dataset.roomid;
        let id = e.currentTarget.dataset.id;
        console.log(roomId)
        let checkBoxs = this.data.checkBoxs;
        // let checkedObj = {};
        // let checkedList = this.data.checkedList;
        console.log(index);
            if (this.data.uploadImgList.length <= 0 && !this.data.patternId) {//未选中状态判断有没有上传图片并且不是从我的分享进入
                wx.showToast({
                    title: '请先上传照片',
                    icon: 'none'
                })
            }else {
                // wx.setStorageSync('checkedList', this.data.checkedList);
                wx.navigateTo({
                    url: '/pages/picShare/searchShop/searchShop?index=' + index + '&roomId=' + roomId + '&id=' + id
                })
            }
        this.setData({
            checkBoxs,
        });
        // wx.setStorageSync('checkBoxs', checkBoxs);

    },
    getShareSpecific(){//获取房间信息
        let url = app.globalData.url + '/rzapi/share/getShareSpecific';
        let data = {
            openId: wx.getStorageSync('openid'),
            userId: wx.getStorageSync('userid'),
            shareId: this.data.shareId,
            rownum: 0
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                // this.setData({
                //     roomInfoList: res.data.result.roomInfo,
                // });
                let roomInfoList = res.data.result.roomInfo;
                let lastCheckedList = JSON.stringify(roomInfoList).replace(/patternId/g, "roomId");//将接口的patternId改为roomId
                let checkedList = JSON.parse(lastCheckedList);
                console.log(checkedList)
                let lastCheckBoxs = JSON.stringify(this.data.checkBoxs).replace(/id/g, 'roomId');
                let checkBoxs = JSON.parse(lastCheckBoxs);
                console.log(checkBoxs)
                checkedList.map(item =>{//两个数组循环比较取出相同的元素
                    checkBoxs.map(cell =>{
                        if (item.roomId == cell.roomId){
                            let index = checkBoxs.indexOf(cell);
                            checkBoxs.splice(index, 1, item);//如果有相同的就替换
                            this.setData({
                                checkBoxs,
                                checkedList
                            })
                            wx.setStorageSync('checkBoxs', checkBoxs);
                            wx.setStorageSync('checkedList', checkedList);
                        }
                    })
                })
            }
        })
    },
    // clickChooseShop(e) {//点击选择店铺
        // let checked = e.currentTarget.dataset.checked;

        // if (this.data.checkedList.length <= 0){
        //     wx.showToast({
        //         title: '请选择对应物品',
        //         icon:'none'
        //     })
        // }else {
        //     if (checked){

            // } else {
            //     wx.showToast({
            //         title: '请先选择对应物品',
            //         icon:'none'
            //     })
            // }
        // }
    // },
    clickRelease() {//点击立即发布按钮
        // let valueList = this.data.checkedList;
        // let shopNameList = valueList.filter(item => {
        //     return item.shopName
        // });
        // console.log(shopNameList)
        // let roomIdList = valueList.map(item => {
        //     return item.roomId
        // });
        // console.log(roomIdList)
        // if (shopNameList.length < roomIdList.length) {
        //     wx.showToast({
        //         title: '请选择店铺',
        //         icon: 'none'
        //     });
        // }else
        if (this.data.patternId) {//我的分享进来

        }else {
            if (this.data.uploadImgList.length <= 0) {
                wx.showToast({
                    title: '请先上传图片',
                    icon: 'none'
                });
            }else {
                let url = app.globalData.url + '/rzapi/share/insertPicShare';
                let data = {
                    openId: wx.getStorageSync('openid'),
                    userId: wx.getStorageSync('userid'),
                    districtId: wx.getStorageSync('areaid'),
                    pics: this.data.uploadImgList,
                    roomInfos: JSON.stringify(this.data.checkedList),
                    patternId: this.data.tagId
                };
                ajax.postAjax(url, data).then(res=>{
                    if (res.data.success == 1){
                        wx.showToast({
                            title: '发布成功',
                            icon:'none'

                        })
                        //清除缓存为了防止用户多次提交防止作弊
                        wx.removeStorageSync('uploadImgList')
                        wx.removeStorageSync('checkedList')
                        wx.removeStorageSync('checkBoxs')
                        this.setData({
                            uploadImgList:[],
                            checkedList:[],
                            checkBoxs: this.data.oldCheckBoxs
                        })
                    }
                })
            }
        }

    },
    deleteImg(e){//删除图片
        wx.showModal({
            content:'确定要删除吗?',
            success: res=>{
                if (res.confirm) {
                    let index = e.currentTarget.dataset.idx;
                    let arr = this.data.uploadImgList;
                    arr.splice(index, 1);
                    this.setData({
                        uploadImgList: arr
                    })
                    wx.setStorageSync('uploadImgList', arr);
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    deleteRoom(e) {//删除已有选择
        wx.showModal({
            content:'确定要删除吗?',
            success: res=>{
                if (res.confirm) {
                    let id = e.currentTarget.dataset.id;
                    let index = e.currentTarget.dataset.index;
                    let checkBoxs = this.data.checkBoxs;
                    let roomId = e.currentTarget.dataset.roomid;
                    let deleteId = {};
                    let deleteRoom = this.data.deleteRoom;
                    console.log(roomId)
                    let checkedList = this.data.checkedList.filter(item =>{
                        if (item.roomId != roomId)
                            return item
                    });
                    deleteId.id = id;
                    deleteRoom.push(deleteId);
                    delete checkBoxs[index].id;
                    delete checkBoxs[index].shopName;
                    delete checkBoxs[index].shopId;
                    this.setData({
                        checkBoxs,
                        checkedList,
                        deleteRoom
                    });

                    wx.setStorageSync('checkedList', checkedList);
                    wx.setStorageSync('checkBoxs', checkBoxs)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        });

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            tagId: options.tagId || '',
            patternId: options.patternId || '',
            shareId: options.shareId || ''
        });
        let url = app.globalData.url + '/rzapi/share/getPatternSonClassify';
        let data = {
            patternId: this.data.tagId || this.data.patternId
        };
        ajax.postAjax(url, data).then(res =>{
            if (res.data.success == 1){
                let lastCheckBoxs = JSON.stringify(res.data.result).replace(/id/g, 'roomId');
                let checkBoxs = JSON.parse(lastCheckBoxs);
                this.setData({
                    checkBoxs,
                    oldCheckBoxs: checkBoxs
                });
                wx.setStorageSync('checkBoxs', checkBoxs);
            }
        });
        if (this.data.patternId){
            this.getShareSpecific()
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
        this.setData({
            checkBoxs:wx.getStorageSync('checkBoxs') || this.data.checkBoxs,
            checkedList: wx.getStorageSync('checkedList') || this.data.checkedList,
            uploadImgList: wx.getStorageSync('uploadImgList') || this.data.uploadImgList
        });

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
        wx.removeStorageSync('checkedList')
        wx.removeStorageSync('checkBoxs')
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
