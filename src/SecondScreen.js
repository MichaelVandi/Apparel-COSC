import React from "react";
import { View, Text, StyleSheet, Button, TextInput, Modal, TouchableOpacity, Image, Dimensions, 
ScrollView, ActivityIndicator } from "react-native";
import {storage} from './firebase';
import firebase from './firebase';

import Name from './Edit/Name';
import Price from './Edit/Price';
import Desc from './Edit/Desc';
import Size from './Edit/Size';
import Sex from './Edit/Sex';
import Interests from './Edit/Interests';



var device_width= Dimensions.get('window').width;
var upload_icon_size;

var uploadMainImage="main"
var uploadImage1="img1"
var uploadImage2="img2"
var uploadImage3="img3"
var global_item_key="";
var itemRef=null;



var img_width;
if(device_width>250 && device_width<400){
img_width=220;
upload_icon_size=50;
}
else if(device_width>400 && device_width<500){
  img_width=250;
  upload_icon_size=30;
}
else if(device_width>500 && device_width<700){
  img_width=320;
  upload_icon_size=50;
}
else if(device_width>700){
  img_width=460;
  upload_icon_size=50;
}


class SecondScreen extends React.Component{
  constructor(props){
    super(props);

    this.state={
      main_img: require('./grey_shirt.png'),
      img1: null,
      img2: null,
      img3: null,
      image:null,
      main_img_url: '', img1_url:'', img2_url:'', img3_url:'',
      progress: 0, upload_error:'', image_name:'',
      modalVisible: false, cancelled: 'no', temp_ref: null, item_key:'', uid:'',
    
      name_value:'', price_value:'',
      desc_value:"", size_value:'',
      sex_value:'',
      interests_value:'',

      editName: 'no', editEmail: 'no', editPhone: '', editTitle: '', editSkills:'',
      editInterests:'',

    }
    this.handleChangeMain = this.handleChangeMain.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.triggerEditName=this.triggerEditName.bind(this);

  }
  
  componentWillMount(){
    if(firebase.auth().currentUser!=null){
      var uid=firebase.auth().currentUser.uid;
      var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 6; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       var global_item_key=result;
       
      var temp_key= firebase.database().ref("TEMPORARY_UPLOAD/"+uid+"/"+global_item_key);
      this.setState({
          temp_ref: temp_key,
          item_key: result,
          uid: uid

      });
      temp_key.update({
        //update title and other values
                  Title: 'Click Edit to update title',
                  Price: 'Click Edit to update price',
                  Desc: 'Click Edit to update description',
                  Size: 'Click Edit to update size',
                  Sex: 'Click Edit to update sex',
      })

    }
    
  }
  loadDataFromFirebase=()=>{
    //Get firebase auth uid, Get reference and set the data to state
    //Different views then load it from state
  }
  handleChangeMain = e => {
    if (e.target.files[0]) {
        const image = e.target.files[0];
          this.setState(() => ({image}));
          this.setState({image_name: 'Main Image Selected: '+ image.name + ' Click Main Image UPLOAD icon above'})
    }
  }
  handleChange1 = e =>{
    if(e.target.files[0]){
      const img1 = e.target.files[0];
      this.setState(() => ({img1}));
      this.setState({image_name: 'Image 1 Selected: '+ img1.name + ' Click Sub Image 1 UPLOAD icon'})
    }
  }
  handleChange2 = e =>{
    if(e.target.files[0]){
      const img2 = e.target.files[0];
          this.setState(() => ({img2}));
          this.setState({image_name: 'Image 2 Selected: '+ img2.name + ' Click Sub Image 2 UPLOAD icon'})
    }
  }
  handleChange3 = e =>{
    if(e.target.files[0]){
      const img3 = e.target.files[0];
          this.setState(() => ({img3}));
          this.setState({image_name: ' Sub Image 3 Selected: '+ img3.name + ' Click Sub Image 3 UPLOAD icon'})
    }
  }

