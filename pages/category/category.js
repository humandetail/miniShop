// pages/category/category.js

import Category from '../../model/category.js';

const categoryModel = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    loading: false,
    currentIndex: 0,
    category: [],
    titles: [
      { type: 'new', text: '新品' },
      { type: 'pop', text: '流行' },
      { type: 'sell', text: '热卖' }
    ],
  },

  onLoad (options) {
    this._getData();
    this._getWinHeight();
  },

  // 切换当前分类
  handleChangeIndex (e) {
    const index = e.detail.index;

    this.setData({
      currentIndex: index
    });
    // this._getSubCategory();
    this._getSubData(index);
  },

  // 切换子分类详情的tabIndex
  handleChangeTabIndex (e) {
    const tabIndex = e.detail.index,
          currentIndex = this.data.currentIndex,
          category = this.data.category;
    
    category[currentIndex].subCategoryDetail.currentTabIndex = tabIndex;
    this.setData({
      category
    });
  },

  // 触底加载更多
  handleScrollToLower () {
    const index = this.data.currentIndex,
          category = this.data.category[index],
          miniWallkey = category.miniWallkey,
          subCategoryDetail = category.subCategoryDetail,
          tabIndex = subCategoryDetail.currentTabIndex,
          tag = this.data.titles[tabIndex].type,
          tagInfo = subCategoryDetail[tag];

    if (!tagInfo.isEnd) {
      const page = tagInfo.page;
      this._getSubCategoryDetail(miniWallkey, tag, page).then(res => this._getSubCategoryDetailSucc(res, index, tag, page));
    }
  },

  // 切换Loading状态
  _changeLoading (loading) {
    if (loading) {
      wx.showLoading({
        title: '玩命加载中...',
        mask: true,
      });
      this.setData({
        loading
      });
    } else {
      setTimeout(() => {
        wx.hideLoading();
        this.setData({
          loading
        });
      }, 300);
    }

  },

  // ---------------------- 获取数据 ---------------------
  _getData () {
    this._getCategory();
  },

  _getCategory() {
    categoryModel.getCategory().then(this._getCategorySucc);
  },

  _getCategorySucc(res) {
    res = res.data;
    if (res.errCode === 1) {
      const data = res.data;
      this.setData({
        category: data
      });

      const index = this.data.currentIndex;

      this._getSubData(index);
    }
  },

  // 获取子类数据
  _getSubData (index) {
    const category = this.data.category[index];
    if (category.subCategory || category.subCategoryDetail) {
      // 存在其中之一的属性，不再获取
      return;
    }

    this._changeLoading(true); // 显示loading图

    const { maitKey, miniWallkey } = category;

    let list = [this._getSubCategory(maitKey)];

    this.data.titles.forEach(item => {
      list.push(
        this._getSubCategoryDetail(miniWallkey, item.type, 1)
      );
    });

    Promise.all(list).then(res => this._getSubDataSucc(res, index));;
  },

  _getSubCategory(maitKey) {
    return categoryModel.getSubCategory(maitKey);
  },
  _getSubCategoryDetail(miniWallkey, tag, page) {
    return categoryModel.getSubCategoryDetail(miniWallkey, tag, page);
  },

  // 获取子类数据回调处理
  _getSubDataSucc (res, index) {
    let [subCategory, detailNew, detailPop, detailSell] = res;

    subCategory = subCategory.data;
    detailNew   = detailNew.data;
    detailPop   = detailPop.data;
    detailSell  = detailSell.data;

    // console.log(detailSell)

    if (
      subCategory.errCode === 1 &&
      detailNew.errCode === 1
      && detailPop.errCode === 1
      && detailSell.errCode === 1
    ) { // 数据全部回来了
      
      const category = this.data.category;

      category[index].subCategory = subCategory.data;
      category[index].subCategoryDetail = {
        currentTabIndex: 0,
        new: {
          page: 2,
          isEnd: detailNew.is_end,
          list: detailNew.data
        },
        pop: {
          page: 2,
          isEnd: detailPop.is_end,
          list: detailPop.data
        },
        sell: {
          page: 2,
          isEnd: detailSell.is_end,
          list: detailSell.data
        }
      }

      this.setData({
        category
      });
      
      this._changeLoading(false); // 隐藏loading图
    }

    // console.log(res, index);
  },

  // 加载更多数据的回调
  _getSubCategoryDetailSucc(res, index, tag, page) {
    res = res.data;
    if (res.errCode === 1) {
      // console.log(res, index, tag, page)
      const data = res.data,
            isEnd = res.is_end;
      const category = this.data.category;
      
      category[index].subCategoryDetail[tag].list.push(...data);
      category[index].subCategoryDetail[tag].page = page + 1;
      category[index].subCategoryDetail[tag].isEnd = isEnd;
      
      this.setData({
        category
      });
    }
  },

  // 获取视口高度
  _getWinHeight () {
    const _this = this;
    wx.getSystemInfo({
      success (res) {
        _this.setData({
          winHeight: res.windowHeight
        });
      },
    })
  }



})