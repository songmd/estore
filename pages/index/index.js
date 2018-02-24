//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    shopInfo: null,
    products: null,

  },
  onLoad: function (option) {
    let that = this
    console.log(option)
    app.server.shopDetail({
      success: function (shop) {
        that.setData({
          shopInfo: shop
        })
      }
    })
    app.server.listProduct({
      success: function (products) {
        that.setData({
          products: products
        })
      }
    })
    app.server.listOrder()
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