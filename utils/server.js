Server = {
  serverUrl: 'http://127.0.0.1:8000/estore',
  shopId: '70473716522e4d24932d3b0fdf71d736',
  user_token: wx.getStorageSync('user_token'),
  //登陆微信服务器及应用服务器
  login: function (obj) {
    let that = this
    if (!obj)
      obj = {}
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        that._loginServer({
          user_token: that.user_token
        }, obj.success, obj.fail)
      },
      fail: function () {
        //登录态过期
        wx.login({
          success: function (res) {
            if (res.code) {
              //发起网络请求
              that._loginServer({
                js_code: res.code
              }, obj.success, obj.fail)
            } else {
              console.log('获取用户登录态失败！' + res)
              if (obj.fail)
                obj.fail()
            }
          },
          fail: function (res) {
            console.log('wx.login fail！' + res)
            if (obj.fail)
              obj.fail()
          }
        })
      }
    })
  },

  //获取店铺信息
  shopDetail: function (obj) {
    if (!obj)
      obj = {}
    let url = `${this.serverUrl}/shops/${this.shopId}.json/`
    this._requestHelper(url, {}, 'GET', obj.success, obj.fail)
  },
  //获取所有产品
  listProduct: function (obj) {
    if (!obj)
      obj = {}
    let url = `${this.serverUrl}/products.json/`
    data = {
      shop_id: this.shopId
    }
    this._requestHelper(url, data, 'GET', obj.success, obj.fail)
  },
  //获取所有订单
  listOrder: function (obj) {
    if (!obj)
      obj = {}
    if (!this.user_token) {
      if (obj.fail)
        obj.fail()
      return
    }
    let url = `${this.serverUrl}/order/${this.user_token}.json/`
    this._requestHelper(url, {}, 'GET', obj.success, obj.fail)
  },
  //下单
  giveOrder: function (obj) {
    if (!obj)
      obj = {}
    //需要先登陆
    if (!this.user_token) {
      if (obj.fail)
        obj.fail()
      return
    }
    let url = `${this.serverUrl}/order/${this.user_token}.json/`
    this._requestHelper(url, obj.order, 'POST', obj.success, obj.fail)
  },
  askForPay: function (obj) {
    if (!obj)
      obj = {}
    let url = `${this.serverUrl}/askforpay/`
    this._requestHelper(url, obj.order_no, 'GET', obj.success, obj.fail)
  },
  //登陆辅助函数
  _loginServer: function (data, onSuccess, onFail) {
    let that = this
    let url = `${that.serverUrl}/login/`
    let reqData = Object.assign({
      shop_id: that.shopId,
      user_info: wx.getStorageSync('user_info'),
    }, data)
    that._requestHelper(url, reqData, 'GET', function (resData) {
      if (resData.retcode == '0000') {
        if ('user_token' in resData) {
          that.user_token = resData['user_token']
          wx.setStorageSync('user_token', that.user_token)
        }
        if (onSuccess) {
          onSuccess()
        }
      } else if (onFail) {
        onFail()
      }
    }, onFail)
  },
  _requestHelper: function (url, data, method, onSuccess, onFail) {
    wx.request({
      url: url,
      data: data,
      method: method,
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (onSuccess) {
            onSuccess(res.data)
            return
          }
        }
        if (onFail) {
          onFail()
        }
      },
      fail: function () {
        if (onFail) {
          onFail()
        }
      }
    })
  }
}

module.exports = Server