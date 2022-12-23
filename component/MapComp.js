import MapView, { Callout, PROVIDER_GOOGLE} from "react-native-maps";
import { Marker, PROVIDER_DEFAULT } from "react-native-maps"
import { useState, useEffect } from 'react'
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Dimensions, Text, Image, Pressable, FlatList, TouchableOpacity, ScrollView,StatusBar, ImageBackground , Linking} from 'react-native'
import I18n from "i18n-js";
import * as Location from 'expo-location';
import CategoryService from '../services/CategoryService';
import { getLocales } from 'expo-localization';
import Category from './Category';
import PostService from '../services/PostService';
import CategoryCardService from "../services/CategoryCardService";
import CategoryDetailService from "../services/CategoryDetailService";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
const MapComp = () => {
  const navigation = useNavigation();
  const [categoryData, setCategoryData] = useState([])
  const [idData,setIdData] = useState(0)
  const [list, setList] = useState([])
  const [details,setDetails] = useState(undefined)
  const [location, setLocation] = useState({
    latitude: 41.04871000,
    longitude: 33.76273000
  });
  const getLocation = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
    })();
  }
  const goToMap = (lat,lng,title) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
     const latLng = `${lat},${lng}`;
     const label = title;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
     android: `${scheme}${latLng}(${label})`
     
});

Linking.openURL(url);
  }
  const getListPost = () => {
    setIdData(0)
    const postService = new PostService
    const params = getLocales()[0].languageCode;
    postService.getAllPosts(params)
      .then(res => res.json())
      .then(resJson => {
        setList(resJson)

      }).catch(error => console.log('error', error))
  }
  const getCategoryData = () => {
    const categoryServices = new CategoryService
    const params = getLocales()[0].languageCode;
    categoryServices.getAllCategory(params)
      .then(res => res.json())
      .then(resJson => {
        setCategoryData(resJson)
      }).catch(error => console.log('error', error))
  }

  const getListPostByCategory = (id) => {
          setIdData(id)
          const categoryServices = new CategoryDetailService
          const params = getLocales()[0].languageCode;
          categoryServices.getAllCategoryPosts(params,id)
              .then(res => res.json())
              .then(resJson => {
                      setList(resJson)    
              }).catch(error => console.log('error', error))
      
  }
  useEffect(() => {
    getListPost()
    getCategoryData()
  }, [])


