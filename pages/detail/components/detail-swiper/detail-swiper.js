// pages/detail/components/detail-swiper/detail-swiper.js

import utils from '../../../../utils/util.js';

const PAGE_WIDTH = 750;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    images: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    winWidth: 0, // 窗口宽度
    wrapperWidth: 0, // 容器宽度，需要计算
    xList: [], // 存储每一个item对应的translateX值
    translateX: 0,
    slideWidth: 600,
    index: 0,
    gap: 20,
    startPageX: 0,
    duration: 300,
    isMoving: false,
    timer: null,
    touchMoveFn: null
  },

  lifetimes: {
    attached () {
      const _this = this;
      wx.getSystemInfo({
        success (res) {
          _this.data.winWidth = res.windowWidth;
        },
      });

    }
  },


  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化数据
    _handleImageChange () {
      const images = this.data.images,
            len = images.length,
            w = this.data.slideWidth,
            gap = this.data.gap;

      const wrapperWidth = (w + gap) * len - gap;

      let xList = [];
      let num = 0;
      for (let i = 0; i < len; i ++) { // 初始化xList
        if (i === 0) {
          // 第一张
          num = 0;
        } else if (i === len - 1) {
          // 最后一张
          num = wrapperWidth - PAGE_WIDTH;
        }else {
          // 中间的
          num = i * w + (i - 1) * gap - (PAGE_WIDTH - w - gap * 2) / 2
          
        }
        xList.push(num * -1);
      }

      // console.log(xList);

      this.setData({
        wrapperWidth,
        xList
      });
    },

    // 容器移动事件
    _wrapperMove (start, end) {

      let x = end - start;

      this.data.isMoving = true;
      const duration = this.data.duration,
            t = 10; // 计时间隔

      let i = duration / t,
          speed = x / i;

      // console.log(i); return;
      this.data.timer = setInterval(() => {

        let translateX = this.data.translateX + speed;

        this.setData({
          translateX
        });

        i --;

        if (i === 0) {
          clearInterval(this.data.timer);
          this.data.isMoving = false;
        }

      }, t);
    },

    // 手指触摸开始
    handleTouchStart(e) {
      const pageX = e.changedTouches[0].pageX;
      this.data.startPageX = pageX;
    },

    // touchMove函数封装
    _touchMove(pageX) {
      if (pageX < 0) {
        pageX = 0;
      }

      const winWidth = this.data.winWidth;
      if (pageX > winWidth) {
        pageX = winWidth;
      }
      // console.log(pageX);

      const startPageX = this.data.startPageX,
            slideWidth = this.data.slideWidth,
            gap = this.data.gap;

      // 获取当前的index值
      const index = this.data.index;

      // 需要做尺寸转换
      // console.log(pageX, startPageX)
      let distance = PAGE_WIDTH * (pageX - startPageX) / this.data.winWidth;

      // 滑动限制距离
      let max = 0;

      if (index === 0) { // 第一张图片
        if (distance > 0) { // 向左边滑动
          max = PAGE_WIDTH - slideWidth;
        } else {
          max = slideWidth + gap;
        }
      } else if (index === this.data.images.length - 1 ) {
        // 最后一张图片
        if (distance < 0) { // 向左边滑动
          max = PAGE_WIDTH - slideWidth;
        } else {
          max = slideWidth + gap;
        }
      } else {
        max = slideWidth + gap
      }

      if (Math.abs(distance) > max) {
        distance = (distance / Math.abs(distance)) * max;
      }

      this.setData({
        translateX: this.data.xList[index] + distance
      });
    },
    // 手指滑动
    handleTouchMove(e) {
      // console.log(e);
      // return;
      if (!this.data.touchMoveFn) {
        this.data.touchMoveFn = utils.throttle(this._touchMove.bind(this), 16, true);
      }
      this.data.touchMoveFn(e.touches[0].pageX);
    },
    handleTouchEnd(e) {
      if (this.data.isMoving) {
        return;
      }

      const pageX = e.changedTouches[0].pageX,
            startPageX = this.data.startPageX,
            distance = pageX - startPageX; // 手指移动的距离

      const translateX = this.data.translateX, // 当前wrapper移到的距离
            xList = this.data.xList;

      let index = this.data.index;

      // 当手指移动距离超过30的时候触发切换
      if (Math.abs(distance) >= 30) {
        if (distance > 0) { // 手指向右滑动
          if (index > 0) {
            index--;
          }
        } else { // 手指向左滑动
          if (index < xList.length - 1) {
            index++;
          }
        };
      }

      this._wrapperMove(translateX, xList[index])

      this.setData({
        index,
        startPageX: 0
      })
    },
  },

  // 监听数据变化
  observers: {
    images (value) {
      if (value.length > 0) {
        this._handleImageChange();
      }
    }
  }
})
