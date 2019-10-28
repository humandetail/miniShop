// components/common-checkbox/common-checkbox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selected: {
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
    handleClick () {
      this.triggerEvent('change', { value: !this.data.selected }, {});
    }
  }
})
