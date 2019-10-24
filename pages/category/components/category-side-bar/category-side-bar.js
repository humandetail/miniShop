// pages/category/components/category-side-bar/category-side-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    winHeight: {
      type: Number,
      value: 0
    },
    currentIndex: {
      type: Number,
      value: 0
    },
    list: {
      type: Array,
      value: []
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
    handleItemClick (e) {
      const index = e.target.dataset.index;
      if (index !== this.data.currentIndex) {
        this.triggerEvent('changeIndex', {
          index
        }, {});
      }
    }
  }
})
