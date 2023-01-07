import { Dimensions, Pressable, TouchableHighlight,Image } from "react-native"
import WebView from "react-native-webview"
import {Text,View,ActivityIndicator,StyleSheet} from 'react-native'
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native";
import { render } from "react-dom";
import Icon from 'react-native-vector-icons/Ionicons';
import I18n from "i18n-js";
const VirtualReality = ({route}) => {

    const [loading,setLoading] = useState(true)
    const [images,setImages] = useState(route.params?.images)

    const [index,setIndex] = useState(0)
    const [url,setUrl] = useState(`https://kastamonutravelguide.com/en/3dviever?imagename=${images[0].filename}&id=${route.params?.itemid}`)
    const navigation = useNavigation()
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          
          });
          return unsubscribe 
    }, [navigation,index])

    return(
        <View style={{position:'absolute'}}>
        <WebView
        startInLoadingState={true}
        javaScriptEnabled={true}
        scrollEnabled={false}
        source={{ uri: url}}
        overScrollMode='never'
        containerStyle={{opacity:0.99,width:Dimensions.get('window').width,height:Dimensions.get('window').height}}
      />
      <View style={{position:'absolute',left:Dimensions.get('screen').width - 100}}>
        <TouchableHighlight onPress={() => navigation.goBack()} underlayColor='transparent'>
            <View style={{backgroundColor:'white',width:80,height:50,borderRadius:10}}>
            <Text style={{textAlign:'center',fontFamily:'Futura-Bold',fontSize:14,top:13,fontWeight:'bold'}}>{I18n.t('geriDon')}</Text>
            </View>
        </TouchableHighlight>
      </View>
      </View>
    )
}


const styles = StyleSheet.create({
    loader: {
        position:'absolute',
        minHeight: "100%",
        display:'flex',
        justifyContent: "center",
        alignItems: 'center',
        left:Dimensions.get('window').width / 2
    },
    topbarView: {
      position: "absolute",
      left: 0,
      width: Dimensions.get('window').width,
      height: 80,
      zIndex:99
  },
  rectangleView: {
      position: "absolute",
      top: 0,
      left: 0,
      borderBottomRightRadius: 25,
      borderBottomLeftRadius: 25,
      backgroundColor: "#fff",
      shadowColor: "rgba(0, 0, 0, 0.5)",
      shadowOffset: {
          width: 0,
          height: 3,
      },
      shadowRadius: 6,
      elevation: 6,
      shadowOpacity: 1,
      width: Dimensions.get('window').width,
      height: 70,
      zIndex:99
  },
  titleText: {
      position: "absolute",
      fontSize: 25,
      fontFamily: "Futura-Bold",
      fontWeight: 'bold',
      color: "#000",
      textAlign: "center",
      alignContent:'center',
      alignItems:'center',
      alignSelf:'center',
      margin:20,
      zIndex:99
  },
  goBack: {
      position: "absolute",
      left: 25,
      top: 23,
      width: 26.25,
      height: 35,
      zIndex:99
  },
  goBackIcon: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
  },
})
export default VirtualReality