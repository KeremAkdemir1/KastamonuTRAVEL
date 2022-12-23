import { Dimensions, Pressable, TouchableHighlight,Image } from "react-native"
import WebView from "react-native-webview"
import {Text,View,ActivityIndicator,StyleSheet} from 'react-native'
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native";
import { render } from "react-dom";
import Icon from 'react-native-vector-icons/Ionicons';
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
    const nextPhoto = () => {
      setIndex((prevState) => prevState + 1);
      setUrl(`https://kastamonutravelguide.com/en/3dviever?imagename=${images[index].filename}&id=${route.params?.itemid}`)
    }
    const prevPhoto = () => {
      setIndex(index - 1)
      setUrl(`http://kastamonutravelguide.com/en/3dviever?imagename=${images[index].filename}&id=${route.params?.itemid}`)
    }
    return(
        <View style={{position:'absolute'}}>
           <View style={styles.topbarView}>
        <View style={styles.rectangleView} />
        <Text style={styles.titleText}>{route.params?.itemtitle.substring(0,10)}...({index}/{images.length -1 })</Text>
        <Pressable
            style={styles.goBack}
            onPress={() => navigation.goBack()}
        >
            <Image
                style={styles.goBackIcon}
                source={require("../assets/goBack.png")}
                resizeMode="cover"
            />
        </Pressable>
        
        </View>
        <WebView
        startInLoadingState={true}
        javaScriptEnabled={true}
        scrollEnabled={false}
        source={{ uri: url}}
        overScrollMode='never'
        containerStyle={{opacity:0.99,width:Dimensions.get('window').width,height:Dimensions.get('window').height}}
      />
      <View style={{position:'absolute',top:Dimensions.get('window').height - 100,left:30,display:index === 0 ? 'none' : 'flex'}}>
        <TouchableHighlight onPress={() => prevPhoto()} underlayColor='transparent'>
            <View style={{backgroundColor:'white',width:50,height:50,borderRadius:40}}>
            <Icon  name="arrow-undo-outline" size={34} style={{left:6,top:3}}/>
            </View>
        </TouchableHighlight>
      </View>
      <View style={{position:'absolute',top:Dimensions.get('window').height - 100,left:Dimensions.get('window').width - 80,display:index === images.length -1 ? 'none' : 'flex'}}>
        <TouchableHighlight underlayColor='transparent' onPress={() => nextPhoto()}>
            <View style={{backgroundColor:'white',width:50,height:50,borderRadius:40}}>
                <Icon  name="arrow-redo-outline" size={34} style={{left:10,top:3}}/>
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