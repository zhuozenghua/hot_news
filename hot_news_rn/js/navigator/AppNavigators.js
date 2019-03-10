import {createStackNavigator,createSwitchNavigator,createAppContainer} from 'react-navigation'
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import NewsDetailPage from '../page/NewsDetailPage'
import SearchPage from '../page/SearchPage'
import WebViewPage from '../page/WebViewPage'
import SigInPage from '../page/SignInAndSignUp/SignInPage';
import SignUpPage from '../page/SignInAndSignUp/SignUpPage';
import SearchNewsPage from '../page/SearchNewsPage';
import { connect } from 'react-redux';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
  createReduxContainer
} from 'react-navigation-redux-helpers';


export const rootCom='Init' 

const InitNavigator=createStackNavigator({
  WelcomePage:{
     screen:WelcomePage,
     navigationOptions:{
        header:null, //禁用bar
     }
  }
})


const MainNavigator=createStackNavigator({
  HomePage:{
     screen:HomePage,
     navigationOptions:{
        header:null, //禁用bar
     }
  },
   NewsDetailPage:{
     screen:NewsDetailPage,
     navigationOptions:{
        header:null, //禁用bar
     }
  },
  SearchPage:{
     screen:SearchPage,
     navigationOptions:{
        header:null, //禁用bar
     }
  },
  WebViewPage:{
     screen:WebViewPage,
     navigationOptions:{
        header:null, //禁用bar
     }
  },
  SigInPage:{
     screen:SigInPage,
     navigationOptions:{
        header:null, //禁用bar
     }
  },
  SignUpPage:{
     screen:SignUpPage,
     navigationOptions:{
        header:null, //禁用bar
     }
  },
  SearchNewsPage:{
     screen:SearchNewsPage,
     navigationOptions:{
        header:null, //禁用bar
     }
  }

})



export  const RootNavigator=createSwitchNavigator({
  Init:InitNavigator,
  Main:MainNavigator,
},{
   navigationOptions:{
       header:null, //禁用bar
    }
})


/**
 * 1.初始化react-navigation与redux的中间件，
 * 该方法的一个很大的作用就是为createReduxContainer的key设置actionSubscribers(行为订阅者)
 * 设置订阅者@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L29
 * 检测订阅者是否存在@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L97
 * @type {Middleware}
 */
export const middleware = createReactNavigationReduxMiddleware(
     state => state.nav,
     'root'
);

/**
 * 2.将根导航器组件传递给 createReduxContainer 函数,
 * 并返回一个将navigation state 和 dispatch 函数作为 props的新组件；
 * 注意：要在createReactNavigationReduxMiddleware之后执行
 */
const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

/**
 * State到Props的映射关系
 * @param state
 */
const mapStateToProps = state => ({
    state: state.nav,//v2
});
/**
 * 3.连接 React 组件与 Redux store
 */
export default connect(mapStateToProps)(AppWithNavigationState);