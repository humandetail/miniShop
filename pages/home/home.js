// pages/home/home.js

import Home from '../../model/home.js';

const homeModel = new Home();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    recommend: []
  },

  onLoad () {
    this.getMultiData();
  },

  // 获取首页Banner以及Recommend数据
  getMultiData () {
    homeModel.getMultiData().then(this.getMultiDataSucc);
  },

  // 获取数据成功
  getMultiDataSucc (res) {
    res = res.data;
    if (res.errCode === 1) {
      const data = res.data;
      const { banner, recommend } = data;

      console.log(banner)
      console.log(recommend)

      this.setData({
        banner,
        recommend
      })
    }
  }
})