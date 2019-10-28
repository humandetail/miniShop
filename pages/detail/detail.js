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
        type: "detailPage",
        text: "宝贝"
      },
      {
        type: 'detailInfo',
        text: '详情'
      },
      {
        type: 'detailParams',
        text: '参数'
      },
      {
        type: 'detailRecommend',
        text: '推荐'
      }
    ],
    tabPostion: 0,
    currentIndex: 0,
    hideTab: true,
    tabOpacity: 1,
    handleScrollFn: null,
    showPicker: false,
    userSkuInfo: [],
    userSkuNumber: 1,
    selected: null
  },

  onLoad (options) {

    const iid = options.iid || '';
    if (iid === '') {
      throw new Error('加载失败！');
    }

    this.setData({
      iid: iid.trim()
    })

    this._getData(this.data.iid).then(this._getDataSucc);

  },

  onUnload () {
    // 离开页面前，把当前用户选择的内容存本地
    const { userSkuInfo, userSkuNumber, selected, iid } = this.data;
    if (selected) {
      let userSku = wx.getStorageSync('userSku');
      if (userSku) {
        userSku[iid] = { userSkuInfo, userSkuNumber, selected }
      } else {
        userSku = {
          [iid]: { userSkuInfo, userSkuNumber, selected }
        }
      }

      // wx.setStorageSync('userSku', userSku)
      wx.setStorage({
        key: 'userSku',
        data: userSku
      });
    }
  },

  // 滚动设置tabControl的fixed值
  onPageScroll (e) {
    if (!this.data.handleScrollFn) {
      this.data.handleScrollFn = utils.throttle(this._handlePageScroll.bind(this), 16, true);
    }

    this.data.handleScrollFn(e.scrollTop);

    const scrollTop = e.scrollTop;
  },

  // 用户选择分类改变
  handleSkuChange (value) {
    const { index, id, type } = value.detail;
    let userSkuInfo = this.data.userSkuInfo;

    // console.log(index, id, type, userSkuInfo[index])

    userSkuInfo[index].index = userSkuInfo[index].index == id ? -1 : id;

    this.setData({
      userSkuInfo
    });
    this._changeSelected(userSkuInfo);
  },
  _changeSelected (newVal) {
    let len = newVal.length;
    if (len > 0) {
      let sum = newVal.reduce((prev, curr) => {
        return prev + (curr.index === -1 ? 0 : 1)
      }, 0);

      let selected = null;
      if (sum === len) {
        // 用户选择完毕，就当他最多只有两种选择了。。。
        let skuInfo = this.data.detail.skuInfo;
        let idx = 0;
        if (len === 2) {
          idx = (newVal[0].index - 1) * skuInfo.props[1].list.length + (newVal[1].index - 100);
        } else {
          idx = newVal[0].index - 1;
        }
        selected = skuInfo.skus[idx]
      }

      this.setData({
        selected
      })
    }
  },

  // 用户选择数量改变
  handelChangeSkuNumber (e) {
    const num = e.detail.number;
    this.setData({
      userSkuNumber: this.data.userSkuNumber + num
    })
  },
  
  // 添加到购物车事件
  handleAddToCart () {
    const showPicker = this.data.showPicker,
          userSkuInfo = this.data.userSkuInfo,
          selected = this.data.selected,
          userSkuNumber = this.data.userSkuNumber,
          iid = this.data.iid;

    // console.log(showPicker, userSkuInfo)
    if (!selected) { // 用户没选择任何东西
      wx.showToast({
        title: '请选择相关分类~',
        icon: 'none'
      });

      if (!showPicker) {
        this.setData({
          showPicker: true
        });
      }
    } else {
      // console.log(userSkuInfo, selected);
      let cart = wx.getStorageSync('cart');
      let data = {
        iid,
        title: this.data.detail.itemInfo.title,
        shopInfo: this.data.detail.shopInfo,
        userSkuInfo,
        selected,
        userSkuNumber
      }
      if (!cart) {
        cart = [data]
      } else {
        cart.push(data);
      }

      wx.setStorageSync('cart', cart);

      if (showPicker) {
        this.setData({
          showPicker: false
        });
      }

      wx.showToast({
        title: '加入购物车成功',
        icon: 'none'
      });
    }
    
  },

  // 展示选择区域
  handleShowPicker (e) {
    this.setData({
      showPicker: e.detail.show
    })
  },

  _handlePageScroll (scrollTop) {


    if (scrollTop > 0) {

      if (scrollTop < 400) {
        this.setData({
          tabOpacity: scrollTop / 400
        });
      } else {
        if (this.data.tabOpacity < 1) {
          this.setData({
            tabOpacity: 1
          });
        }
      }

      if (this.data.hideTab) { // 当元素是隐藏时
        this.setData({
          hideTab: false
        });
      }

    } else {
      this.setData({
        hideTab: true
      })
    }
  },

  handleChangeTab (e) {
    const index = e.detail.index;
    this.setData({
      currentIndex: index
    });
    wx.pageScrollTo({
      selector: `#${this.data.tabInfo[index].type}`,
      duration: 300
    })
  },
  
  _getData (iid) {
    const data = wx.getStorageSync(iid);

    if (data) {
      this.setData({
        detail: data
      });
      return Promise.resolve();
    } else {
      return Promise.all([this._getDetail(iid), this._getRecommend()]).then(this._getDetailSucc);
    }

    // console.log(this.data.detail.itemParams)
  },

  _getDataSucc () {
    // 初始化用户选择信息
    let skuInfo = this.data.detail.skuInfo.props,
        userSkuInfo = [];

    const userSku = wx.getStorageSync('userSku'),
          iid = this.data.iid;
    // console.log(userSku);
    if (userSku && userSku[iid]) {
      // console.log('sku里面有值', userSku[iid]);
      this.setData(userSku[iid])
    } else {
      skuInfo.forEach(item => {
        userSkuInfo.push({
          label: item.label.replace(/:$/, ''),
          index: -1
        });
      });
      this.setData({
        userSkuInfo
      });
    }

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