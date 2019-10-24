// pages/category/components/category-content/category-content.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    winHeight: {
      type: Number,
      value: 0
    },
    titles: {
      type: Array,
      value: []
    },
    subList: {
      type: Array,
      value: []
    },
    detailInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChangeTabIndex(e) {
      const index = e.detail.index;
      this.triggerEvent('changeTabIndex', { index }, {})
    },

    handleScrollToLower () {
      this.triggerEvent('scrollToLower', {}, {});
    }
  }
})
