import Http from './http.js';

export default class Detail extends Http {

  /**
   * 获取商品详情信息
   * @param { String } iid 商品唯一标识
   */
  getDetail (iid) {
    if (!iid) {
      throw new Error('参数错误');
    }

    return this.get('/detail', {
      iid
    })
  }

  // 获取详情页下方的为您推荐内容
  getDetialRecommend () {
    return this.get('/detailRecommend');
  }

}