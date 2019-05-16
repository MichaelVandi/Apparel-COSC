import React from "react";
import { View, Text, Button, StyleSheet, Modal, TextInput,
          ScrollView, Dimensions, TouchableOpacity, Image,} from "react-native";
          
import firebase from './firebase';
  import Featured from './Featured';
  import MainGrid from './MainGrid';

  import { withRouter } from "react-router-dom";
         

   var device_width= Dimensions.get('window').width;


// create a component
class HomeScreen extends React.Component {
constructor(props){
  super(props)
  this.state={
    signUpVisible:true,
    name_text: 'Me',
    pictures:[],

  items:[],
}
};
componentWillMount() {
 //get firebase user
 var that =this;
 firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in. Get items reference and set data to state
    firebase.database().ref('ALL_ITEMS/').on('value', function(data) {
      that.setState({ items: data.val() });
  });
  } else {
    // No user is signed in. display dummy data like loading
    firebase.database().ref('ALL_ITEMS/').on('value', function(data) {
      that.setState({ items: data.val() });
  });
  }
});
}

render (){
  
  return (
    <View style={styles.container}>
    {/*<ShowSignUp/>*/}
   {/*<Members posts={this.state.posts}/>*/}
   <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      
        <Featured items={this.state.items}/>
        <MainGrid items={this.state.items}/>
        </ScrollView>
    </View>
  );
}

}
   
    

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
  },

});

//make this component available to the app
export default withRouter(HomeScreen);


