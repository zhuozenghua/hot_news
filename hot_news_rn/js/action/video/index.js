import Types from  '../types'
import DataStore,{FLAG_STORAGE} from '../../expand/dao/DataStore'
/**
 * 获取最热数据的异步action
 * @param url
 * @returns {function(*=)}
 */
export function onRefreshVideo(url,pageSize){
   return dispatch=>{
      dispatch({type:Types.VIDEO_REFRESH});
      let dataStore=new DataStore();  //异步action和数据流
      dataStore.fetchData(url,FLAG_STORAGE.flag_video)
               .then(data=>{
                  handleData(dispatch,data,pageSize)
               })
               .catch(error=>{
                console.log(error);
                dispatch({
                    type: Types.VIDEO_REFRESH_FAIL,
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
export function onLoadMoreVideo(pageIndex, pageSize, dataArray = [], callBack) {
    return dispatch => {
        setTimeout(() => {//模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) {//已加载完全部数据
                if (typeof callBack === 'function') {
                    callBack('no more')
                }
                dispatch({
                    type: Types.VIDEO_LOAD_MORE_FAIL,
                    error: 'no more',
                    pageIndex: --pageIndex,
                    projectModels: dataArray
                })
            } else {
                //本次和载入的最大数量
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                dispatch({
                    type: Types.VIDEO_LOAD_MORE_SUCCESS,
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
function handleData(dispatch,data,pageSize){
   let fixItems = [];
    if (data && data.data) {
        fixItems = data.data;
    }

   dispatch({
        type: Types.VIDEO_REFRESH_SUCCESS,
        items: fixItems,
        projectModels: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),//第一次要加载的数据
        pageIndex:1
   })
}