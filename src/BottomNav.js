import React from "react";
import { View, Button, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { withRouter } from "react-router-dom";

var device_width= Dimensions.get('window').width;
var deviceHeight= Dimensions.get('window').height;
var img_width;
var marginTop;
var marginLeft;
if(device_width>250 && device_width<400){
img_width=80;
}
else if(device_width>400 && device_width<500){
  img_width=35;
  marginTop=deviceHeight*0.78;
  marginLeft='80%';
}
else if(device_width>500 && device_width<700){
  img_width=200;
}
else if(device_width>700){
  img_width=40;
  marginTop= '38%'
  marginLeft='92.5%'
}

const BottomNav = ({ history }) => {

  return (
    
    <View style={styles.main}>
      <View>
        <TouchableOpacity style={styles.buttonView} onPress={() => history.push("/")}>
          <Image source={require('./images/home_icon.png')} style={styles.imgBtn}/>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity style={styles.buttonView} onPress={() => history.push("/profile")}>
          <Image source={require('./images/plus_icon.png')} style={styles.imgBtn}/>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    
    marginLeft: marginLeft,
    marginTop: marginTop,
    position:'absolute',
    zIndex:'6',
    
  },
  buttonView:{
    padding: 10,
    margin:5,
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    borderRadius: 100,
    backgroundColor:'#efe6d0',
  },
  imgBtn:{
    width:img_width,
    height: img_width,
  }
});

export default withRouter(BottomNav);
