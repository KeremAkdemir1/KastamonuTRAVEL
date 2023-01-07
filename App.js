import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View,LogBox, Dimensions,ImageBackground, SafeAreaView} from 'react-native';
import {useState,useEffect} from 'react'
import  I18n from 'i18n-js';
import Route from './route/Route'
import {Text,Image} from 'react-native'
import { useFonts } from "expo-font";
import { tr,de,ru,ar,en } from './localization/Translations';
import * as Localization from 'expo-localization';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function App() {
  
    useEffect(() => {
        AsyncStorage.getItem('launch').then((val) => {
          if(val === null){
            setState({ showRealApp: false });
          }else{
            setState({ showRealApp: true });
          }
        })
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        LogBox.ignoreLogs(['componentWillMount has been renamed']);
        LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);
        LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop']);
        LogBox.ignoreLogs(['fontFamily "Futura-Bold" is not a system font and has not been loaded through Font.loadAsync.']);
        LogBox.ignoreAllLogs(true)
    }, [])
    let [locale ,setLocale] = useState(Localization.locale)
    I18n.fallbacks = true;
    I18n.translations = { tr,ar,ru,de,en };
    I18n.locale = locale
    let [fontsLoaded] = useFonts({
        'Futura-Bold': require("./assets/fonts/Jost-VariableFont_wght.ttf"),
        'Futura Md BT': require("./assets/fonts/Jost-VariableFont_wght.ttf"),
      })

      const slides = [
        {
          key: 'one',
          text: I18n.t('launchScreen1'),
          backgroundColor: 'black',
          image: require('./assets/launchScreen1.png')
        },
        {
          key: 'two',
          text: I18n.t('launchScreen2'),
          backgroundColor: '#febe29',
          image: require('./assets/launchScreen2.png')
        },
        {
          key: 'three',
          text: I18n.t('launchScreen3') + I18n.t('launchScreen35'),
          backgroundColor: '#22bcb5',
          image: require('./assets/launchScreen3.png')
        },
        {
          key: 'four',
          text: I18n.t('launchScreen4'),
          backgroundColor: '#22bcb5',
          image: require('./assets/launchScreen4.png')
        }
      ];
      const [state,setState] = useState({
        showRealApp: false
      })
     const renderItem = ({ item }) => {
        return (
          <View style={styles.slide}>
            <ImageBackground style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height + 60,flex:1}} source={item.image} />
            <Text style={styles.descriptionText}>{item.text}</Text>
          </View>
        );
      }
     const renderNextButton = () => {
        return (
          <View style={styles.buttonCircle}>
            <Text style={styles.nextText}>{I18n.t('sonraki')}</Text>
          </View>
        );
      };
      const renderDoneButton = () => {
        return (
          <View style={styles.buttonCircle}>
            <Text style={styles.nextText}>{I18n.t('bitti')}</Text>
          </View>
        );
      };
      const renderPrevButton = () => {
        return (
          <View style={styles.buttonCircle}>
            <Text style={styles.nextText}>{I18n.t('gec')}</Text>
          </View>
        );
      };
     const onDone = () => {
      AsyncStorage.setItem('launch','true')
      setState({ showRealApp: true });
      }
     const RenderIntro = () => {
        if (state.showRealApp) {

            return(<SafeAreaView style={{flex:1}}><Route/></SafeAreaView>);
          } else {
            return <AppIntroSlider renderItem={renderItem} data={slides} onDone={onDone} renderNextButton={renderNextButton} showSkipButton={true} renderSkipButton={renderPrevButton} renderDoneButton={renderDoneButton} />;
          }
      }
    return (
      
        <RenderIntro/>
    );
}
const styles = StyleSheet.create({
  descriptionText: {
    fontSize:Dimensions.get('window').height < 750 ? 14 : 17,
    top:Dimensions.get('window').height / 2 + 100,
    textAlign:'center',
    fontFamily:'Futura-Bold',
    color:'#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    paddingLeft:20,
    paddingRight:20
  },
    buttonCircle: {
        position: "relative",
        top: 5,
        left: 0,
        borderRadius:40,
        backgroundColor: "#fff",
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 6,
        elevation: 6,
        shadowOpacity: 1,
        width: 90,
        height: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    nextText: {
      fontSize:20,
      fontFamily:'Futura-Bold',
      top:5,
      textAlign:'center'
    }
  });
