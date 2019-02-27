import {AsyncStorage} from 'react-native';

//本地token格式
//token:{token:token}

/**
 * 检查是否已经登录
 *
 * @return {[type]} [description]
 */
export function checkLogin(){
     return new Promise((resolve, reject) => {

        //1.从本地存储中获取token,null|出错，则reject
        //2.取出token,并发送到后台比对
        //3.根据服务端返回的信息，判断token是否有效
        
        fetchLocalData("token").then(data=>{  //本地有token
            //data:{token:token}
            fetch(`http://10.0.2.2:3000/check_login`,{
                  method: 'POST', // or 'PUT'
                  body: JSON.stringify(data), // data can be `string` or {object}!
                  headers: new Headers({
                    'Content-Type': 'application/json'
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
                    resolve(responseData);
                } else {
                    throw new Error(responseData.msg);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
        })
        .catch(e=>{                    //本地没有token
             reject(e.toString())
        })


    })
}


/**
 * 登录
 *
 * @return {[type]} [description]
 */
export function signIn(data){
     return new Promise((resolve, reject) => {
       
           fetch(`http://10.0.2.2:3000/sign_in`,{
                  method: 'POST', 
                  body: JSON.stringify(data), // data can be `string` or {object}!
                  headers: new Headers({
                    'Content-Type': 'application/json'
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
                    //需要将token存在本地
                    saveLocalData("token",{token:responseData.data.token})
                    saveLocalData("user",{user:responseData.data.user})
                    resolve(responseData);
                } else {
                    throw new Error(responseData.msg);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
        })

}


/**
 * 登出
 * 删除本地token
 */
export function signOut(){
    removeLocalDataByKey("token")
    return true
}

/**
 * 注册
 * @return {[type]} [description]
 */
export function signUp(data){

     return new Promise((resolve, reject) => {
       
           fetch(`http://10.0.2.2:3000/sign_up`,{
                  method: 'POST', 
                  body: JSON.stringify(data), // data can be `string` or {object}!
                  headers: new Headers({
                    'Content-Type': 'application/json'
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
                    resolve(responseData);
                } else {
                    throw new Error(responseData.msg);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
        })

}


/**
 * 获取本地数据
 * @param key
 * @returns {Promise}
 */
function fetchLocalData(key){
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
function saveLocalData(key, data){
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
function removeLocalDataByKey(key){
    AsyncStorage.removeItem(key,error => {
         error && console.log(error.toString());
     });
}









