//获取新闻热搜
export function getHotKey() {
    return new Promise((resolve, reject) => {
        fetch(`http://www.yidianzixun.com/home/q/hot_search_keywords?appid=web_yidian`)
            .then((response) => response.json())
            .then((json) => {
                if (json.code === 0) {
                    let keywords = json.keywords.slice();
                    let wordArr = [];
                    keywords.map((item, index) => {
                        wordArr.push(item.name);
                    });
                    resolve(wordArr);
                } else {
                    throw new Error(json.status);
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
            .then((response) => response.json())
            .then((json) => {
                if (json.code === 0) {
                    let wordsArr = [];
                    if (json.channels) {
                        let arr = json.channels.slice();
                        arr.map((item, index) => {
                            if (item.type === 'keyword' || item.type === 'sugkwd') {
                                wordsArr.push(item.name);
                            }
                        })
                    }
                    resolve(wordsArr);
                } else {
                    throw new Error(json.status);
                }
            })
            .catch((e) => {
                reject(e.toString())
            })
    })
}