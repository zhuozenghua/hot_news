import {AsyncStorage} from 'react-native';
import  {fetchLocalData,saveLocalData,removeLocalDataByKey} from './DaoUtil'

export const  FLAG_STORAGE={flag_news:'news',flag_video:'video'}

export default class DataStore {

    /**
     * 获取数据，优先获取本地数据，如果无本地数据或本地数据过期则获取网络数据
     * @param url
     * @param flag
     * @returns {Promise}
     */
   
    fetchData(url,flag) {

        //优先获取本地数据，如果无本地数据或本地数据过期则获取网络数据
        // return new Promise((resolve, reject) => {
        //     this.fetchLocalData(url).then((wrapData) => {
        //         if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
        //             resolve(wrapData);
        //         } else {
        //             this.fetchNetData(url,flag).then((data) => {
        //                 resolve(this._wrapData(data));
        //             }).catch((error) => {
        //                 reject(error);
        //             })
        //         }

        //     }).catch((error) => {
        //         this.fetchNetData(url,flag).then((data) => {
        //             resolve(this._wrapData(data));
        //         }).catch((error => {
        //             reject(error);
        //         }))
        //     })
        // })


        //优先取网络数据，若无网络数据，本地数据没有失效则使用本地数据
        return new Promise((resolve, reject) => {

           this.fetchNetData(url,flag).then((data) => {
                //返回包装后的数据
                resolve(this._wrapData(data));
            }).catch((error => {
                //这里获取本地数据
                this.fetchLocalData(url).then((wrapData) => {
                if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
                    resolve(wrapData);
                } else {
                    reject("本地数据失效");
                 }

               }).catch((error=>{
                  reject(error);
               }))

           }))

        })

    }

    /**
     * 保存数据
     * @param url
     * @param data
     * @param callback
     */
    saveData(url, data, callback) {
        if (!data || !url) return;
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
    }

    /**
     * 获取本地数据
     * @param url
     * @returns {Promise}
     */
    fetchLocalData(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            })
        })
    }

    /**
     * 获取网络数据
     * @param url
     * @param flag
     * @returns {Promise}
     */
    fetchNetData(url,flag) {
        return new Promise((resolve, reject) => {
            if(flag==FLAG_STORAGE.flag_news){   //获取新闻列表
              
                  /**
                  * 从自己服务器读取
                  */
                 fetchLocalData("token").then(data=>{
                     //
                    fetch(url,{
                         headers:{
                            token:JSON.stringify(data)
                         }
                    })
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Network response was not ok.');
                    })
                    .then((responseData) => {
                        if(responseData.status==0){
                          let List = responseData.data; // 列表数据
                          this.saveData(url, List)
                          resolve(List);
                        }else{
                          throw new Error(responseData.msg);
                        }
                    })
                    .catch((error) => {
                        reject(error.toString());
                    })
                

                 }).catch(err=>{

                         fetch(url)
                          .then((response) => {
                              if (response.ok) {
                                  return response.json();
                              }
                              throw new Error('Network response was not ok.');
                          })
                          .then((responseData) => {
                              if(responseData.status==0){
                                let List = responseData.data; // 列表数据
                                this.saveData(url, List)
                                resolve(List);
                              }else{
                                throw new Error(responseData.msg);
                              }
                          })
                          .catch((error) => {
                              reject(error.toString());
                          })
                 })




            }else if(flag==FLAG_STORAGE.flag_video){ //获取视频列表

                // 网上读取数据
                    //  getVideoList(url).then(newsList=>{
                    //        this.saveData(url, newsList);
                    //        resolve(newsList);

                    // }).catch((e) => {
                    //        reject(e.toString())
                    // })
                    
                 
                 /**
                  * 从自己服务器读取
                  */
                   fetch(url)
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Network response was not ok.');
                    })
                    .then((responseData) => {
                        if(responseData.status==0){
                          let List = responseData.data; // 列表数据
                          this.saveData(url, List)
                          resolve(List);
                        }else{
                          throw new Error(responseData.msg);
                        }
                    })
                    .catch((error) => {
                        reject(error.toString());
                    })

          }


       })       
    }


    _wrapData(data) {
        return {data: data, timestamp: new Date().getTime()};
    }

    /**
     * 检查timestamp是否在有效期内
     * @param timestamp 项目更新时间
     * @return {boolean} true 不需要更新,false需要更新
     */
    static checkTimestampValid(timestamp) {
        const currentDate = new Date();
        const targetDate = new Date();
        targetDate.setTime(timestamp);
        if (currentDate.getMonth() !== targetDate.getMonth()) return false;
        if (currentDate.getDate() !== targetDate.getDate()) return false;
        if (currentDate.getHours()-targetDate.getHours()>4) return false;  //有效期4个小时
        //if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false; //有效期1分钟
        return true;
    }
}