function onLogin() {
  wx.login({
    success: function (res) {
      if (res.code) {    
          //发起网络请求
          wx.request({          
            url: 'Our Server ApiUrl',
            data: {   
                   code: res.code  
            }, 
            success: function (res) {
              const self = this
              if (逻辑成功) {
                //获取到用户凭证 存儲 3rd_session  
                var json = JSON.parse(res.data.Data)  
                wx.setStorage({ 
                   key: "third_Session", 
                   data: json.third_Session
                   })    
                   getUserInfo() 
                 }  
                else {

                }
               }, 
               fail: function (res) {

                }        
              })      
            }    
        }, 
        fail: function (res) { 

        }  
      }) 
    }
