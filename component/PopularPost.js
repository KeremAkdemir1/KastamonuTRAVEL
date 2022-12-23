import React, { useState, useEffect } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    Pressable,
    View,
    Image,
    ActivityIndicator,
    Dimensions,
    TouchableHighlight,
    Touchable,
    Platform
} from "react-native";
import { getLocales } from 'expo-localization';
import PopularPostService from '../services/PopularPostService';
import { useNavigation } from "@react-navigation/native";
import { WebView } from 'react-native-webview';
import * as Application from 'expo-application';
import AddToFavoriteService from "../services/AddToFavoriteService";
import GetFavoritesService from "../services/GetFavoritesService";
const PopularPost = () => {
    const [favorite, setFavorite] = useState([])
    const [newFavorite,setNewFavorite] = useState(undefined)
    const [isLoaded,setIsLoaded] = useState(true)
    const [uniqueId,setUniqueId] = useState(undefined);
    const navigation = useNavigation();
    const [popularData, setPopularData] = useState([])
    const getPopularData = () => {
        const popularPostService = new PopularPostService
        const params = getLocales()[0].languageCode;
        popularPostService.getAllPopulars(params)
            .then(res => res.json())
            .then(resJson => {
                setPopularData(resJson)
                setIsLoaded(false)
            }).catch(error => console.log('error', error))
    }
    useEffect(() => {
        getFavorites()
        getPopularData()
    }, [])

    const AddFavorites = (id) => {
        
        const favoritesService = new AddToFavoriteService
        const postId = id
        if(Platform.OS == "ios"){
            Application.getIosIdForVendorAsync().then((res) => {
                favoritesService.AddFavorites(res,postId).then(rest => rest.json()).then(restJson => {
                    setFavorite(restJson)
                }).catch(error => console.log(error))
            })
        }
        else{
            favoritesService.AddFavorites(Application.androidId,postId).then(res => res.json()).then(resJson => {
                setFavorite(resJson)
            }).catch(error => console.log(error))
        }
       
    }

    const getFavorites = () => {
        const favoriteService = new GetFavoritesService
        if(Platform.OS == "ios"){
            Application.getIosIdForVendorAsync().then((res) => {
                favoriteService.getAllFavorites(res).then(rest => rest.json()).then(restJson => {
                    setFavorite(restJson)
                }).catch(error => console.log(error))
            })
        }
        else{
            favoriteService.getAllFavorites(Application.androidId).then(res => res.json()).then(resJson => {
                setFavorite(resJson)
            }).catch(error => console.log(error))
        }
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
    const renderPopular = ({ item }) => (
    <View>
        <Pressable style={{zIndex:100}}  onPress={item.detailview == 1 ? () => navigation.navigate({ name: 'ItemDetail', params: { itemtitle: item.title, itemcontent: item.content,longitude:item.longtitude,latitude:item.latitude,itemphone: item.phone,itemAttachment:item.attachmentList,youtube: item.youtube,address: item.additional,itemid:item.id,aciliskapanis: item.acilis + ' / ' + item.kapanis,smallcontent: item.smallcontent  } }): () => goToMap(item.latitude,item.longtitude,item.title)}>
        <View style={[styles.popularCardView]}>
        
            <View style={styles.backgroundRectangle} />
            
                <View style={styles.textContent}>
                    <Text style={styles.titleText}>
                         {item.title.substring(0,20)}...
                    </Text>
                    <Text style={{top:20,left:10,fontSize:Dimensions.get('window').width > 410 ? 11 : 10,fontFamily:'sans-serif-condensed'}}>{item.smallcontent === null ? item.smallcontent : item.smallcontent.substring(0,30)}...</Text>
                </View>
                <Image
                    style={styles.thumbPhoto}
                    resizeMode="cover"
                    source={{ uri: "https://kastamonutravelguide.com/" + item.path }}
                />
                <Pressable style={{width:45,left:160,zIndex:99}} onPress={() => AddFavorites(item.id)}>
                <Image
                source={favorite.includes(item.id) ? require('../assets/likeButton.png') : require('../assets/likeButtonInactive.png')}
                style={{width:50,height:50,position:'absolute'}}
                />
                </Pressable>
                     
        </View>
        </Pressable>
    </View>
    );

    return (
        <View style={{marginTop:30,width:Dimensions.get('screen').width}}>
            {isLoaded ? <ActivityIndicator size="large" style={styles.loader}/> :  
             <FlatList
            contentContainerStyle={{
                alignItems: 'flex-start',
                justifyContent: "space-around",
                paddingRight:80,
                paddingLeft:15,
                
            }}
            style={[styles.flatList]}
            data={popularData}
            showsHorizontalScrollIndicator={false}
            renderItem={renderPopular}
            keyExtractor={item => item.id}
            horizontal={true}
            overScrollMode="never"
            ItemSeparatorComponent={() => {
                return (
                    <View
                        style={{
                            height: "100%",
                            width: 20,
                        }} />
                );
            }}
        />}
       
        </View>
    )
}
const htmlStyles = { p: {fontSize:3} }
const styles = StyleSheet.create({
    loader: {
        minHeight: "100%",
        display:'flex',
        justifyContent: "center",
        alignItems: 'center',
        left:Dimensions.get('window').width / 2
    },
    webView: {
        top: 20,
        width: 180,
        left:2,
        height: 30
    },
    container: {
        left: 15
    },
    popularCardView: {
        position: "relative",
        width: 210,
        height: 230,
        flexShrink: 0,
    },
    textContent: {
        position: "absolute",
        top: 152,
        left: 8,
        width: 182,
        height: 35,
    },
    titleText: {
        
        position: "absolute",
        top: -4,
        left: 10,
        fontSize: 13,
        fontFamily: "Futura-Bold",
        color: "#000",
        fontWeight:'bold',
        width:200,
        textAlign: "left",
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
        width: 200,
        height: 210,
    },
    thumbPhoto: {
        position: "absolute",
        top: 0,
        left: 0,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 50,
        width: 200,
        height: 140,
    },
    likeButton: {
        position: "absolute",
        top: -3,
        left: 159,
        width: 47,
        height: 47,
    },


});
export default PopularPost