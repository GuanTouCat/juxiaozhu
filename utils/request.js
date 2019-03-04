// 数据请求
 function request  (url, method, params) {
  let that = this;
  let promis = new Promise(function (resove, reject) {
    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      url: url,
      method: method,
      data: params,
      success: (res) => {
        resove(res);
      },
      fail: (res) => {
        reject(res);
      }
    });
  });
  return promis;
};
module.exports = {
  request: request
};

