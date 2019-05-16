import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, Dimensions, TouchableOpacity,
          ListView} from 'react-native'

var device_width= Dimensions.get('window').width;
var thumbnail_size;
var thumb_index_end;
var marginPercent;
var titleHeight;
var style_percent_margin =10;

if(device_width>250 && device_width<400){
    thumbnail_size=90;
    thumb_index_end=7;
    marginPercent=16;
    titleHeight=50;
    
  }
  else if(device_width>400 && device_width<500){
    thumbnail_size=160;
    thumb_index_end=28;
    marginPercent=16;
    titleHeight=50;
  }
  else if(device_width>500 && device_width<700){
    thumbnail_size=170;
    thumb_index_end=35;
    marginPercent=13;
    titleHeight=50;
  }
  else if(device_width>700){
    thumbnail_size=250;
    thumb_index_end=40;
    marginPercent=5;
    titleHeight=50;
  }

class MainGrid extends Component {
    constructor(props){
        super(props)
        this.state={
            thumbnail: require('./item_img_1.png'),
            dataSource: new ListView.DataSource({
              rowHasChanged: (row1, row2)=> row1 !== row2
          }),
          
          itemId:'',
          showItem:'no',
        }

    }
    getDataSource(items){
      if(!items) return;
      return this.state.dataSource.cloneWithRows(items);
  }
  

  componentDidMount() {
      this.setState({dataSource: this.getDataSource(this.props.items)});
  }
  componentWillReceiveProps(props) {
      this.setState({dataSource: this.getDataSource(props.items)});
  }
  ViewMore=(itemKey)=>{
      alert(itemKey);
  }
  pressItem=(itemId)=>{
      //open view and show
      this.setState({
          itemId: itemId,
          showItem: "yes",
      })  
  }
  renderRow = (item) => {
    var itemId= item.uid;
    var title=item.Title;
    var shortTitle=title.substring(0,thumb_index_end)
    var completeTitle;
    var stringLength=item.Title.length;
    if(stringLength>thumb_index_end){
      completeTitle= shortTitle +'...';
    }
    else{
      completeTitle=shortTitle;
    }
    
     return (
       <View style={{marginRight:15}}>
         <TouchableOpacity activeOpacity={0.7}>

         <View style={styles.thumbnail_view}>
            <Image style={styles.thumbnail_img} source={item.MainImage ||this.state.thumbnail} />
            <View>
                <View style={styles.titleView}>
                <Text style={styles.text}>{completeTitle}</Text>
                </View>
                <Text style={styles.text_price}>{item.Price}</Text>
            </View>
          </View>

         </TouchableOpacity>
       </View>
         )
 }

  render() {
    
    return (
      <View style={styles.container}>
        <Text style={{marginLeft:'5%', fontFamily:'Pacifico', 
          fontWeight:'normal',}}>All Items</Text>
         <ListView
            contentContainerStyle={styles.listRow}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            />
            
      </View>
    )
  }
}

const styles= StyleSheet.create({
  container:{
    marginTop:style_percent_margin, 
    flex:1, 
    
    justifyContent:'center'
  },
      thumbnail_img:{
          width: thumbnail_size,
          height: thumbnail_size,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6, 
      },
      listRow:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent:'center',
        paddingLeft: 15,
      },
      titleView:{
          width: thumbnail_size,
          height: titleHeight,
          display: 'flex',
          flexDirection: 'column',
          justifyContent:'flex-end'
      },
      thumbnail_view:{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        borderRadius:6,
        padding:5,
        marginVertical: 10,
      },
      text:{
        marginTop:5,
        fontSize: 16,
      },
      text_price:{
        fontWeight:'bold',
        width: thumbnail_size,
        fontSize: 18,
      },
})
export default MainGrid;

