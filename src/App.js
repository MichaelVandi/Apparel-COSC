// App.js - WEB
import React, { Component } from "react";
import { View, Text, StyleSheet, Modal, TextInput, Button, TouchableOpacity,
          ActivityIndicator } from "react-native";
import WebRoutesGenerator from "./NativeWebRouteWrapper";
import { ModalContainer } from "react-router-modal";
import firebase from './firebase';

import HomeScreen from "./HomeScreen";
import BottomNav from "./BottomNav";
import SecondScreen from "./SecondScreen";
import NavBar from './Navbar';

import Login from './Authentication/Login';
import SignUp from './Authentication/SignUp';


const routeMap = {
  Home: {
    component: HomeScreen,
    path: "/",
    exact: true
  },
  Second: {
    component: SecondScreen,
    path: "/profile",
  },

};


class App extends Component {
  constructor(props){
    super(props);
    this.state={
      isSignUpVisible:'no',
      isLogInVisible:'no',
      isIndicatorVisible:'no',
      
      error_value:"",
  email_s:'mikevee2013@gmail.com',
  name_s:'',
  password_s:'password',
  confirm_s:'',
  authenticated:false,
  creator:'no',

  userId:'',
    }
      
   
  }
  navBarCallBack=(isLogInVisible)=>{
      this.setState({
        isLogInVisible: isLogInVisible
      })
  }

  loginCallback=(authenticated, isSignUpVisible, isLogInVisible, firstUser, creator)=>{
      this.setState({
        authenticated: authenticated,
        isSignUpVisible: isSignUpVisible,
        isLogInVisible:isLogInVisible,
        creator:creator
      });
      if(firstUser=='yes'){
        alert("Cheers to starting your journey of creating and selling!")
      }
  }

 
  componentDidMount() {
    firebase.auth().onAuthStateChanged((authenticated) => {
      authenticated
        ? this.setState(() => ({
            authenticated: true,
          }))
        : this.setState(() => ({
            authenticated: false,
          }));
    });

  }
 

  render() {
    //Method for showing Sign Up
    const ShowSignUp =()=>{
    
      if(this.state.isSignUpVisible=='yes'){
        //false, not authenticated
        return( <SignUp callBackFromApp={this.loginCallback}/>);
      }
      else{
          return(null)
        }
      
    };
    // method for showing Login
    const ShowLogIn =()=>{
      if(this.state.isLogInVisible=='yes'){
        
        //false, not authenticated
        return( <Login callBackFromApp={this.loginCallback}/>);
      }
      else{
        //true, authenticated
        return(null)
      }
    };
    //show BottomNav
    const ShowBottomNav=()=>{
      if(this.state.creator=="yes"){
        return(<BottomNav/>)
      }
      else {
        return(null)
      }
    }
    
    return (
      <View style={{ height: "100vh", width: "100vw" }}>
      <NavBar callBackFromApp={this.navBarCallBack}/>
        {WebRoutesGenerator({ routeMap })}
        <ModalContainer />
        <ShowLogIn/>
              <ShowSignUp/>
                  
        <ShowBottomNav />
      </View>
    );
  }
}

const styles=StyleSheet.create({
  modal_container: {
    height:'84%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    //borderWidth:2,
    //borderColor:'black'
   
  },
  
})

export default App;
