import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, Dimensions, TouchableOpacity,
          ListView} from 'react-native'

var device_width= Dimensions.get('window').width;
var thumbnail_size;
var thumb_index_end;
var marginPercent;
var titleHeight;

if(device_width>250 && device_width<400){
    thumbnail_size=40;
    thumb_index_end=7;
    marginPercent=16;
    titleHeight=50;
    
  }
  else if(device_width>400 && device_width<500){
    thumbnail_size=90;
    thumb_index_end=14;
    marginPercent=16;
    titleHeight=50;
  }
  else if(device_width>500 && device_width<700){
    thumbnail_size=100;
    thumb_index_end=20;
    marginPercent=13;
    titleHeight=50;
  }
  else if(device_width>700){
    thumbnail_size=170;
    thumb_index_end=30;
    marginPercent=5;
    titleHeight=50;
  }

class Featured extends Component {
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
    var style_percent_margin;
    switch(marginPercent){
      case 16:
      style_percent_margin="15.8%";
      break;
      case 13:
      style_percent_margin="13%";
      break;
      case  5:
      style_percent_margin="5%";
      break;
    }
    
    return (
      <View style={{marginTop:style_percent_margin,}}>
          <Text style={{marginLeft:'5%', fontFamily:'Pacifico', 
          fontWeight:'normal',}}>Most popular</Text>
         <ListView style={styles.listStyle}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            />
      </View>
    )
  }
}

const styles= StyleSheet.create({
      thumbnail_img:{
          width: thumbnail_size,
          height: thumbnail_size,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6, 
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
          height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        borderRadius:6,
        padding:5
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
      listStyle:{
        padding:10,
      }
})
export default Featured;

