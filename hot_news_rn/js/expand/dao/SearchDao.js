//获取新闻热搜
export function getHotKey() {
    return new Promise((resolve, reject) => {
        fetch(`http://www.yidianzixun.com/home/q/hot_search_keywords?appid=web_yidian`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then((responseData) => {
                if (responseData.code === 0) {
                    let keywords = responseData.keywords.slice();
                    let wordArr = [];
                    keywords.map((item, index) => {
                        wordArr.push(item.name);
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
        fetch(`http://www.yidianzixun.com/home/q/search_channel?word=${encodeURIComponent(words)}&appid=web_yidian`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then((responseData) => {
                if (responseData.code === 0) {
                    let wordsArr = [];
                    if (responseData.channels) {
                        let arr = responseData.channels.slice();
                        arr.map((item, index) => {
                            if (item.type === 'keyword' || item.type === 'sugkwd') {
                                wordsArr.push(item.name);
                            }
                        })
                    }
                    resolve(wordsArr);
                } else {
                    throw new Error(responseData.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}