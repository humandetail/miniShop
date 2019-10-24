import Http from './http.js';

export default class Home extends Http {

  // 获取首页Banner以及推荐数据
  getMultiData () {
    return this.get('/homeMultiData');
  }

  // 获取首页下方的Tab数据
  getData (type, page) {
    if (!type || !page) {
      throw new Error('参数错误！');
    }

    return this.get('/homeData', {
      type,
      page
    });
  }
}