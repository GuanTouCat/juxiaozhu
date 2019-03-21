const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// post请求
const postAjax = function (url, data = {}) {
    const promist = new Promise((resolve) => {
        wx.request({
            url: url,
            method: "POST",
            data: data,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                resolve(res)
            }
        })
    })
    return promist;
}

// get请求
const getAjax = function (url, data = {}) {
    const promist = new Promise((resolve) => {
        wx.request({
            url: url,
            method: "GET",
            data: data,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                resolve(res)
            }
        })
    })
    return promist;
}

module.exports = {
    formatTime: formatTime,
    postAjax,
    getAjax,
}
