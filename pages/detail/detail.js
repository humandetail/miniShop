// pages/detail/detail.js

import Detail from '../../model/detail.js';
import utils from '../../utils/util.js';


const detailModel = new Detail();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iid: '',
    detail: {},
    tabInfo: [
      {
        type: 'detailInfo',
        text: '图文详情'
      },
      {
        type: 'detailParams',
        text: '商品参数'
      },
      {
        type: 'detailRecommend',
        text: '热卖推荐'
      }
    ],
    currentIndex: 0,
    tabFixed: false
  },

  onLoad (options) {

    const iid = options.iid || '';
    if (iid === '') {
      throw new Error('加载失败！');
    }

    this.data.iid = iid.trim();

    this._getData(this.data.iid);
  },

  
  _getData (iid) {
    const data = wx.getStorageSync(iid);

    if (data) {
      this.setData({
        detail: data
      });
    } else {
      Promise.all([this._getDetail(iid), this._getRecommend()]).then(this._getDetailSucc);
    }

    // console.log(this.data.detail.itemParams)
  },

  _getDetail (iid) {
    return detailModel.getDetail(iid)
  },

  _getRecommend () {
    return detailModel.getDetialRecommend();
  },

  _getDetailSucc (res) {
    
    let [detailRes, recommendRes] = res;
    
    detailRes = detailRes.data;
    recommendRes = recommendRes.data;

    if (detailRes.errCode === 1 && recommendRes.errCode === 1) {
      let detail = detailRes.data,
          recommend = recommendRes.data;
  
      const data = utils.formatData(detail);
      data.recommend = recommend;
      this.setData({
        detail: data
      });

      wx.setStorage({
        key: data.iid,
        data: data,
      })

    } else {
      // 数据请求失败，跳回首页
      // wx.showToast({
      //   title: '数据不存在',
      //   success() {
      //   }
      // });
      wx.switchTab({
        url: '/pages/home/home',
        success() {
          // wx.hideToast();
        }
      });
    }
  }
})