// App.js - React Native

import React, { Component } from "react";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

const HomeStack = createStackNavigator({
  Home: { screen: HomeScreen, navigationOptions: { title: "Home" } }
});



const RootStack = createStackNavigator(
  {
    Main: HomeStack,
  },
 
);

class App extends Component {
  render() {
    return <RootStack />;
  }
}

export default App;