const renderMark = () =>{


}
  return (
    <View >
      <View style={styles.maptopview}>
        <MapView
         region={{
          longitude: location.longitude, latitude: location.latitude, latitudeDelta: 1.72,
          longitudeDelta: 0.0621,
        }}
          style={styles.map}
          provider="google"
          showsUserLocation
          >
            {list.map((element, index) => {
            
            return (
              <Marker
                key={element.id}
                coordinate={{ latitude: parseFloat(element.latitude), longitude: parseFloat(element.longtitude) }}
                style={{position:'relative'}}
                image={require("../assets/marker.png")} 
                
                onPress={() => setDetails(element.id)}
                >
                   
                   <Callout  onPress={element.detailview == 1 ? () => navigation.navigate({ name: 'ItemDetail', params: { itemtitle: element.title, itemcontent: element.content,longitude:element.longtitude,latitude:element.latitude,itemphone: element.phone,itemAttachment:element.attachmentList,youtube: element.youtube,address: element.additional,itemid:element.id,aciliskapanis: element.acilis + ' / ' + element.kapanis  } }): () => goToMap(element.latitude,element.longtitude,element.title) }>
                 
                    <View style={{flex:1}}>
                    <Text style={{fontFamily:'Futura-Bold',fontWeight:'bold',paddingRight:40}}>{element.title}</Text>
                    <Icon style={{right:1,position:'absolute',justifyContent:'flex-end'}} name="information-circle-outline" size={20}/>
                    </View>
                   
                  </Callout>
                  
                </Marker>

            )
          })}
        </MapView>
      </View>
      <View style={styles.categoriesView}>

      <ScrollView style={styles.categoriesScrollview} horizontal contentContainerStyle={{
          justifyContent: "flex-start",
          flexDirection: "row", paddingRight: 40,paddingLeft:5,paddingBottom:20
          
        }}
        showsHorizontalScrollIndicator={false}>
        {idData === 0 ?  
        <LinearGradient  colors={['#07ef75',  '#2f9e63']} style={[styles.hepsiItem]}>
            <TouchableOpacity
              style={styles.hepsiAllSubmit}
              onPress={() => getListPost()}
              underlayColor='#fff'>
              <Text style={[styles.hepsisubmitText]}>{I18n.t('hepsi')}</Text>
            </TouchableOpacity>
           </LinearGradient>
          :  
          <TouchableOpacity
            style={styles.hepsisubmitClicked}
            onPress={() => getListPost()}
            underlayColor='#fff'>
            <Text style={[styles.submitText]}>{I18n.t('hepsi')}</Text>
          </TouchableOpacity>
          }
       
          
          {categoryData.map((cat, index) => {
            if(idData === cat.categoryId.id){
            return (
              <LinearGradient  colors={['#07ef75',  '#2f9e63']} style={[styles.hepsiItem]}>
              <View style={styles.categoryItem} key={cat.id}>
                <TouchableOpacity
                  key={cat.id}
                  style={styles.hepsiSubmit}
                  onPress={(id) => getListPostByCategory(cat.categoryId.id)}
                  underlayColor='#fff'
                >
                  <Text style={[styles.hepsisubmitText]}>{cat.name}</Text>
                </TouchableOpacity>
              </View>
              </LinearGradient>
            )
          }
          else{
            return(
            <View style={styles.categoryItem} key={cat.id}>
            <TouchableOpacity
              key={cat.id}
              style={styles.submit}
              onPress={() => getListPostByCategory(cat.categoryId.id)}
              underlayColor='#fff'
            >
              <Text style={[styles.submitText]}>{cat.name}</Text>
            </TouchableOpacity>
          </View>
        )
          }
          })}

        </ScrollView>
      </View>
      <View style={{top:50}}>
      <Pressable style={styles.fullScreenPressable} onPress={() => navigation.navigate("HaritaFullScreen")}>
        <View
          style={styles.ellipseIcon1}
        />
        <Image
          style={styles.capture1Icon}
          resizeMode="cover"
          source={require("../assets/fullScreen.png")}
        />
      </Pressable>
      <Pressable style={styles.navigatePressable} onPress={() => getLocation()} >
        <View
          style={styles.ellipseIcon}
        />
        <Image
          style={styles.locationArrowSolid1Icon}
          resizeMode="cover"
          source={require("../assets/getLocationIcon.png")}
        />
      </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

  hepsisubmitClicked: {
    marginTop: 10,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
    width:90,
    elevation: 6,
    borderRadius:30 
  },
  hepsisubmitText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  hepsiSubmit: {
    paddingTop: 12,
    paddingBottom: 12,
    elevation: 6,
    borderRadius:30 
  },
  hepsiAllSubmit: {
    paddingTop: 12,
    paddingBottom: 12,
    width:90,
    elevation: 6,
    borderRadius:30 
  },
  categoriesScrollview: {
    position: "absolute",
    marginTop: 85,
    left: 0,
    width: "100%",
  },
  categoriesView: {
    position: "relative",
    width: Dimensions.get('screen').width,
    height: 70,
    flexShrink: 0,
  },
  ellipseIcon: {
    position: "absolute",
    top: 3,
    left: 0,
    width: 58,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  submit: {
    marginTop: 10,
    paddingTop: 12,
    marginLeft: 10,
    paddingBottom: 12,
    backgroundColor: '#fff',
    elevation: 6,
    borderRadius:30 
  },
  navigatePressable: {
    position: "absolute",
    top:Dimensions.get('window').height - 265,
    left: Dimensions.get('window').width - 80,
    width: 69,
    height: 81,
    overflow: "hidden",
  },
  locationArrowSolid1Icon: {
    position: "absolute",
    top: 22,
    left: 15,
    width: 25,
    height: 25,
    overflow: "hidden",
  },
  fullScreenPressable: {
    position: "absolute",
    top: Dimensions.get('window').height - 280,
    left: 20,
    width: 94,
    height: 85,
    overflow: "hidden",
  },
  ellipseIcon1: {
    position: "absolute",
    top: 15,
    left: 7,
    width: 62,
    backgroundColor: 'white',
    borderRadius: 40,
    height: 61,
  },
  capture1Icon: {
    position: "absolute",
    top: 32,
    left: 26,
    width: 27,
    height: 27,
  },
  map: {
    position: "absolute",
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },

  submitText: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
  
  hepsisubmitClickedText: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    paddingLeft:20,
    paddingRight:20
  },
  categoryItem: {
    backgroundColor: "transparent",
    width: 160,
    height: "100%",
  },
  categoryItemPress: {
    backgroundColor: "transparent",
    width: 160,
    height: "100%",
  },
  hepsiItem: {
    backgroundColor: "transparent",
    top:10,
    height:47,
    marginLeft:10,
    borderRadius:30,
  },
  flatList: {
    alignSelf: "flex-start",
    backgroundColor: "transparent"
  }
})
export default MapComp