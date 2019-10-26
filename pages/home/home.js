// pages/home/home.js

import Home from '../../model/home.js';
import utils from '../../utils/util.js';

const homeModel = new Home();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    recommend: [],
    currentIndex: 0,
    titles: [
      { type: 'new', text: '新品' }, 
      { type: 'pop', text: '流行' }, 
      { type: 'sell', text: '热卖' }
    ],
    homeData: {
      'new': {
        page: 1,
        list: [],
        isEnd: false
      },
      'pop': {
        page: 1,
        list: [],
        isEnd: false
      },
      'sell': {
        page: 1,
        list: [],
        isEnd: false
      }
    },
    // 是否显示回到顶部按钮
    showTopBtn: false,
    showTopBtnPosition: 1000,
    tabBarIsFixed: false,
    // tabBar的位置
    tabBarPosition: 0,
    scollFn: null
  },

  // ------------------ 生命周期 -------------------
  onLoad () {
    this._getData();
  },

  // 加载更多
  onReachBottom () {
    const type = this.data.titles[this.data.currentIndex].type;
    this._getHomeData(type);
  },

  // 页面滚动
  onPageScroll (obj) {
    if (!this.data.scollFn) { // 节流
      this.data.scollFn = utils.throttle(this._handlePageScroll.bind(this), 16, true);
    }

    const tabBarPosition = this.data.tabBarPosition,
          showTopBtnPosition = this.data.showTopBtnPosition,
          scrollTop = obj.scrollTop;

    this.data.scollFn(tabBarPosition, showTopBtnPosition, scrollTop);
  },

  // 页面滚动事件处理
  _handlePageScroll (tabBarPosition, showTopBtnPosition, scrollTop) {
    this.setData({
      tabBarIsFixed: (scrollTop >= tabBarPosition),
      showTopBtn: (scrollTop >= showTopBtnPosition)
    });
  },

  // tab列表切换
  handleTabClick (e) {
    const index = e.detail.index;

    // 返回当前标签的顶部
    // wx.pageScrollTo({
    //   scrollTop: this.data.tabBarPosition,
    //   duration: 300
    // });

    this.setData({
      currentIndex: index
    })
  },

  // 更改tabBarPosition值
  changeTabBarPosition (e) {
    const top = e.detail.top;
    this.setData({
      tabBarPosition: top
    })
  },
  
  // ----------------- 获取数据 ----------------------
  _getData () {
    this._getMultiData();
    const titles = this.data.titles;
    titles.forEach(item => {
      this._getHomeData(item.type)
    });
  },

  // 获取首页Banner以及Recommend数据
  _getMultiData () {
    homeModel.getMultiData().then(this._getMultiDataSucc);
  },

  _getMultiDataSucc (res) {
    res = res.data;
    if (res.errCode === 1) {
      const data = res.data;
      const { banner, recommend } = data;

      this.setData({
        banner,
        recommend
      });
    }
  },

  // 获取首页数据
  _getHomeData (type) {
    const info = this.data.homeData[type];
    const page = info.page,
          isEnd = info.isEnd;

    if (!isEnd) { // 还没结束才取
      homeModel.getData(type, page).then(res => this._getHomeDataSucc(res, type));
    }
  },

  _getHomeDataSucc (res, type) {
    res = res.data;

    if (res.errCode === 1) {
      
      const data = res.data,
            isEnd = res.is_end;

      const homeData = this.data.homeData;

      homeData[type].list.push(...data);
      homeData[type].page += 1;
      homeData[type].isEnd = isEnd;

      this.setData({
        homeData
      })
    }
  }
})