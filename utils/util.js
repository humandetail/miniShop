// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

function throttle(fn, delay, triggerNow) {
  var t = null,
    beginTime = new Date().getTime();

  return function () {

    var _self = this,
      args = arguments,
      curTime = new Date().getTime(),
      res;

    // 当函数第一次触发的时候立即触发
    if (triggerNow) {
      triggerNow = false;
      beginTime = curTime;
      return fn.apply(_self, args);
    }

    clearTimeout(t);

    if (curTime - beginTime >= delay) {
      res = fn.apply(_self, args);
      beginTime = curTime; // 重置初始时间
    } else {
      t = setTimeout(function () {
        res = fn.apply(_self, args);
      }, delay);
    }
    return res;
  }
}

/** 数据格式化 */
const formatData = data => {
  let newData = {};
  for (let key in data) {
    let item = data[key];

    if (typeof item === 'string') {
      item = item.replace(/\s/g, ''); // 替换所有的空白符，主要是数据会有换行符
      let reg = /(^\{.+\}$)|(^\[.+\]$)/;
      if (reg.test(item)) {
        try {
          item = JSON.parse(item);
        } catch (e) {
          console.log(e);
        }
      }
    }

    newData[key] = item;
  }
  return newData;
}

/**
 * 判断某个值是否在下面类型数组当中
 * [{id:xxx, name: xxx}, {id: yyy, name: yyy}]
 */
const inArray = (array, key, value) => {
  for (let item of array) {
    // console.log(index)
    if (item[key] === value) {
      return item;
    }
  }
  return false;
}

// 数据归类
function dataMap(data, source, key) {
  let ret = {};
  source.forEach(sourceItem => {
    let id = sourceItem.id;
    ret[id] = [];
    data.forEach(dataItem => {
      if (dataItem.sex == id) {
        ret[id].push(dataItem);
      }
    })
  })
  return ret;
}

module.exports = {
  throttle,
  formatData,
  inArray
}
