import {AsyncStorage} from 'react-native';
/**
 * 获取本地数据
 * @param key
 * @returns {Promise}
 */
export function fetchLocalData(key){
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(key, (error, result) => {
            if (!error&&result) {
                try {
                    var result=JSON.parse(result);
                    resolve(result)
                } catch (error) {
                    reject(error);

                }
            } else {
                reject(error||"NULL");
            }
        })
    })
}
/**
 * 保存数据
 * @param key
 * @param data
 * @param callback 
 * error => {
 *          error && console.log(error.toString());
 *      }
 */
export function saveLocalData(key, data){
    if (!data || !key) return;
    AsyncStorage.setItem(key, JSON.stringify(data), error => {
         error && console.log(error.toString());
     });
}


/**
 * 删除本地数据
 * @param  {[type]} key 
 * @return 
 */
export function removeLocalDataByKey(key){
    AsyncStorage.removeItem(key,error => {
         error && console.log(error.toString());
     });
}


