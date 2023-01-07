import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {NavigationContainer} from '@react-navigation/native'
import React from 'react';
import { Image,StyleSheet,View,Text, Dimensions, SafeAreaView } from 'react-native';
import Anasayfa from '../screens/Anasayfa';
import { createNativeStackNavigator,ImageBackground } from "@react-navigation/native-stack";
import Harita from '../screens/Harita';
import Kategori from '../screens/Kategori';
import Favoriler from '../screens/Favoriler';
import HaritaFullScreen from '../screens/HaritaFullScreen';
import KategoriDetail from '../screens/KategoriDetail';
import GallerySlider from '../screens/GallerySlider';
import Ara from '../screens/Ara';
import SplashScreen from '../screens/SplashScreen';
import { LinearGradient } from 'expo-linear-gradient';
import Itemdetail from '../screens/Itemdetail';
import VirtualReality from '../screens/VirtualReality';
const {Screen,Navigator} = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Router = () => {
    function Home() {
        return (
            <Navigator screenOptions={screenOption}>
            <Screen name='Anasayfa' component={Anasayfa} options={{
                tabBarIcon: ({ focused }) => <Image style={focused ? styles.homeFocusedIcon :styles.icon} source={focused ? require('../assets/homeFocus.png') : require('../assets/home.png')}/>
            }}/>{
            <Screen name='Harita' component={Harita}options={{
                tabBarIcon: ({ focused }) => <Image style={focused ? styles.mapFocusedIcon :styles.icon} source={focused ? require('../assets/mapFocus.png') : require('../assets/map.png')}/>
            }}/>}
            <Screen name='Kategoriler' component={Kategori}options={{
                tabBarIcon: ({ focused }) => <Image style={focused ? styles.catFocusedIcon :styles.icon} source={focused ? require('../assets/categoryFocus.png') : require('../assets/category.png')}/>
            }}/>
            <Screen name='Favoriler' component={Favoriler}options={{
                tabBarIcon: ({ focused }) => <Image style={focused ? styles.favFocusedIcon :styles.icon} source={focused ? require('../assets/favoritesFocus.png') : require('../assets/favorites.png')}/>
            }}/>
        </Navigator>
        );
      }

    const screenOption = {
        detachInactiveScreens: true,
        headerShown : false,
        tabBarShowLabel : false,
        tabBarStyle:{
            borderTopLeftRadius:30,
            borderTopRightRadius:30,
            height:65,
            position: 'absolute',
            backgroundColor: 'black',
            tabBarVisible: false
        },
        tabBarBackground:() =>(
            <LinearGradient  colors={['#5AC7D5',  '#45915B']} style={{height:70,borderTopLeftRadius:15,borderTopRightRadius:15}}/>
          )
         
    }
    return (
      
        <NavigationContainer >
                  <Stack.Navigator screenOptions={{detachInactiveScreens: true,tabBarVisible:true}}  initialRouteName='SplashScreen'>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="HaritaFullScreen"
          component={HaritaFullScreen}
          options={{ headerShown: false}}
        />
         <Stack.Screen
          name="ItemDetail"
          component={Itemdetail}
          options={{ headerShown: false,animation:'none'}}
        />
        <Stack.Screen
          name="Ara"
          component={Ara}
          options={{ headerShown: false,animation:'none' }}
        />
        <Stack.Screen
          name="GallerySlider"
          component={GallerySlider}
          options={{ headerShown: false,animation:'none' }}
        />

        <Stack.Screen
          name="KategoriDetail"
          component={KategoriDetail}
          options={{ headerShown: false,tabBarVisible:true,animation:'none' }}
        />
                  <Stack.Screen
          name="VirtualReality"
          component={VirtualReality}
          options={{ headerShown: false,tabBarVisible:true,animation:'none' }}
        />
          </Stack.Navigator>
        </NavigationContainer>
        
    )
}
const styles = StyleSheet.create({
  homeFocusedIcon:{
    top: 3,
    height:68,   
    width:65
  },
  mapFocusedIcon:{
    top: 3,
    height:70,   
    width:65
  },
  catFocusedIcon:{
    top:2,
    height:70,   
    width:67
  },
  favFocusedIcon:{
    top: 3,
    height:68,   
    width:65
  },
    icon:{
        height:50,
        width:50
    }
});
export default Router
