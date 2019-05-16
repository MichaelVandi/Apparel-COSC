//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator, Button, Dimensions  } from 'react-native';
import firebase from '../firebase';


var device_width= Dimensions.get('window').width;

var img_width;
if(device_width>250 && device_width<400){
img_width=350;
}
else if(device_width>400 && device_width<500){
  img_width=380;
}
else if(device_width>500 && device_width<700){
  img_width=420;
}
else if(device_width>700){
  img_width=500;
}

// create a component
class Interests extends Component {
    constructor(props){
        super(props);
        this.state={
            error_value:"Error: Can't Update ", isIndicatorVisible:false,
            isErrorVisible:false, nameField:''
        }
    }
    //handleCancel
    cancelClicked=()=>{
        var message="";
        var cancelled='interests';
        this.props.callBack(message, cancelled);
    }
      //handle textChange
  handleTextChange(event){
    this.setState({
      nameField: event.target.value
    })
  }
    updateName=()=>{
        // check if all field is not null
        if(!this.state.nameField==''){
          //data exists, upload, start indicator
      
          var userId= firebase.auth().currentUser.uid;
            var userRef=firebase.database().ref("MEMBERS/"+userId);
            var that = this;
          this.setState({isIndicatorVisible:true});
          userRef.update({
            Interests: this.state.nameField
          })
          .catch((error)=>{
            this.setState({
              isErrorVisible: true,
              error_value: 'Something went wrong, try again'
            })
          })
          //Check if it has been uploaded
          userRef.child('Interests').once('value', function(snapshot){
            if(snapshot.exists()){
              //upload completed dismiss necessary views
             that.setState({
              //upload_error: 'Name Successfully Updated!',
              isIndicatorVisible:false,
              error_value:'',
              isErrorVisible: false,
              //modalVisible:false,
              //editName:'no',
             });
             // show update successful and dismiss modal
             var message="Interests updated Successfully!";
        var cancelled='interests';
        that.props.callBack(message, cancelled);
            }
            else{
                this.setState({
                    isErrorVisible: true,
                    error_value:'Something went wrong, try again.',
                  })
            }
          })
          //dont forget to dismiss indicator
         
        }
        else{
          this.setState({
            isErrorVisible: true,
            error_value:'Please Enter some data',
          })
        }
      
        //close modal set modal visible to false and edit name to no
      }

    render() {

        const ShowError =()=>{
            if(this.state.isErrorVisible){
              return(<Text style={{margin: 'auto', color:'red'}}>{this.state.error_value}</Text>)
            }
            else{
              return (null)
            }
        }
        const ShowIndicator =()=>{
            if(this.state.isIndicatorVisible){
              return(<ActivityIndicator size='small'/>)
            }
            else{
              return (null)
            }
        }

        return (
            <View>
                <Modal style={styles.modal}
        animationType="slide"
          transparent={false} >
          <View>
            <View style={{width: '100%', display: 'flex', flexDirection:'row'}}>
            <Text style={{fontWeight:'bold', marginBottom: 4}}>Edit Interests: Max 200 characters</Text>
            <View style={{justifyContent:'flex-end'}}>
              <ShowIndicator/>
            </View>
            </View>
            
            <textarea 
              multiline={true} editable = {true}
              placeholder ="Enter Your Interests Separated by Comma"
              style={{borderColor:'grey', borderWidth: 1, height: 55, width:'auto',margin: 3,
              borderRadius:4}}
              name="name"
              value={this.state.nameField}
              onChange={this.handleTextChange.bind(this)}
              maxLength={200}
              
              />
              <View style={styles.buttons_div}>
              <Button title="UPDATE" onPress={this.updateName}/>
            <Button title="X" onPress={this.cancelClicked}/>
            </View>
            <ShowError/>
          </View>
        </Modal>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    modal:{
        width:img_width,
        padding: 10,
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderWidth:2,
        borderColor:'transparent',
        shadowOffset:{  width: 5,  height: 5,  },
        shadowColor: 'black',
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        backgroundColor:"#F5F8F9"
       
      },
      buttons_div:{
        width: "100%",
        justifyContent:'space-between',
        display: 'flex',
        marginTop:6,
        flexDirection:'row',
        marginBottom: 5,
    }
});

//make this component available to the app
export default Interests;
