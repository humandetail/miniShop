// pages/home/components/home-data/home-data.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentIndex: {
      type: Number,
      value: 0
    },
    titles: {
      type: Array,
      value: []
    },
    data: {
      type: Object,
      value: {}
    },
    isFixed: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 当前的索引值
    currentIndex: 0
  },

  lifetimes: {
    attached () {
      const query = this.createSelectorQuery();
      query.select('#tab-header').boundingClientRect();
      query.exec(res => {
        this.triggerEvent('changeTabBarPosition', {
          top: res[0].top
        }, {});
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTabClick (e) {
      const index = e.detail.index;
      this.triggerEvent("tabClick", { index }, {});
    }
  }
})
