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

module.exports = {
  throttle: throttle
}
