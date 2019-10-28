// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigator: [
      {
        icon: '/assets/profile/icons/home.png',
        text: '个人主页'
      },
      {
        icon: '/assets/profile/icons/message.png',
        text: '消息'
      },
      {
        icon: '/assets/profile/icons/collect.png',
        text: '收藏'
      },
      {
        icon: '/assets/profile/icons/attention.png',
        text: '关注'
      },
      {
        icon: '/assets/profile/icons/mark.png',
        text: '足迹'
      }
    ],

    order: [
      {
        icon: '/assets/profile/icons/pay.png',
        text: '待付款'
      },
      {
        icon: '/assets/profile/icons/send.png',
        text: '待发货'
      },
      {
        icon: '/assets/profile/icons/pending.png',
        text: '待收货'
      },
      {
        icon: '/assets/profile/icons/rate.png',
        text: '评价'
      },
      {
        icon: '/assets/profile/icons/after.png',
        text: '退款售后'
      }
    ],

    cartNumber: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    wx.getStorage({
      key: 'cart',
      success: function(res) {
        _this.setData({
          cartNumber: res.data.length
        })
      },
    })
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