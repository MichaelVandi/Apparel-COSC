import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,
   } from 'reactstrap';
import {View, Text, StyleSheet, Dimensions, Button, TouchableOpacity, Image } from "react-native";
import { withRouter } from "react-router-dom";

var device_width= Dimensions.get('window').width;

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      showMenu: false,
      dropDownClicked: false,
    };
  }
  componentWillMount(){
    if(device_width>700){
      this.setState({
          showMenu: true
      })
    }
    else{
      this.setState({
        showMenu: false
      })
    }
  }
  clickSellerLogin=()=>{
      var isLoginVisible='yes';
      this.props.callBackFromApp(isLoginVisible);
      this.setState({
        dropDownClicked: false,
      })
  }

  showDropDown=() =>{
if(this.state.dropDownClicked==false){
  this.setState({
    dropDownClicked: true
  })
}
else {
  this.setState({
    dropDownClicked:false
  })
}
  }
  render() {
    const Menu=({ history })=>{
      if(this.state.showMenu==true){
        return(  <View style={styles.menu}>
          
          <TouchableOpacity style={styles.desktopBtn} onPress={() => history.push("/")}>
            <Text >Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.desktopBtn} onPress={null}>
            <Text >About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.desktopBtn} onPress={null}>
            <Text >Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.desktopBtn} onPress={null}>
            <Text >Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.desktopBtn} onPress={this.clickSellerLogin}>
            <Text >Trade</Text>
          </TouchableOpacity>
          
        </View>
        )
      }
      else{
        return (null)
      }
    }
     
    const CollapsedMenu =()=>{
      if(this.state.showMenu==false){
        return (
          <View>
            <TouchableOpacity onPress={this.showDropDown}>
              <Image style={styles.hamburger} source={require('./hamburger.png')}/>
            </TouchableOpacity>
          </View>

        )
      }
      else {
        return (null)
      }
    }
    const DropDown=()=>{
      if(this.state.dropDownClicked==true){
        return(
          <View style={styles.dropDown}>
          <TouchableOpacity style={styles.mobileBtnText}>
            <Text style={styles.btnText}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileBtnText}>
            <Text style={styles.btnText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileBtnText}>
            <Text style={styles.btnText}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileBtnText}>
            <Text style={styles.btnText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileBtnText} onPress={this.clickSellerLogin}>
            <Text style={styles.btnText}>Trade</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobileBtnText} onPress={this.showDropDown}>
            <Text style={styles.btnText}>Exit</Text>
          </TouchableOpacity>

          </View>
        )
      }
      else {
        return(null)
      }
    }
    return (
      
      <View style={styles.navbar_container}>
        <View style={{marginRight: 'auto', paddingLeft: 10}}>
        <Text style={styles.brandText}>Apparel</Text>
        </View>
          <View>
            <Menu/>
            <CollapsedMenu/>
            <DropDown/>
          </View>
      </View>

     
    );
  }
}
const styles= StyleSheet.create({
    navbar_container:{
      position:'absolute',
      zIndex: 5,
      backgroundColor:'white',
      display: 'flex',
      height:'8%',
      padding: 10,
      flexDirection:'row',
      width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    },
    menu:{
      
      display: 'flex',
      flexDirection: 'row',
      
      
    },
    button:{
      margin: 5
    },
    brandText:{
      fontFamily: 'Pacifico',
      
      fontSize: 25,
    },
    dropDown:{
      width: device_width*0.45,
      height:'auto',
      display:'flex',
      flexDirection:'column',
      shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,},
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    backgroundColor: 'white',
    marginTop: '10%',
    },
    mobileBtnText:{
        marginVertical: 10,
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
        
    },
    btnText:{
      marginLeft: 5,
        fontSize: 20,
    },
    desktopBtn:{
      borderColor:'grey',
      borderWidth: 1,
      borderRadius: 4,
      padding:5,
      marginRight:10,
    },
    hamburger:{
      width: 30,
      height:30,
      marginLeft: 'auto',
    }
});
export default withRouter(NavBar);