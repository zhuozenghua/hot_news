import Types from '../../action/types'

const defaultState={}

/**
 * news:{
 *     热点:{
 *         items:[{content:'',code:''}],
 *         isLoading:false
 *     },
 *     社会:{
 *         items:[],
 *         isLoading:false
 *     }
 * }
 * 0.state树，横向扩展
 * 1.如何动态的设置store，和动态获取store(难点：store key不固定)；
 * @param state
 * @param action
 * @returns {{theme: (onAction|*|string)}}
 */
export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.VIDEO_REFRESH_SUCCESS:  //下拉刷新
            return {
               ...state,
                items:action.items,  //原始数据
                projectModels:action.projectModels,//此次要展示的数据
                isLoading:false,
                hideLoadingMore:false,
                pageIndex:action.pageIndex
            };
        case Types.VIDEO_REFRESH:
            return {
                 ...state,
                 isLoading: true,
                 hideLoadingMore:true,
            };   
         case Types.VIDEO_REFRESH_FAIL:
            return {
                 ...state,
                 isLoading:true
            };  
         case Types.VIDEO_LOAD_MORE_SUCCESS:  //上拉加载更多
            return {
                ...state,
                projectModels:action.projectModels,
                hideLoadingMore:false,
                pageIndex:action.pageIndex
            }; 
         case Types.VIDEO_LOAD_MORE_FAIL:  
            return {
                 ...state,
                 hideLoadingMore:true,
                 pageIndex:action.pageIndex
            };         
        default:
            return state;
    }

}