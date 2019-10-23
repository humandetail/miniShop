//index.js
import Home from '../../model/home.js';
import Category from '../../model/category.js';
import Detail from '../../model/detail.js';

const homeModel = new Home();
const categoryModel = new Category();
const detailModel = new Detail();

Page({
  data: {
  },
  onLoad: function () {
    homeModel.getMultiData().then(this.getMultiDataSucc);
    homeModel.getData('new', 1).then(this.getDataSucc);
    categoryModel.getCategory().then(res => console.log(res));
    categoryModel.getSubCategory('3627').then(res => console.log(res));
    categoryModel.getSubCategoryDetail('10056587', 'new', 1).then(res=> console.log(res));
    detailModel.getDetail('1m93p1c').then(res => console.log(res));
    detailModel.getDetialRecommend().then(res => console.log(res));
  },
  getMultiDataSucc (res) {
    console.log(res);
  },

  getDataSucc (res) {
    console.log(res);
  }
})
