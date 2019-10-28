// pages/cart/cart.js

import Detail from '../../model/detail.js';
import utils from '../../utils/util.js';

const DetailMoDel = new Detail();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartInfo: null,
    recommendInfo: {},
    total: 0,
    selectedNumber: 0,
    selectedAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this._getCartInfo();
    this._getRecommendInfo();
    // console.log(this.data.cartInfo)
  },

  // 当前数据改变，重新计算价格等
  _handleCompute () {
    let cartInfo = this.data.cartInfo;

    // console.log(cartInfo)
    if (!cartInfo) { // 已经没有任何数据
      this.setData({
        total: 0,
        selectedNumber: 0,
        selectedAll: false
      });
      return;
    }

    let l = 0,
        n = 0,
        total = 0,
        selectedNumber = 0;

    for (let shopId in cartInfo) {
      let list = cartInfo[shopId].list,
          len = list.length;

      // 计算当前店铺被选中的数量
      let sum = list.reduce((prev, curr) => {
        if (curr.isSelected) {
          total += curr.nowPrice * curr.number;
          selectedNumber += 1;
          prev += 1;
        }
        return prev
      }, 0);

      if (sum === len) { // 全选了
        cartInfo[shopId].isSelected = true;
      } else {
        cartInfo[shopId].isSelected = false;
      }

      l += 1;
      if (cartInfo[shopId].isSelected) {
        n += 1;
      }

    }

    // 计算全选状态
    let selectedAll = l === n;

    this.setData({
      cartInfo,
      selectedNumber,
      total,
      selectedAll
    });
  },

  // 确认删除商品
  _handleRemoveConfirm (shopId, itemIndex) {
    let cartInfo = this.data.cartInfo;
    
    cartInfo[shopId].list.splice(itemIndex, 1);

    if (cartInfo[shopId].list.length === 0) {
      // 删完了
      delete cartInfo[shopId];
    }

    if (JSON.stringify(cartInfo) === '{}') {
      cartInfo = null;
      wx.removeStorage({key: 'cart'});
    } else {
      // 这里还需要针对缓存里面的cart作处理
    }

    this.setData({
      cartInfo: cartInfo
    });
    this._handleCompute();
  },

  _handleRemove (shopId, itemIndex) {
    const _this = this;
    wx.showModal({
      content: '确定要删除该商品吗',
      cancelText: '再想想',
      confirmColor: '#ff5777',
      success (res) {
        // console.log(res);
        if (res.confirm) { // 确认删除
          _this._handleRemoveConfirm(shopId, itemIndex);
        }
      }
    })
  },

  // 全选
  handleSelectAll () {
    const state = !this.data.selectedAll,
          cartInfo = this.data.cartInfo;

    for (let key in cartInfo) {
      cartInfo[key].list.forEach((item, itemIndex) => {
        this._handleItemSelcetedChange(key, itemIndex, state);
      });
    }

    this.setData({
      selectedAll: state
    });
  },

  // 店铺选择状态改变
  handleShopSelected (e) {
    const index = e.detail.index;
    
    const cartInfo = this.data.cartInfo;

    let state = !cartInfo[index].isSelected

    cartInfo[index].isSelected = state;

    cartInfo[index].list.forEach((item, itemIndex) => { // 子元素全选/全不选
      this._handleItemSelcetedChange(index, itemIndex, state);
    });

    this.setData({
      cartInfo
    });
  },

  // 商品选择状态改变
  _handleItemSelcetedChange (shopId, itemIndex, state) {
    let cartInfo = this.data.cartInfo,
        list = cartInfo[shopId].list,
        len = list.length;

    // console.log(state)
    if (state === undefined) {
      state = !list[itemIndex].isSelected
    }

    // 更改当前商品的选择状态
    cartInfo[shopId].list[itemIndex].isSelected = state;
    this.setData({
      cartInfo
    });

    this._handleCompute();
  },

  // 商品操作更改处理
  handleItemChange (e) {

    const { type, value, shopId, itemIndex } = e.detail;
    switch (type) {
      case 'plus':
      case 'minus':
        this._handleItemNumberChange(type, shopId, itemIndex);
        break;
      case 'remove':
        this._handleRemove(shopId, itemIndex);
        break;
      case 'selectedChange':
        this._handleItemSelcetedChange(shopId, itemIndex);
        break;
      default:
        break;
    }
  },

  // 数量 + 1 - 1
  _handleItemNumberChange (type, shopId, itemIndex) {
    let cartInfo = this.data.cartInfo,
        num = cartInfo[shopId].list[itemIndex].number + (type === 'plus' ? 1 : -1),
        stock = cartInfo[shopId].list[itemIndex].stock;

    // console.log(num, stock)
    if ((type === 'plus' && num <= stock) || (type === 'minus' && num > 0)) {
      let total = this.data.total;

      if (cartInfo[shopId].list[itemIndex].isSelected) {
        // 选中状态才计算价格
        total += (type === 'plus' ? 1 : -1) * cartInfo[shopId].list[itemIndex].nowPrice
      }

      cartInfo[shopId].list[itemIndex].number = num;
      this.setData({
        cartInfo,
        total
      });
    } else {
      wx.showToast({
        title: (type === 'plus' ? '超出数量限制~' : '怎么也得买一件吧~'),
        icon: 'none'
      })
    }
  },


  // 获取购物车数据（本地，没有登录功能）
  _getCartInfo () {
    const cartInfo = wx.getStorageSync('cart');
    if (cartInfo) {
      this.setData({
        cartInfo: this._formatCartInfo(cartInfo)
      });
    }
    // console.log(this.data.cartInfo)
  },

  /**
   * 格式化购物车里面的数据
   * 1、对数据进行店铺分类
   * 2、相同的数据进行数量相加
   */

  _formatCartInfo (info) {
    // console.log(info);

    // 提取店铺信息
    let shopInfo = info.reduce((prev, item) => {
      let {shopId: id, shopLogo: logo, name} = item.shopInfo;

      if (!utils.inArray(prev, 'id', id)) {
        prev.push({
          id,
          name,
          logo
        });
      }
      return prev;
    }, []);

    // 数据归类
    let ret = {};
    shopInfo.forEach(item => {
      let shopId = item.id;
      ret[shopId] = {
        name: item.name,
        logo: item.logo,
        isSelected: false,
        list: []
      };
      info.forEach(infoItem => {
        if (infoItem.shopInfo.shopId === shopId) { // 店铺ID相同
          let sItem = this._simpleData(infoItem);
          ret[shopId].list.push(sItem);
        }
      });
    });

    // 合并相同的数据
    for (let key in ret) {
      let list = ret[key].list;
      // console.log(list);
      let newList = list.reduce((prev, item) => {
        // iid相同以及sku相同
        let iidRes = utils.inArray(prev, 'iid', item.iid),
            skuRes = utils.inArray(prev, 'sku', item.sku);
        if (iidRes && skuRes) {
          iidRes.number += item.number;
        } else {
          prev.push(item);
        }

        return prev;
      }, []);
      // console.log(newList)
      ret[key].list = newList;
    }

    return ret;
  },

  // 简化数据
  // {
  //   iid,
  //   img,
  //   nowPrice,
  //   price,
  //   sku: "颜色：xxx，尺码：yyy",
  //   number: 
  //   stock
  // }
  _simpleData (data) {
    let ret = {
      iid: data.iid,
      title: data.title,
      img: data.selected.img,
      nowPrice: data.selected.nowprice,
      price: data.selected.price,
      number: data.userSkuNumber,
      sku: data.userSkuInfo[0].label + '：' + data.selected.style + '，' + data.userSkuInfo[1].label + '：' + data.selected.size,
      stock: data.selected.stock,
      isSelected: false
    };
    return ret;
  },


  // 获取推荐数据
  _getRecommendInfo () {
    DetailMoDel.getDetialRecommend().then(this._getRecommendInfoSucc);
  },
  _getRecommendInfoSucc (res) {
    res = res.data;
    if (res.errCode === 1) {
      const data = res.data;

      this.setData({
        recommendInfo: data
      });
    }
  }
});