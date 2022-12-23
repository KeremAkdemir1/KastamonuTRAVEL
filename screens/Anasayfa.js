import React, { useState, useEffect,memo, useMemo, useRef, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  TextInput,
  StatusBar, Animated,
  Keyboard
} from "react-native";
import {CollapsibleNavBarScrollView} from '@busfor/react-native-collapsible-navbar-scrollview';
import Icon from 'react-native-vector-icons/Ionicons';
import Category from "../component/Category";
import PopularPost from "../component/PopularPost";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import I18n from "i18n-js";
import { LinearGradient } from 'expo-linear-gradient';
import Tours from "../component/Tours";
const deviceWidth = Dimensions.get('screen').width
const HEADER_MAX_HEIGHT = 320;
const HEADER_MIN_HEIGHT = 26;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const Anasayfa = () => {
  let [fontsLoaded] = useFonts({
    'Futura-Bold': require("../assets/fonts/Jost-VariableFont_wght.ttf"),
    'Futura-Bold': require("../assets/fonts/Jost-VariableFont_wght.ttf"),
    
  })

  useEffect(() => {
    Keyboard.dismiss()
  }, [])
  
  const animatedValue = useMemo(() => new Animated.Value(0), []);
  const scrollViewRef = useRef();
  const viewRef = useRef();
  const [short,setShort] = useState('none')
  const [shortImage,setShortImage] = useState('flex')

  const onPress = useCallback(() => {
    if (scrollViewRef.current && viewRef.current) {
      scrollViewRef.current.scrollToView(viewRef.current);
    }
  }, []);
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar  hidden/>
      <CollapsibleNavBarScrollView
        ref={scrollViewRef}
        headerMinHeight={HEADER_MIN_HEIGHT}
        headerMaxHeight={HEADER_MAX_HEIGHT}
        header={
          <View>
            <LinearGradient  colors={['#5AC7D5',  '#45915B']} style={{position:'relative',top: 293,height:26}}/>
            <Image source={require('../assets/AnasayfaCollapse.png')} style={{top:-50,position:'absolute',width:Dimensions.get('screen').width,height: 370,display:shortImage}}/>
             <Text style={styles.collapseText1}>{I18n.t('kastamonuyu')}</Text>
             <Text style={styles.collapseText2}>{I18n.t('kesfet')}</Text>
            <Text style={{position:'absolute',width:Dimensions.get('window').width,marginTop:295,textAlign:'center',alignContent:'center',alignItems:'center',display:short,fontFamily:'Futura-Bold',fontWeight:'500',fontSize:17,color:'white'}}>{I18n.t('kastamonuyuKesfet')}</Text>
            </View>
        }
        animatedValue={animatedValue}
        useNativeDriver={false}
        onChangeState={(state) => {
          if(state === 'open'){
            setShort('none')
            setShortImage('flex')
          }else{
            setShort('flex')
            setShortImage('none')
          }
        }}
        overScrollMode='never'
        >
      <View>
      <View
            style={styles.searchBarView}
          >
           <TextInput
             style={styles.textInput}
             theme={{ colors: { background: "#fff" } }}
             placeholder= {I18n.t('nereyeGitmekIstıyosun')}
             onPressIn={() => navigation.navigate("Ara")}
             focusable={false}
             editable={false} 
             selectTextOnFocus={false}
            />
             <Icon name='search-outline' size={34} style={{ position: 'absolute',top:30, left: 20 }} />
        </View>
       <Category />


        <View style={styles.populerDestinationsView}>
        <Text style={styles.populerDestinationsText}>{I18n.t('populerDestinasyonlar')}</Text>
        <PopularPost />
          
      </View>
        
        <Text style={styles.shortToursTextx}>{I18n.t('kisaTurlar')}</Text>
        <Tours/>
      </View>
      </CollapsibleNavBarScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
  content: {
    backgroundColor: '#b8e2f5',
    height: 200,
    marginBottom: 12,
  },
  scrollToView: {
    backgroundColor: '#b8bff5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  shortToursTextx: {
    position: "relative",
    fontSize: 20,
    fontFamily: "Futura-Bold",
    fontWeight: 'bold',
    color: "#000",
    bottom: 10,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    width: 146,
    marginTop:32,
    left:20
  },
  populerDestinationsView: {
    position: "relative",
    width: 443,
    height: 255,
    flexShrink: 0,
    marginTop: 12,
    zIndex:99
  },
  populerDestinationsText: {
    position: "relative",
    top: 10,
    bottom:10,
    left:20,
    height:30,
    fontSize: 20,
    fontFamily: "Futura-Bold",
    fontWeight: 'bold',
    color: "#000",


  },
  textInput: {
    position: "relative",
    top:20,
    left: 0,
    marginLeft:10,
    marginRight:10,
    borderRadius: 35,
    backgroundColor: "#fff",
    shadowRadius: 1,
    elevation: 6,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 1,
    width: Dimensions.get('window').width - 20,
    height: 55,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Futura-Bold'
  },
  searchBarView: {
    position: "relative",
    width: 418,
    height: 75,
  },
  collapseText1: {
    position: 'absolute',
    fontSize: 45,
    top: 150,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 10 },
    textShadowRadius: 5,
    left: 10,
    color: "#FFFFFF"
  },
  collapseText2: {
    position: 'absolute',
    fontSize: 45,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 10 },
    textShadowRadius: 5,
    top: 210,
    left: 10,
    color: "#FFFFFF"
  },
  collapsePhoto: {
    position: 'absolute',
    top: -30,
    width: deviceWidth,
    height: 200
  },
})
export default Anasayfa;