import { Dimensions, ImageBackground, Text, View,StyleSheet,Image } from 'react-native'
import I18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";
import {useEffect,useState,useCallback} from 'react'
import * as Splash from 'expo-splash-screen';
const SplashScreen = () => {
    const navigation = useNavigation()
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            async function prepare() {
                await new Promise(resolve => setInterval(resolve, 1500));
                navigation.navigate('Home')
            }
            prepare();
          });
          return unsubscribe 

    }, []);
  
  
    return (
      <View style={{flex:1,height:Dimensions.get('window').height}}>
        <ImageBackground source={require('../assets/kastamonuLogoBack.png')} style={{width:Dimensions.get('screen').width,height:Dimensions.get('window').height + 50,alignContent:'center',alignItems:'center',alignSelf:'center',position:'absolute',top:-30}}>
            <Image source={require('../assets/kastamonuLogo.png')} style={{width:700,height:700,alignContent:'center',alignItems:'center',alignSelf:'center',position:'absolute',top:-30}}/>
            <Text style={styles.text}>{I18n.t('kastamonuBeled')}</Text>
            </ImageBackground>
      </View>
    );
}
const styles = StyleSheet.create({
    text: {
         textAlign: 'center', 
         top: Dimensions.get('window').height / 2 + 70,
          fontSize: 20, 
          fontFamily: 'Futura-Bold',
        
          fontWeight:'bold'
        }
})
export default SplashScreen