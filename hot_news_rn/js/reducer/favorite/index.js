import Types from '../../action/types';

const defaultState = {};
/**
 * favorite:{
 *         items:[],
 *         isLoading:false
 * }
 * 0.state树，横向扩展
 * @param state
 * @param action
 * @returns {{theme: (onAction|*|string)}}
 */
export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.FAVORITE_LOAD_NEWS://获取数据
            return {
                  ...state,
                  error:false,
                  isLoading: true,
                }        
        case Types.FAVORITE_LOAD_SUCCESS://下拉获取数据成功
            return {
                  ...state,
                  error:false,
                  items: action.items,//此次要展示的数据
                  isLoading: false,
             };
        case Types.FAVORITE_LOAD_FAIL://下拉获取数据失败
            return {
                ...state,
                isLoading: false,
                error:action.error,
                items:[]
            };
        default:
            return state;
    }

}