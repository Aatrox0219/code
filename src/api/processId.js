//保证金存缴的流程id列表和分类id
export const depositList = ['15128', '15130', '15132', '15134'];
export const depositCategoryId = '1847453055727501313';

// //保证金使用的流程id列表和分类id
export const useList = ['15128', '15130', '15132', '15134', '10002'];
export const useCategoryId = '1847453556447707137';

// //保证金补缴的流程id列表和分类id
// //如果部署了新的流程，记得改flowBackPay.vue里开启的对应的流程id
export const backpayList = ['15128', '15130', '15132', '15134', '10002', '10008', '10010', '10012', '10014'];
export const backpayCategoryId = '1860939985686949889';

// //保证金存缴方式变更的流程id列表和分类id
export const changeList = ['15128', '15130', '15132', '15134', '15136', '15138', '15140', '15142'];
export const changeCategoryId = '1860602147955077121';

// //保证金保函更换的流程id列表和分类id
// //如果部署了新的流程，记得改flowExtend.vue里开启的对应的流程id
export const extendList = ['15128', '15130', '15132', '15134', '10020', '10022', '10024', '10026'];
export const extendCategoryId = '1867119925569568769';

// //保证金返还的流程id列表和分类id
export const returnList = ['15128', '15130', '15132', '15134', '10029'];
export const returnCategoryId = '1867119977859956738';

// 正式
// 1.替换ip 2.替换List 3.替换flowBackPay.vue和flowExtend.vue里面开启对应流程的id
// export const depositList = ['5005', '5007', '5009', '5011'];
// export const useList = ['5005', '5007', '5009', '5011', '5014'];
// export const backpayList = ['5005', '5007', '5009', '5011', '5014', '5020', '5022', '5024', '5026'];
// export const changeList = ['5005', '5007', '5009', '5011', '5033', '5035', '5037', '5039'];
// export const extendList = ['5005', '5007', '5009', '5011', '5045', '5047', '5049', '5051'];
// export const returnList = ['5005', '5007', '5009', '5011', '5054'];