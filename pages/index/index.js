//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    shopInfo:null,
    products:null,

  },
  onLoad: function (option) {
    let that = this
    console.log(option)
    wx.request({
      url: `${app.serverUrl}/shops/${app.shopId}.json/`,
      success: function(res){
        console.log(res.data)
        that.setData({
          shopInfo:res.data,
        })
      },
    })
    wx.request({
      url: `${app.serverUrl}/products.json/`,
      data: {shop_id: app.shopId},
      success: function(res){
        console.log(res.data)
        that.setData({
          products:res.data,
        })
      },
    })
    order = { product:1,quantity:3,price:0.01}
    that.listOrder()
    // order = {item: [4]}
    // that.giveOrder(order)
    // that.askForPay('')
  },
  listOrder:function() {
    let user_token = wx.getStorageSync('user_token')
    wx.request({
      url: `${app.serverUrl}/order/${user_token}.json/`,
      success: function (res) {
        console.log(res.data)
      },
    })
  },
  giveOrder:function(data){
    let user_token = wx.getStorageSync('user_token')
    wx.request({
      url: `${app.serverUrl}/order/${user_token}.json/`,
      method: 'POST',
      data: data,
      success: function (res) {
        console.log(res.data)
      },
    })
  },
  askForPay:function(order_no){
    
    wx.request({
      url: `${that.serverUrl}/askforpay/`,
      data: {
        order_no: order_no,
      },
      success: (res) => {
        console.log('askForPay done res.data', res.data)
        }
      })
  },
  //事件处理函数
  toDetailsTap: function (e) {
    var id = e.currentTarget.dataset.id;
    let product = JSON.stringify(this.data.products[parseInt(id)])
    wx.navigateTo({
      url: `../productdetail/productdetail?product=${product}`,
    })
  },
})