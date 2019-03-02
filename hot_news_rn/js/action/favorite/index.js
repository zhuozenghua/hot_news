import Types from '../types'
import {getFavoriteItem} from "../../expand/dao/FavoriteDao";


/**
 * 加载收藏的项目
 * @param isShowLoading 是否显示loading
 * @returns {function(*)}
 */
export function onLoadFavoriteNews(isShowLoading) {
    return dispatch => {
        
        if (isShowLoading) {
            dispatch({type: Types.FAVORITE_LOAD_NEWS});
        }
        getFavoriteItem()
            .then(items => {
                dispatch({type: Types.FAVORITE_LOAD_SUCCESS, items:items});
            })
            .catch(error => {
                dispatch({type: Types.FAVORITE_LOAD_FAIL, error: error});
            })

    }
}
