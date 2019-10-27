// pages/detail/components/detail-sku/detail-sku.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    iid: {
      type: String,
      value: ''
    },
    skuInfo: {
      type: Object,
      value: {}
    },
    defaultImg: {
      type: String,
      value: ''
    },
    userSkuNumber: {
      type: Number,
      value: 1
    },
    showPicker: {
      type: Boolean,
      value: false,
    },
    // 用户选择的列表
    userSkuInfo: {
      type: Array,
      value: [],
      observer (newVal) {
        // console.log(newVal)
      }
    },
    selected: {
      type: Object,
      value: null
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
    // 弹出选择框
    handleShowPicker () {
      // this.setData({
      //   showPicker: true
      // });
      this.triggerEvent('showPicker', {
        show: true,
      }, {})
    },
    // 关闭选择框
    handleHidePicker () {
      // this.setData({
      //   showPicker: false
      // });
      this.triggerEvent('showPicker', {
        show: false,
      }, {})
    },

    handlePropClick (e) {
      const { index, id, type } = e.currentTarget.dataset;
      // console.log(index, id, type)
      this.triggerEvent('skuChange', {
        index,
        id,
        type
      }, {});
    },

    // 数量 - 1
    handleNumberMinus() { 
      // console.log('minus')
      this.triggerEvent('changeSkuNumber', {
        number: -1
      }, {})
     },
    // 数量 + 1
    handleNumberPlus () {
      // console.log('plus')
      this.triggerEvent('changeSkuNumber', {
        number: 1
      }, {})
    },

    // 添加到购物车
    handleAddToCart () {
      this.triggerEvent('addToCart', {}, {});
    }
  }
})
