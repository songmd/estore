//app.js
App({
  onLaunch: function () {
    // 获取用户信息
    let that = this
    wx.getUserInfo({
      success: function (res) {
        wx.setStorageSync('user_info', res.userInfo)
        console.log(res.userInfo)
        that.server.login()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  server: require('utils/server.js'),
})