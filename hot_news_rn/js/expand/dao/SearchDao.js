import {URL}  from '../../util/NetConfig'

//获取新闻热搜
export function getHotKey() {
    return new Promise((resolve, reject) => {
        fetch(`${URL}/news/get_hot_keys`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then((responseData) => {
                if (responseData.status === 0) {
                    let keywords = responseData.data;
                    let wordArr = [];
                    keywords.map((item, index) => {
                        wordArr.push(item.search_key);
                    });
                    resolve(wordArr);
                } else {
                    throw new Error(responseData.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}

//获取搜索实时匹配
export function getTipsWords(words) {
    return new Promise((resolve, reject) => {
        fetch(`${URL}/news/get_tip_keys?word=${encodeURIComponent(words)}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then((responseData) => {
                if (responseData.status === 0) {
                    let wordArr = [];
                    let keywords = responseData.data;
                    if (keywords) {
                        keywords.map((item, index) => {  
                                wordArr.push(item.search_key);
                          })
                    }
                    resolve(wordArr);
                } else {
                    throw new Error(responseData.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}



//获取搜索内容
export function getSearch(words) {
    return new Promise((resolve, reject) => {
        fetch(`${URL}/news/search/?word=${encodeURIComponent(words)}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then((responseData) => {
                if (responseData.status === 0) {
                    let wordArr = responseData.data||[];
                    resolve(wordArr);
                } else {
                    throw new Error(responseData.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}
