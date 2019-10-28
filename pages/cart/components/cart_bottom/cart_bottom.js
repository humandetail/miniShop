// pages/cart/components/cart_bottom/cart_bottom.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    total: {
      type: Number,
      value: 0
    },
    selectedNumber: {
      type: Number,
      value: 0
    },
    selectedAll: {
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
    handleSelectAll () {
      this.triggerEvent('selectAll', {}, {});
    }
  }
})
