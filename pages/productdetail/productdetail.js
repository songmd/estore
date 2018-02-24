// pages/productdetail/productdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: null,
    buyNumber: 1,
    buyNumMin: 1,
    buyNumMax: 20,
    price: 0.01,
  },
  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  numJiaTap: function () {
    
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  addShopCar: function () {
    var shopCarInfo = wx.getStorageSync('ShopCarInfo')
    let shopCarItem = {
      name:this.data.product.title,
      number: this.data.buyNumber,
      active:true,
      id:this.data.product.id,
      pic:this.data.product.primary_pic.pic,
      price:(this.data.product.off_price ? this.data.product.off_price:this.data.product.price)
    }
    if(shopCarInfo.length == 0){
      shopCarInfo = [shopCarItem]
    }else{
      shopCarInfo.push(shopCarItem)
    }
    wx.setStorageSync('ShopCarInfo',shopCarInfo)
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
  },
  buyNow: function () {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let product = JSON.parse(options.product)
    wx.setNavigationBarTitle({
      title: product.title,
    })
    this.setData({
      product: product
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {
  //   // console.log()
  //   let product = wx.getStorageSync('product-taped')
  //   wx.setNavigationBarTitle({
  //     title: product.title,
  //   })
  //   this.setData({
  //     product: product
  //   })
  // },
})