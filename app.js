//app.js
App({
  onLaunch: function () {
    // 获取用户信息
    let that = this
    wx.getUserInfo({
      success: res => {
        wx.setStorageSync('user_info', res.userInfo)
        console.log(res.userInfo)
        that.login()
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  login: function (onSuccess, onFail) {
    let that = this
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        that._loginServer({
          user_token: wx.getStorageSync('user_token')
        }, onSuccess, onFail)
      },
      fail: function () {
        //登录态过期
        wx.login({
          success: res => {
            if (res.code) {
              //发起网络请求
              that._loginServer({
                js_code: res.code
              }, onSuccess, onFail)
            } else {
              console.log('获取用户登录态失败！' + res)
              if (onFail)
                onFail()
            }
          },
          fail: res => {
            console.log('wx.login fail！' + res)
            if (onFail)
              onFail()
          }
        })
      }
    })
  },
  _loginServer: function (data, onSuccess, onFail) {
    let that = this
    console.log('begin log server', )
    wx.request({
      url: `${that.serverUrl}/login/`,
      data: Object.assign({
        shop_id: that.shopId,
        user_info: wx.getStorageSync('user_info'),
      }, data),
      success: (res) => {
        console.log('log server done,data:', res.data)
        if (res.data.retcode == '0000') {
          if ('user_token' in res.data) {
            wx.setStorageSync('user_token', res.data['user_token'])
            if (onSuccess)
              onSuccess(res.data['user_token'])
            return
          }
        }
        if (onFail)
          onFail()
      },
      fail: (res) => {
        if (onFail)
          onFail()
      }
    })
  },

  shopId: '70473716522e4d24932d3b0fdf71d736',
  serverUrl: 'http://127.0.0.1:8000/estore',

})