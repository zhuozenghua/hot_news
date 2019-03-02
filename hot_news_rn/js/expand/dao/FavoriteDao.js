import  {fetchLocalData,saveLocalData,removeLocalDataByKey} from './DaoUtil' 
//本地token格式
//token:{token:token}

/**
 * 收藏和取消收藏
 *
 * @return {[type]} [description]
 */
export function favoriteItem(news_id,flag){
     return new Promise((resolve, reject) => {
       fetchLocalData("token").then(token=>{  //本地有token
            //token:{token:token}
            var data={
               token:token,
               news_id:news_id
            }

            if(flag){
                fetch(`http://10.0.2.2:3000/news/favorite`,{
                      method: 'POST', // or 'PUT'
                      body: JSON.stringify(data), // data can be `string` or {object}!
                      headers: new Headers({
                        'Content-Type': 'application/json',
                      })
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                       throw new Error('Network response was not ok.');
                })
                .then((responseData) => {
                    if (responseData.status === 0) {
                        resolve(responseData.msg);
                    } else {
                        throw new Error(responseData.msg);
                    }
                })
                .catch((e) => {
                    reject(e.toString())
                })

            }else{
                fetch(`http://10.0.2.2:3000/news/unfavorite`,{
                      method: 'POST', // or 'PUT'
                      body: JSON.stringify(data), // data can be `string` or {object}!
                      headers: new Headers({
                        'Content-Type': 'application/json',
                      })
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                       throw new Error('Network response was not ok.');
                })
                .then((responseData) => {
                    if (responseData.status === 0) {
                        resolve(responseData.msg);
                    } else {
                        throw new Error(responseData.msg);
                    }
                })
                .catch((e) => {
                    reject(e.toString())
                })

            }

        })
        .catch(e=>{                    //本地没有token
             reject("请先登录")
        })



    })
}



/**
 * 收藏和取消收藏
 *
 * @return {[type]} [description]
 */
export function getFavoriteItem(){
     return new Promise((resolve, reject) => {
       fetchLocalData("token").then(token=>{  //本地有token
            //token:{token:token}
   
             fetch(`http://10.0.2.2:3000/u/favorite_list`,{
                     headers:{
                        token:JSON.stringify(token)
                     }
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                       throw new Error('Network response was not ok.');
                })
                .then((responseData) => {
                    if (responseData.status === 0) {
                        resolve(responseData.data);
                    } else {
                        throw new Error(responseData.msg);
                    }
                })
                .catch((e) => {
                    reject(e.toString())
                })

        })
        .catch(e=>{                    //本地没有token
             reject("请先登录")
        })


    })
}