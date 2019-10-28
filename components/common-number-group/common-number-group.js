// components/common-number-group/common-number-group.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    number: {
      type: Number,
      value: 1
    },
    range: {
      type: Array,
      value: [1, 1]
    },
    size: {
      type: String,
      value: 'default'
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
      this.triggerEvent("minus", {}, {});
    },
    handleNumberPlus () {
      this.triggerEvent("plus", {}, {});
    }
  }
})
