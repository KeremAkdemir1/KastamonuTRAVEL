import { StyleSheet, View, Text, Image, Pressable, Dimensions,FlatList,ActivityIndicator,Linking,Platform } from 'react-native'
import FavoritesService from '../services/FavoritesService'
import { useState,useEffect } from "react"
import {getLocales} from 'expo-localization';
import WebView from 'react-native-webview';
import { useNavigation } from "@react-navigation/native";
import AddToFavoriteService from "../services/AddToFavoriteService";
import GetFavoritesService from "../services/GetFavoritesService";
import * as Application from 'expo-application';
import GetFavoritesIdService from '../services/GetFavoritesIdService';
import I18n from 'i18n-js';
const FavorilerComp = () => {
  const navigation = useNavigation()
  const [isLoaded,setIsLoaded] = useState(true)
  const [favorite, setFavorite] = useState([0])

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


  const AddFavorites = (id) => {
    
    const favoritesService = new AddToFavoriteService
    const postId = id
    if(Platform.OS == "ios"){
        Application.getIosIdForVendorAsync().then((res) => {
            favoritesService.AddFavorites(res,postId).then(rest => rest.json()).then(restJson => {
              getFavorites()
            }).catch(error => console.log(error))
        })
    }
    else{
        favoritesService.AddFavorites(Application.androidId,postId).then(res => res.json()).then(resJson => {
          getFavorites()
        }).catch(error => console.log(error))
    }
    navigation.navigate('Favoriler')
}
const getFavorites = () => {
  const favoriteService = new FavoritesService
  const params = getLocales()[0].languageCode;
  if(Platform.OS == "ios"){
      Application.getIosIdForVendorAsync().then((res) => {
          favoriteService.getAllPosts(res,params).then(rest => rest.json()).then(restJson => {
              setFavorite(restJson)
              setIsLoaded(false)
          }).catch(error => console.log(error))
      })
  }
  else{
      favoriteService.getAllPosts(Application.androidId,params).then(res => res.json()).then(resJson => {
          setFavorite(resJson)
          setIsLoaded(false)
      }).catch(error => console.log(error))
  }
}

  useEffect(() => {


    const unsubscribe = navigation.addListener('focus', () => {
      getFavorites()
    });
    return unsubscribe 
  }, [navigation])

  return (
    <View>
      {favorite[0] === undefined ? <Text style={{fontSize:20,top:Dimensions.get('window').height / 2 - 200,textAlign:'center',alignItems:'center',fontFamily:'Futura-Bold'}}>{I18n.t('favoriYok')}</Text> : 
      
      <FlatList
    contentContainerStyle={{
        alignItems: 'flex-start',
        justifyContent: "space-around",
        left:15,
        paddingBottom:230
    }}
    style={[styles.flatList]}
    data={favorite}
    showsVerticalScrollIndicator={false}
    renderItem={({item}) =>(

      <View style={styles.favoriStyle}>
        
      <View style={styles.favoriCardView}>
      <Pressable style={{zIndex:99,width:Dimensions.get('screen').width,height:200}} onPress={item.detailview == 1 ? () => navigation.navigate({ name: 'ItemDetail', params: { itemtitle: item.title, itemcontent: item.content,longitude:item.longtitude,latitude:item.latitude,itemphone: item.phone,itemAttachment:item.attachmentList,youtube: item.youtube,address: item.additional,itemid:item.id ,aciliskapanis: item.acilis + ' / ' + item.kapanis,smallcontent: item.smallcontent } }): () => goToMap(item.latitude,item.longtitude,item.title)}>
        <View style={styles.backgroundRectangle} />
        <View style={styles.contentView}>
          <Text style={styles.titleText}>
            {item.title}
          </Text>
           <Text style={{top:30,left:5,fontFamily:'sans-serif-condensed',fontSize:16}}>
            {item.smallcontent}
           </Text>
        </View>
        <Image
          style={styles.thumbPhoto}
          resizeMode="cover"
          source={{ uri: "https://kastamonutravelguide.com/" + item.path }}
        />
        </Pressable>
        <Pressable style={{zIndex:100,top:-200,backgroundColor:'black'}} onPress={() => AddFavorites(item.id)}>
        <Image
          style={styles.likeButtonIcon}
          resizeMode="cover"
          source={require("../assets/likeButton.png")}
        />
        </Pressable>
        <Pressable style={styles.mapViewPressable} onPress={() => goToMap(item.latitude,item.longtitude,item.title)}>
          <Image
            style={styles.mapViewBackground}
            resizeMode="cover"
            source={require("../assets/mapViewBackground.png")}
          />
          <Image
            style={styles.mapViewIcon}
            resizeMode="cover"
            source={require("../assets/mapView.png")}
          />
        </Pressable>
      </View>
    </View>

  )}
    keyExtractor={item => item.id}
    vertical={true}
    overScrollMode="never"
    ItemSeparatorComponent={() => {
        return (
            <View
                style={{
                    width: "100%",
                    height: 60,
                }} />
        );
    }}
/>

      }
    
</View>
  )
}

const styles = StyleSheet.create({
  loader: {
    minHeight: "100%",
    display:'flex',
    justifyContent: "center",
    alignItems: 'center',
    top:-70
},
  favoriStyle: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  mapViewIcon: {
    position: "absolute",
    height: "77.14%",
    width: "77.14%",
    top: "20%",
    right: "11.43%",
    bottom: "2.86%",
    left: "11.43%",
    maxWidth: "100%",
    overflow: "hidden",
    maxHeight: "100%",
  },
  mapViewBackground: {
    position: "absolute",
    top: -3,
    left: -6,
    width: 47,
    height: 47,
  },
  mapViewPressable: {
    position: "absolute",
    top: 105,
    left: 0,
    width: 35,
    height: 35,
    zIndex:100
    
  },
  likeButtonIcon: {
    position: "absolute",
    left: Dimensions.get('screen').width / 2 + 120,
    width: 47,
    height: 47,
  },
  backgroundRectangle: {
    position: "absolute",
    top: 0,
    left: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 50,
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
    width: Dimensions.get('window').width - 30,
    height: 230,
  },
  favoriCardView: {
    position: "relative",
    width: 380,
    height: 200,
    flexShrink: 0,
  },
  contentView: {
    position: "absolute",
    top: 152,
    left: 8,
    width: Dimensions.get('window').width - 50,
    height: 36,
  },
  titleText: {
    position: "absolute",
    top: 0,
    left: 6,
    fontSize: 17,
    fontFamily: "Futura-Bold",
    fontWeight: 'bold',
    color: "#000",
    textAlign: "center",
  },
  contentText: {
    position: "absolute",
    top: 24,
    left: 0,
    fontSize: 13,
    fontFamily: "Futura-Bold",
    color: "#000",
    textAlign: "center",
  },
  thumbPhoto: {
    position: "absolute",
    top: 0,
    left: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    width: Dimensions.get('window').width - 30,
    height: 140,
  },
})
export default FavorilerComp