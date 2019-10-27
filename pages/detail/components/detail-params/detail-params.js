// pages/detail/components/detail-params/detail-params.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    params: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        // console.log(newVal, oldVal)
        if (newVal && (newVal + '' !== '{}')) {
          this._paramsChange(newVal);
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    detailParams: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _paramsChange (val) {
      // 格式化数据
      let info = {};
      for (let key in val) {
        let item = val[key];
        if (key === 'rule') {
          let tables = item.tables;
          if (tables.length > 1) {
            let tableArr = tables.reduce((prev, curr) => {
              // console.log(prev, curr)
              
              return prev.map((item, index) => {
                curr[index].shift();
                // console.log(item, index, curr[index])
                item.push(...curr[index]);
                return item;
              });
            });

            val[key].tables = tableArr;
          }

        }
        info[key] = val[key];
      }

      // console.log(info.rule.tables);

      this.setData({
        detailParams: info
      });
    }
  }
})
