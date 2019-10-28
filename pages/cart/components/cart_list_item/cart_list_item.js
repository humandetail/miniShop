// pages/cart/components/cart_list_item/cart_list_item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemInfo: {
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
    handleNumberMinus () {
      this._triggerEvent('minus', {});
    },
    handleNumberPlus () {
      this._triggerEvent('plus', {});
    },
    handleSelectedChange () {
      this._triggerEvent('selectedChange', {})
    },
    handleRemove () {
      this._triggerEvent('remove', {})
    },
    _triggerEvent (type, value) {
      this.triggerEvent('itemChange', {
        type,
        value
      }, {});
    }
  }
})
