// components/common-picker/common-picker.js
Component({

  options: {
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    needBtn: {
      type: Boolean,
      value: false
    },
    show: {
      type: Boolean,
      value: false,
      observer (newVal) {
        // console.log(newVal)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollHeight: 0,
  },

  lifetimes: {
    attached () {
      const _this = this;
      wx.getSystemInfo({
        success: function(res) {
          const windowHeight = res.windowHeight,
                scrollHeight = windowHeight * 0.7 - 100;

          _this.setData({
            scrollHeight
          });
        },
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlePickerClose () {
      this.triggerEvent('closePicker', {}, {});
    }
  }
})
