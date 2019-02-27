import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, TextInput,ToastAndroid, AsyncStorage} from 'react-native';


type Props = {};
const KEY="save_key";
export default class AsyncStorageDemoPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            showText: ''
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>AsyncStorage 使用</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => {
                        this.value = text;
                    }}
                />
                <View style={styles.input_container}>
                    <Text onPress={() => {
                        this.doSave();
                    }}>
                        存储
                    </Text>
                    <Text onPress={() => {
                        this.doRemove();
                    }}>
                        删除
                    </Text>
                    <Text onPress={() => {
                        this.getData();
                    }}>
                        获取
                    </Text>

                </View>

                <Text>
                    {this.state.showText}
                </Text>
            </View>
        );
    }

    /**
     * 存储数据
     * @returns {Promise.<void>}
     */
    async doSave() {
        //用法一
        AsyncStorage.setItem(KEY, this.value, error => {
            error && console.log(error.toString());
        });

        // //用法二
        // AsyncStorage.setItem(KEY, this.value)
        //     .catch(error => {
        //         error && console.log(error.toString());
        //     });
        //
        // //用法三
        // try {
        //     await  AsyncStorage.setItem(KEY, this.value);
        // } catch (error) {
        //     error && console.log(error.toString());
        // }
    }

    /**
     * 删除数据
     * @returns {Promise.<void>}
     */
    async doRemove() {
        //用法一
        AsyncStorage.removeItem("token",error => {
            error && console.log(error.toString());
        });

        // //用法二
        // AsyncStorage.removeItem(KEY)
        //     .catch(error => {
        //         error && console.log(error.toString());
        //     });
        //
        // //用法三
        // try {
        //     await  AsyncStorage.removeItem(KEY);
        // } catch (error) {
        //     error && console.log(error.toString());
        // }
    }

    /**
     * 获取数据
     */
    async getData() {
         fetchLocalData("444").then(data=>{
             this.setState({
                showText: JSON.stringify(data)
             });    
         }).catch(err=>{
              this.setState({
                showText: "1"+err.toString()
             });  
         })
  



        //用法一
        // AsyncStorage.getItem(KEY, (error, value) => {
        //     this.setState({
        //         showText: value
        //     });
        //      ToastAndroid.show(value, ToastAndroid.SHORT);
        //     console.log(value);
        //     error && console.log(error.toString());
        // });
        // //用法二
        // AsyncStorage.getItem(KEY)
        //     .then(value => {
        //         this.setState({
        //             showText: value
        //         });
        //         console.log(value);
        //
        //     })
        //     .catch(error => {
        //         error && console.log(error.toString());
        //     });
        // //用法三
        // try {
        //     const value = await  AsyncStorage.getItem(KEY);
        //     this.setState({
        //         showText: value
        //     });
        //     console.log(value);
        // } catch (error) {
        //     error && console.log(error.toString());
        // }
    }
}


/**
 * 获取本地数据
 * @param key
 * @returns {Promise}
 */
function fetchLocalData(key){
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(key, (error, result) => {
            if (!error) {
                try {
                    resolve(JSON.parse(result));
                } catch (error) {
                    reject(error);
                    console.error(error);
                }
            } else {
                reject(error);
                console.error(error);
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



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    input: {
        height: 50,
        borderColor: 'black',
        borderWidth: 1,
        marginRight: 10
    },
    input_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    }
});