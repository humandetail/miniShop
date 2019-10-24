// components/common-tab-control/common-tabl-control.js
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
    isFixed: {
      type: Boolean,
      value: false
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
      const index = e.currentTarget.dataset.index;
      if (index !== this.data.currentIndex) { // 标签切换
        // 切换index
        this.triggerEvent("tabClick", { index }, {});
      }
    }
  }
})