  //Upload Image Function
  handleUpload = (new_image) => {
    var that = this;
    const {image, img1, img2, img3, item_key, uid} = this.state;
    const storageRef= storage.ref('ITEM_IMAGES/'+uid+"/"+item_key);
    var mainImgRef= storageRef.child('mainImg')
    var image1Ref=storageRef.child('img1');
    var image2Ref=storageRef.child('img2');
    var image3Ref=storageRef.child('img3');
    switch(new_image){
      case 'main':
      const uploadTask = mainImgRef.put(image);
      uploadTask.on('state_changed', 
      (snapshot) => {
        // progress function ....
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({progress});
      }, 
      (error) => {
           // error function ....
        console.log(error);
        this.setState({upload_error: error})
      }, 
    () => {
        // complete function ....
        mainImgRef.getDownloadURL().then(url => {
            console.log(url);
            // setting the downloaded url to state for it to display in img view
            this.setState({main_img_url:url});
            //Setting the url to the database of items. At this phase its two databases
            //one for main items and another for top picks using tf idf
            const {temp_key}= this.state;
            if(temp_key!=null){
              temp_key.update({
                MainImage: url,
            })
            .catch((error)=>{
              that.setState({
                upload_error: 'Something went wrong, try again'
              })
            });
            temp_key.child('MainImage').once('value', function(snapshot){
              if(snapshot.exists()){
                //upload completed dismiss necessary views
                // show update successful and dismiss indicator
                that.setState({upload_error: 'Successfully Uploaded Main Image!'})
        
              }
              else{
                that.setState({
                  upload_error: 'Something went wrong, try again'
                })
              }
            })
            }
           
        })
    });
      break;
      case 'img1':
      const uploadTask1 = image1Ref.put(img1);
      uploadTask1.on('state_changed', 
      (snapshot) => {
        // progress function ....
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({progress});
      }, 
      (error) => {
           // error function ....
        console.log(error);
        this.setState({upload_error: error})
      }, 
    () => {
        // complete function ....
        image1Ref.getDownloadURL().then(url => {
            console.log(url);
            // setting the downloaded url to state for it to display in img view
            this.setState({img1_url:url});
            //Setting the url to the database of items. At this phase its two databases
            //one for main items and another for top picks using tf idf
            const {temp_key}= this.state;
            if(temp_key!=null){
              temp_key.update({
                Img1: url,
            })
            .catch((error)=>{
              that.setState({
                upload_error: 'Something went wrong, try again'
              })
            });
            temp_key.child('Img1').once('value', function(snapshot){
              if(snapshot.exists()){
                //upload completed dismiss necessary views
                // show update successful and dismiss indicator
                that.setState({upload_error: 'Successfully Uploaded Sub Image 1!'})
        
              }
              else{
                that.setState({
                  upload_error: 'Something went wrong, try again'
                })
              }
            })
            }
           
        })
    });

      break;
      case 'img2':
      const uploadTask2 = image2Ref.put(img2);
      uploadTask2.on('state_changed', 
      (snapshot) => {
        // progress function ....
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({progress});
      }, 
      (error) => {
           // error function ....
        console.log(error);
        this.setState({upload_error: error})
      }, 
    () => {
        // complete function ....
        image2Ref.getDownloadURL().then(url => {
            console.log(url);
            // setting the downloaded url to state for it to display in img view
            this.setState({img2_url:url});
            //Setting the url to the database of items. At this phase its two databases
            //one for main items and another for top picks using tf idf
            const {temp_key}= this.state;
            if(temp_key!=null){
              temp_key.update({
                Img2: url,
            })
            .catch((error)=>{
              that.setState({
                upload_error: 'Something went wrong, try again'
              })
            });
            temp_key.child('Img2').once('value', function(snapshot){
              if(snapshot.exists()){
                //upload completed dismiss necessary views
                // show update successful and dismiss indicator
                that.setState({upload_error: 'Successfully Uploaded Sub Image 2!'})
        
              }
              else{
                that.setState({
                  upload_error: 'Something went wrong, try again'
                })
              }
            })
            }
           
        })
    });

      break;
      case 'img3':
      const uploadTask3 = image3Ref.put(img3);
      uploadTask3.on('state_changed', 
      (snapshot) => {
        // progress function ....
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({progress});
      }, 
      (error) => {
           // error function ....
        console.log(error);
        this.setState({upload_error: error})
      }, 
    () => {
        // complete function ....
        image3Ref.getDownloadURL().then(url => {
            console.log(url);
            // setting the downloaded url to state for it to display in img view
            this.setState({img3_url:url});
            //Setting the url to the database of items. At this phase its two databases
            //one for main items and another for top picks using tf idf
            const {temp_key}= this.state;
            if(temp_key!=null){
              temp_key.update({
                Img3: url,
            })
            .catch((error)=>{
              that.setState({
                upload_error: 'Something went wrong, try again'
              })
            });
            temp_key.child('Img3').once('value', function(snapshot){
              if(snapshot.exists()){
                //upload completed dismiss necessary views
                // show update successful and dismiss indicator
                that.setState({upload_error: 'Successfully Uploaded Sub Image 3!'})
        
              }
              else{
                that.setState({
                  upload_error: 'Something went wrong, try again'
                })
              }
            })
            }
           
        })
    });

      break;
    }
}
    uploadBtnClicked(history){
      //check if at least main image and all other descriptions were listed
      
      if(this.state.main_img_url!=''){
            var temporaryReference= this.state.temp_ref;
              
              if (temporaryReference==null){
                alert('Null Reference')
              }
              else{
                temporaryReference.on('value', (snapshot) =>{

                  if(snapshot.val().Title=="Click Edit to update title" || 
                  snapshot.val().Price=="Click Edit to update price" ||
                  snapshot.val().Desc=="Click Edit to update description"
                  ||snapshot.val().Size=="Click Edit to update size" || 
                  snapshot.val().Sex=="Click Edit to update sex"){
                    // Please enter all details
                    this.setState({
                      upload_error: 'Something went wrong, try again'
                    })
                    
                  }
                  else{
                    //all values have been entered, upload content
                    var itemId=this.state.item_key;
              
                  var userId= firebase.auth().currentUser.uid;
                    var itemRef=firebase.database().ref("ALL_ITEMS/"+userId+itemId);
                    var that = this;
                    itemRef.update({
                      MainImage: this.state.main_img_url,
                      Img1:this.state.img1_url,
                      Img2: this.state.img2_url,
                      Img3: this.state.img3_url,
                      Title: this.state.name_value,
                      Price: this.state.price_value,
                      Desc: this.state.desc_value,
                      Sex: this.state.sex_value,
                      Size: this.state.size_value

                    })
                    .catch((error)=>{
                      that.setState({
                        
                        upload_error: 'Something went wrong, try again'
                      })
                    })
                    //Check if it has been uploaded
                    itemRef.child('MainImage').once('value', function(snapshot){
                      if(snapshot.exists()){
                        //upload completed dismiss necessary views
                      alert('Successfully uploaded item. Your Item can now be viewed by customers!!' +
                      "\nNext Steps: Share item on other platforms")
                       // show update successful and dismiss view
                       
        
                      }
                      else{
                          this.setState({
                              upload_error: "Something went wrong, try again"
                            })
                      }
                    })
        
                  }
                  
                    
                  })
          }

      }
      else{
        alert("For people to see what you are selling, please enter main item image")
      }
      //upload values
      //show alert when done
      //Dismiss, redirect to main
    }



triggerEditName=()=>{
  if(!this.state.modalVisible){
  this.setState({
    editName: 'yes'
  })
}
} 
triggerEditEmail=()=>{
  if(!this.state.modalVisible){
  this.setState({
    editEmail: 'yes'
  })
}
}
triggerEditPhone=()=>{
  if(!this.state.modalVisible){
  this.setState({
    editPhone: 'yes'
  })
}
}
triggerEditTitle=()=>{
  if(!this.state.modalVisible){
  this.setState({
    editTitle: 'yes'
  })
}
}
triggerEditSkills=()=>{
  if(!this.state.modalVisible){
  this.setState({
    editSkills: 'yes'
  })
}
}
triggerEditInterests=()=>{
  if(!this.state.modalVisible){
  this.setState({
    editInterests: 'yes'
  })
}
}
      
editResult=(message, cancelled)=>{
          this.setState({
            upload_error: message,
            cancelled:cancelled
          })
          switch(cancelled){
            //dismiss relevant views and  set modal to null
            case 'name':
            this.setState({
              editName:'no',
              modalVisible: false,
            })
            break;
            case 'email':
            this.setState({
              editEmail: 'no',
              modalVisible: false,
            })
            break;
            case 'title':
            this.setState({
              editTitle: 'no',
              modalVisible: false,
            })
            break;
            case 'phone':
            this.setState({
              editPhone: 'no',
              modalVisible: false,
            })
            break;
            case 'skills':
            this.setState({
              editSkills: 'no',
              modalVisible: false,
            })
            break;
            case 'interests':
            this.setState({
              editInterests: 'no',
              modalVisible: false,
            })
            break;
          }
       
      }
      componentDidMount(){
        
        firebase.auth().onAuthStateChanged((user)=>{
          if(user!=null){
            // var itemId=this.state.item_key;
            // var userId= firebase.auth().currentUser.uid;
            //   var itemRef=firebase.database().ref("ALL_ITEMS/"+userId+global_item_key);
            var temporaryReference= this.state.temp_ref;
              
              if (temporaryReference==null){
                alert('null reference')
              }
              else{
                
                temporaryReference.on('value', (snapshot) =>{
                 
                    this.setState({
                      name_value: snapshot.val().Title,
                      price_value: snapshot.val().Price,
                      desc_value: snapshot.val().Desc,
                      size_value: snapshot.val().Size,
                      sex_value: snapshot.val().Sex,
                  })
                  
                
              // alert(snapshot.val().Title);
              // if(snapshot.val().Desc==null){
              //   this.setState({
              //     desc_value: 'Click Edit to update description'
              //   })
              // }
              // if(snapshot.val().Size==null){
              //   this.setState({
              //     size_value: "Click Edit to Update size"
              //   })
              // }
              // if(snapshot.val().Sex==null){
              //   this.setState({
              //     sex_value: "Click Edit to Update sex"
              //   })
              // }
              // if(snapshot.val().Title==null){
              //   this.setState({
              //     name_value: "Click Edit to Update Title"
              //   })
              // }
              //  if(snapshot.val().Price==null){
              //   this.setState({
              //     price_value: "Click Edit to Update price"
              //   })
              // }
        
             })
              }

          }
         
        })
       
      }

      


render (){
  


  this.loadDataFromFirebase;//mikevee2013@gmail.com password
  const ShowEditName =()=>{
   
    if(this.state.editName=='yes'){
      return(<Name callBack={this.editResult} temporaryReference={this.state.temp_ref}/>)
    }
    else{
      return(null);
    } }
  const ShowEditPrice =()=>{
    
    if(this.state.editEmail=='yes'){
      return(<Price callBack={this.editResult} temporaryReference={this.state.temp_ref}/>)
    }
    else{
      return(null);
    } }
   const ShowEditDesc =()=>{
    
    if(this.state.editPhone=='yes'){
      return(<Desc callBack={this.editResult} temporaryReference={this.state.temp_ref}/>)
    }
    else{
      return(null);
    }}
    const ShowEditSize =()=>{
    
      if(this.state.editTitle=='yes'){
        return(<Size callBack={this.editResult} temporaryReference={this.state.temp_ref}/>)
      }
      else{
        return(null);
      }}
      const ShowEditSex =()=>{
    
        if(this.state.editSkills=='yes'){
          return(<Sex callBack={this.editResult} temporaryReference={this.state.temp_ref}/>)
        }
        else{
          return(null);
        }}
        const ShowEditInterests =()=>{
    
          if(this.state.editInterests=='yes'){
            return(<Interests callBack={this.editResult}/>)
          }
          else{
            return(null);
          }}
          // function to load data from firebase

          
  //defining main image
   const MainImg = () => (
    <View>

    <Image style={styles.main_img} source={this.state.main_img_url || this.state.main_img}  />
    
    <View style={{display:'flex', flexDirection:'row', margin: 10,}}>
    <TouchableOpacity>
    <label style={{backgroundColor:'#DADDDD', padding: 5, borderRadius: 4}}> Choose
    <input style={{color:'#DADDDD', display: 'none'}} type="file"
    onChange={this.handleChangeMain}/>
    </label>
    </TouchableOpacity>
    
      <TouchableOpacity onPress={()=>this.handleUpload(uploadMainImage)}>
                <Image style={styles.uploadIcon} source={require('./upload_icon.png')}/>
              </TouchableOpacity>  
          </View>
          </View>
    
    );
    const SubImages=()=>(
      <View style={{marginRight: img_width*0.17}}>
            <View>
             <Image style={styles.sub_img} source={this.state.img1_url || this.state.main_img}  />
            <View style={styles.sub_editable_view}>
            <TouchableOpacity>
            <label style={{backgroundColor:'#DADDDD', padding: 5, borderRadius: 4,}}> Choose
    <input style={{color:'#DADDDD', display: 'none'}} type="file"
    onChange={this.handleChange1}/>
    </label>
    </TouchableOpacity>
              <View style={styles.edit_btn}>
              <TouchableOpacity onPress={()=>this.handleUpload(uploadImage1)}>
                <Image style={styles.uploadIcon} source={require('./upload_icon.png')}/>
              </TouchableOpacity>
              </View>
              </View>
                   </View>

                   <View>
             <Image style={styles.sub_img} source={this.state.img2_url || this.state.main_img}  />
            <View style={styles.sub_editable_view}>
            <TouchableOpacity>
            <label style={{backgroundColor:'#DADDDD', padding: 5, borderRadius: 4}}> Choose
    <input style={{color:'#DADDDD', display: 'none'}} type="file"
    onChange={this.handleChange2}/>
    </label>
    </TouchableOpacity>
               <TouchableOpacity onPress={()=>this.handleUpload(uploadImage2)}>
                <Image style={styles.uploadIcon} source={require('./upload_icon.png')}/>
              </TouchableOpacity>
              </View>
                   </View>

                   <View>
             <Image style={styles.sub_img} source={this.state.img3_url || this.state.main_img}  />
            <View style={styles.sub_editable_view}>
            <TouchableOpacity>
            <label style={{backgroundColor:'#DADDDD', padding: 5, borderRadius: 4}}> Choose
    <input style={{color:'#DADDDD', display: 'none'}} type="file"
    onChange={this.handleChange3}/>
    </label>
    </TouchableOpacity>
              <TouchableOpacity onPress={()=>this.handleUpload(uploadImage3)}>
                <Image style={styles.uploadIcon} source={require('./upload_icon.png')}/>
              </TouchableOpacity>
              </View>
                
                   </View>
      </View>
      
    );

  return (<View style={styles.container}>
    <ScrollView style={{margin: 30}}>
    
      <View style={styles.main_img_container}>{/* Image View*/}
      <View>
          <SubImages/>
        </View>
      <View>
        <MainImg/>
        </View>
        
        
      </View>
      <Text style={{fontFamily:'Monospace', paddingVertical: 7, color:"#2196f3"}}>{this.state.image_name}</Text>
        <View>
          <progress value={this.state.progress} max="100"/>
          <Text>{this.state.upload_error}</Text>
          </View>
        <ShowEditName/>
        <ShowEditPrice/>
        <ShowEditDesc/>
        <ShowEditSize/>
        <ShowEditSex/>
        <ShowEditInterests/>

 

      <View style={styles.info}>{/* Information View*/}
      
        <View style={styles.editable_view}>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.normal_text}>{this.state.name_value}</Text>
            <TouchableOpacity style={styles.edit_btn} onPress={this.triggerEditName}>
              <Text style={styles.edit_text}>Edit</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.editable_view}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.normal_text}>{this.state.price_value}</Text>
            <TouchableOpacity style={styles.edit_btn} onPress={this.triggerEditEmail}>
              <Text style={styles.edit_text}>Edit</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.editable_view}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.normal_text}>{this.state.desc_value}</Text>
            <TouchableOpacity style={styles.edit_btn} onPress={this.triggerEditPhone}>
              <Text style={styles.edit_text}>Edit</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.editable_view}>
          <Text style={styles.label}>Size:</Text>
          <Text style={styles.normal_text}>{this.state.size_value}</Text>
            <TouchableOpacity style={styles.edit_btn} onPress={this.triggerEditTitle}>
              <Text style={styles.edit_text}>Edit</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.editable_view}>
          <Text style={styles.label}>Sex:</Text>
          <Text style={styles.normal_text}>{this.state.sex_value}</Text>
            <TouchableOpacity style={styles.edit_btn} onPress={this.triggerEditSkills}>
              <Text style={styles.edit_text}>Edit</Text>
           </TouchableOpacity>
        </View>
        <Button title="Upload Item" color="grey" onPress={()=> this.uploadBtnClicked()}/>

      </View>
      
      </ScrollView>
    </View>);

};
  
  }

 



const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  main_img_container:{
    alignItems: 'center',
    paddingTop:10,
    display: 'flex',
    flexDirection:'row',
  },
  uploadIcon:{
    width: upload_icon_size,
    height: upload_icon_size,
    marginLeft:3,
  },
  main_img:{
    width:img_width,
    height: img_width,
  },
  sub_img:{
    width:img_width*0.25,
    height: img_width*0.25,
  },
  info:{
    marginTop:10,
    padding:10,
  },
  editable_view:{
    display:'flex',
    flexDirection: 'row',
    padding:7,
  },
  sub_editable_view:{
    display:'flex',
    width:img_width*0.3,
    flexDirection: 'row',
    padding:3,
  },
  label:{
    fontWeight: 'bold',
    fontFamily: '',
    marginRight: 10,
  },
  normal_text:{
    fontFamily: '',
    
  },
  edit_btn:{
    marginLeft: 'auto',
    paddingRight: 6,
    
  },
  edit_text:{
    color: "#2196f3",
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

export default SecondScreen;
