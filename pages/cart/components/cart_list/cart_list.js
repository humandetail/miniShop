// pages/cart/components/cart_list/cart_list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cartInfo: {
      type: Object,
      valur: {}
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
    handleShopSelected (e) {
      this.triggerEvent('shopSelected', {
        index: e.currentTarget.dataset.index
      }, {});
    },
    handleItemChange (e) {
      this.triggerEvent('itemChange', {
        type: e.detail.type,
        value: e.detail.value,
        shopId: e.currentTarget.dataset.shopId,
        itemIndex: e.currentTarget.dataset.itemIndex
      }, {});
    }
  }
})
