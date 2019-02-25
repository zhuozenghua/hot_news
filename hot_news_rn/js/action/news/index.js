import Types from  '../types'
import DataStore,{FLAG_STORAGE} from '../../expand/dao/DataStore'

/**
 * 获取最热数据的异步action
 * @param storeName   新闻类型
 * @param url
 * @returns {function(*=)}
 */
export function onRefreshNews(storeName,url,pageSize){
   return dispatch=>{
      dispatch({type:Types.NEWS_REFRESH,storeName:storeName});
      let dataStore=new DataStore();  //异步action和数据流
      dataStore.fetchData(url,FLAG_STORAGE.flag_news)
               .then(data=>{
                  handleData(dispatch,storeName,data,pageSize)
               })
               .catch(error=>{
                console.log(error);
                dispatch({
                    type: Types.NEWS_REFRESH_FAIL,
                    storeName,
                    error
                });
               })
   }

}


/**
 * 加载更多
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callBack 回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 * @returns {function(*)}
 */
export function onLoadMoreNews(storeName, pageIndex, pageSize, dataArray = [], callBack) {
    return dispatch => {
        setTimeout(() => {//模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) {//已加载完全部数据
                if (typeof callBack === 'function') {
                    callBack('no more')
                }
                dispatch({
                    type: Types.NEWS_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModels: dataArray
                })
            } else {
                //本次和载入的最大数量
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                dispatch({
                    type: Types.NEWS_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModels: dataArray.slice(0, max),
                })
            }
        }, 500);
    }
}


/**
 * 处理下拉刷新的数据
 * @param dispatch
 * @param storeName
 * @param data
 * @param pageSize
 */
function handleData(dispatch,storeName,data,pageSize){
   let fixItems = [];
    if (data && data.data) {
        fixItems = data.data;
    }

   dispatch({
        type: Types.NEWS_REFRESH_SUCCESS,
        items: fixItems,
        projectModels: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),//第一次要加载的数据
        storeName,
        pageIndex:1
   })
}