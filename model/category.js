import Http from './http.js';

export default class Category extends Http {

  // 获取大分类数据
  getCategory () {
    return this.get('/category');
  }

  /**
   * 获取子分类数据
   * @param { String } maitKey 子分类标识
   */
  getSubCategory (maitKey) {
    if (!maitKey) {
      throw new Error('参数错误！');
    }

    return this.get('/subCategory', {
      maitKey
    });
  }

  /**
   * 获取子分类下方的详情列表数据
   * @param { String } miniWallKey 子分类详情标识
   * @param { String } tag 标签
   * @param { Number } page 页码
   */
  getSubCategoryDetail(miniWallKey, tag, page) {
    if (!miniWallKey || !tag || !page) {
      throw new Error('参数错误！');
    }

    return this.get('/subCategoryDetail', {
      miniWallKey,
      tag,
      page
    });
  }

}