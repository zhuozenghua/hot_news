'use strict';

import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {Text, View, StyleSheet, Platform, TouchableHighlight, TouchableNativeFeedback,ViewPropTypes} from 'react-native';
import {px2dp} from '../util/Utils';

export default class Button extends Component{
    static propTypes = {
        text: PropTypes.string.isRequired,
        btnStyle: ViewPropTypes.style,
        textStyle:ViewPropTypes.style,
        onPress: PropTypes.func
    };

    render(){
        if(Platform.OS === 'android') {
            return (
                <TouchableNativeFeedback
                    onPress={this.props.onPress}>
                    {this._renderContent()}
                </TouchableNativeFeedback>
            );
        }else if(Platform.OS === 'ios'){
            return(
                <TouchableHighlight
                    style={{flex: 1, height: px2dp(45)}}
                    onPress={this.props.onPress}
                    activeOpacity={0.7}>
                    {this._renderContent()}
                </TouchableHighlight>
            );
        }
    }

    _renderContent(){
        return(
            <View style={this.props.btnStyle?this.props.btnStyle:styles.btn}>
                <Text style={this.props.textStyle?this.props.textStyle:styles.text}>{this.props.text}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
   btn:{
        flex: 1,
        height: px2dp(45), 
        backgroundColor: 'gray', 
        alignItems:'center', 
        justifyContent:'center',
        borderRadius: 3
   },
   text:{
       color: 'white',
       fontSize: px2dp(14)
   }
});