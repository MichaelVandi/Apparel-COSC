//import liraries
import React, { Component } from 'react';
import {  View, Text, StyleSheet, Modal, TextInput, Button, TouchableOpacity,
    ActivityIndicator, Dimensions } from 'react-native';
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
class SignUp extends Component {
    constructor(props){
        super(props);
        this.state={
            isSignUpVisible:'no',
            isLogInVisible:'yes',
            isIndicatorVisible:'no',
            
        error_value:"",
        email_s:'',
        name_s:'',
        password_s:'',
        confirm_s:'',
        authenticated:false,
      
        userId:'',
        }
    }
    onCompleteLogin=()=>{
        var authValue=true;
        var signUpVal="no";
        var loginVal="no";
        var firstUser="yes"
        var creator="yes"
        const{authenticated, isSignUpVisible, isLogInVisible}=this.state;
        this.props.callBackFromApp (authValue, signUpVal, loginVal,firstUser, creator );
       
    }
    onCancelClick=()=>{
      var authenticated= false;
      var isSignUpVisible='no';
      var isLogInVisible='no';
      var firstUser='no';
      this.props.callBackFromApp(authenticated, isSignUpVisible, isLogInVisible, firstUser);
    }
   
    
    clickLogin =()=>{
        var signUpValue="no";
           var loginValue="yes";
           
        const{authenticated, isSignUpVisible, isLogInVisible}=this.state;
        this.props.callBackFromApp (authenticated, signUpValue, loginValue);
        
      
      }

      handleSubmit =()=> {
        
        if(!this.state.name_s==''&& !this.state.email_s==''&& !this.state.password_s==''&& 
        !this.state.confirm_s==''){
          //check if passwords match
          if(this.state.password_s==this.state.confirm_s){
            //passwords match login
            //start activity indicator
            this.setState({isIndicatorVisible: 'yes'})
            var that=this;
        const { email_s, password_s, name_s} = this.state;
        
      firebase
          .auth()
          .createUserWithEmailAndPassword(email_s, password_s )
          .then((user) => {
           // this.props.history.push('/');
           //Upload to database and dismiss
             if(user){
               var uid=firebase.auth().currentUser.uid;
              var memRef=firebase.database().ref('/CREATORS/'+uid);

              memRef.set({
                Name: name_s,
                Email: email_s,
                Phone: "Not yet updated",
                Content: "Not yet updated",
                uid: uid,
              }).then(memRef.once('value', function(snapshot){
                if(snapshot.hasChild('Email')){
                  //data exists
                  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
                  that.setState({
                    error_value: 'Login Successful: ',

                    authenticated:true,
                    isSignUpVisible:'no',
                     isLogInVisible:'no',

                    isIndicatorVisible: 'no',
                  })
                    //on successful login, send data to app
                    that.onCompleteLogin();
                }
                else{
                  //did not find the data in the database
                  that.setState({
                    error_value: 'Something went wrong, We had trouble adding your data to the database. '+
                    'Please try again',
                    isIndicatorVisible: 'no',
                 });
                }
              })).catch((error)=>{
                if (error){
                  //could not add data to database but probably authenticated
                  that.setState({
                    error_value: 'Something went wrong, please try again'
                 });
                }
              }) 
             
             }



    
           //dont forget to dismiss indicator and sign up modal
          })
          .catch((error) => {
            var errorMsg= error.message;
            this.setState({ error_value: 'Something went wrong: '+errorMsg});
            this.setState({isIndicatorVisible: 'no'})
          });
      
          }
          else{
            //passwords do not match
            this.setState({ error_value:"Passwords don't match" });
            this.setState({isIndicatorVisible: 'no'})
    
          }
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
        
        <View 
        style={{borderColor: 'transparent', padding:10,}}
        animationType="slide"
        transparent={false}
        >
            <TextInput style={styles.textInput}
            multiline={false}
            editable = {true}
            onChangeText={(text)=> this.setState({name_s: text})}
            value={this.state.name_s}
            autoFocus={this.state.focus_name}
           onFocus={this.focus_name}
            placeholder="Name"/>
            <TextInput style={styles.textInput}
            multiline={false}
            editable = {true}
            onChangeText={(text)=> this.setState({email_s: text})}
            value={this.state.email_s}
 
            placeholder="Email"/>
            
            <TextInput style={styles.textInput}
            multiline={false}
            editable = {true}
            onChangeText={(text)=> this.setState({password_s: text})}
            value={this.state.password_s}
            secureTextEntry={true}
            placeholder="Password"
            />
            
            <TextInput style={styles.textInput}
            multiline={false}
            editable = {true}
            onChangeText={(text)=> this.setState({confirm_s: text})}
            value={this.state.confirm_s}
            secureTextEntry={true}
           placeholder="Confirm password"
            />
        <Button color="#9c937f" title="Sign Up" onPress={this.handleSubmit} />
        <TouchableOpacity onPress={this.clickLogin}>
        <Text style={{marginTop:7, padding:10, }}>Already a Member, Click Here to Login In</Text>
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
        
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        height:'100%',
        width:'100%',
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
    button:{
        marginHorizontal:10,
        
      },
});

//make this component available to the app
export default SignUp;
