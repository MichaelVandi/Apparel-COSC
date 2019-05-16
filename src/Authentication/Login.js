//import liraries
import React, { Component } from 'react';
import {  View, Text, StyleSheet, Modal, TextInput, Button, TouchableOpacity,
    ActivityIndicator, Dimensions} from 'react-native';
import firebase from '../firebase';

var deviceWidth= Dimensions.get('window').width;
var textInputWidth;
if (deviceWidth>800){
  textInputWidth= deviceWidth*0.3;
}
else{
   textInputWidth= deviceWidth*0.7
}


// create a component
class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            isSignUpVisible:'no',
            isLogInVisible:'yes',
            isIndicatorVisible:'no',
            
        error_value:"",
        email_s:'mikevee2013@gmail.com',
        name_s:'',
        password_s:'password',
        confirm_s:'',
        authenticated:false,
      
        userId:'',
        }
    }
  
    onCompleteLogin=()=>{
        const{authenticated, isSignUpVisible, isLogInVisible}=this.state;
        var firstUser="no";
        var creator="yes";
        this.props.callBackFromApp (authenticated, isSignUpVisible, isLogInVisible, firstUser, creator);
    }
    onCancelClick=()=>{
      var authenticated= false;
      var isSignUpVisible='no';
      var isLogInVisible='no';
      var firstUser='no';
      this.props.callBackFromApp(authenticated, isSignUpVisible, isLogInVisible, firstUser);
    }
   
    
    clickSignUp =()=>{

           var loginValue="no";
           var signUpValue="yes";

        const{authenticated, isSignUpVisible, isLogInVisible}=this.state;
        this.props.callBackFromApp (authenticated, signUpValue, loginValue);
        
      
      }

    handleSubmitLogin =()=> {
        if(!this.state.email_s==''&& !this.state.password_s==''){
            //start activity indicator
            this.setState({isIndicatorVisible: 'yes'})
            var that=this;
        const { email_s, password_s,} = this.state;
        
      firebase
          .auth()
          .signInWithEmailAndPassword(email_s, password_s )
          .then((user) => {
           // Close Window
             if(user){
              firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
              that.setState({
                error_value: 'Login Successful: ',

                authenticated:true,
                isSignUpVisible:'no',
                isLogInVisible:'no',

                isIndicatorVisible: 'no',
              })
            }
               var uid=firebase.auth().currentUser.uid;
               //on successful login, send data to app
               that.onCompleteLogin();
    
           //dont forget to dismiss indicator and sign up modal
           //test data mikevee2013@gmail.com password
          })
          .catch((error) => {
            var errorMsg= error.message;
            this.setState({ error_value: 'Something went wrong, DID YOU REGISTER? '+errorMsg});
            this.setState({isIndicatorVisible: 'no'})
          });
      
        }
        else{
          this.setState({ error_value:'Enter all Fields' });
          this.setState({isIndicatorVisible: 'no'})
    
        }
        
      };
    render() {
         // method for activity indicator
    const ShowActivityIndicator =()=>{
        if(this.state.isIndicatorVisible=='yes'){
          //true, show indicator
          return( <ActivityIndicator size='large'/>);
        }
        else{
          //false, do not show indicator
          return(null)
        }
      };
        return (
            <View style={styles.modal_container}>
            <View style={styles.textView}>
            <Text style={styles.mainText}>Apparel Inc.</Text>
            </View>
            <View style={styles.textView}>
            <Text style={{fontSize: 18, padding:5, fontFamily:'Pacifico'}}>Built for creators</Text>
            </View>
            <View 
            style={{borderColor: 'transparent', padding:10,}}
            animationType="slide"
            transparent={false}
            >
            <View style={styles.textView}>
            </View>
                
               
                <TextInput style={styles.textInput}
                multiline={false}
                
                editable = {true}
                onChangeText={(value_)=>this.setState({email_s: value_})}
                value={this.state.email_s}
                placeholder="Email"/>
                
                <TextInput style={styles.textInput}
                multiline={false}
                editable = {true}
                secureTextEntry={true}
                onChangeText={(value_)=> this.setState({password_s: value_})}
                value={this.state.password_s}
                placeholder="Password"
                
                />
                
            <Button color="#9c937f" title="Login"
            onPress={this.handleSubmitLogin} />
            <TouchableOpacity onPress={this.clickSignUp}>
            <Text style={{marginTop:7, padding:10,}}>Not a member, sign up here</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onCancelClick}>
            <Text style={{padding:10, color:'red',textAlign:'right'}}>CANCEL</Text>
            </TouchableOpacity>
            
            <ShowActivityIndicator/>
        
            </View>
            <View><Text style={{margin: 'auto', color:'red', width:textInputWidth+20}}>
            {this.state.error_value}</Text></View>

        </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    modal_container: {
        height:'100%',
        width:'100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        position:'absolute',
        backgroundColor:'white',
        //borderWidth:2,
        //borderColor:'black'
       
      },
      textView:{
        justifyContent:'center',
        alignItems:'center'
      },
      mainText:{
        textAlign:'center',
          fontSize:30,
          fontWeight:'bold',
          fontFamily: 'Pacifico',
          
      },
      text:{
          textAlign:'center',
          fontSize:20,
          fontWeight:'bold',
      },
      textInput:{
        height: 40, 
        width:textInputWidth,
        borderColor: 'gray', 
        borderWidth: 1,
        borderRadius: 4,
        margin: 10,
        
      },
    
});

//make this component available to the app
export default Login;
