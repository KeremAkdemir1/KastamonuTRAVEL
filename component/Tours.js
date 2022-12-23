import React, {useState, useEffect} from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    Pressable,
    View,
    Image,
    ActivityIndicator,
    Dimensions,
    Alert,
    Linking
} from "react-native";
import {getLocales} from 'expo-localization';
import ToursService from '../services/ToursService';
import { useNavigation } from "@react-navigation/native";
import AddToFavoriteService from "../services/AddToFavoriteService";
import GetFavoritesService from "../services/GetFavoritesService";
import * as Application from 'expo-application';
const Tours = () => {
    
    const [favorite, setFavorite] = useState([])
    const navigation = useNavigation();
    const [postData, setPostData] = useState([])
    const getPostData = () => {
        const postService = new ToursService
        const params = getLocales()[0].languageCode;
        postService.getAllTours(params)
            .then(res => res.json())
            .then(resJson => {
                setPostData(resJson)
            }).catch(error => console.log('error', error))
    }

    useEffect(() => {
        getFavorites()
        getPostData()
    }, [])

    const AddFavorites = (id) => {
        
        const favoritesService = new AddToFavoriteService
        const postId = id
        if(Platform.OS == "ios"){
            Application.getIosIdForVendorAsync().then((res) => {
                favoritesService.AddFavorites(res,postId).then(rest => rest.json()).then(restJson => {
                    setFavorite(restJson)
                    Alert.alert('eklendi')
                }).catch(error => console.log(error))
            })
        }
        else{
            favoritesService.AddFavorites(Application.androidId,postId).then(res => res.json()).then(resJson => {
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
    const renderItem = ({item}) => (
        
        <View style={styles.container}>
        <Pressable style={{zIndex:99}} onPress={item.detailview == 1 ? () => navigation.navigate({ name: 'ItemDetail', params: { itemtitle: item.title, itemcontent: item.content,longitude:item.longtitude,latitude:item.latitude,itemphone: item.phone,itemAttachment:item.attachmentList,youtube: item.youtube,address: item.additional,itemid:item.id,aciliskapanis: item.acilis + ' / ' + item.kapanis,smallcontent: item.smallcontent } }): () => goToMap(item.latitude,item.longtitude,item.title)}>
            <View style={styles.tourCard}>

                    <View style={styles.backgroundRectangle}/>
                    <Image
                        style={styles.photo}
                        resizeMode="cover"
                        source={{uri : "https://kastamonutravelguide.com/" + item.path}}
                    />
                     <Pressable style={{zIndex:99}} onPress={() => AddFavorites(item.id)}>
                <Image
                source={favorite.includes(item.id) ? require('../assets/likeButton.png') : require('../assets/likeButtonInactive.png')}
                style={{width:50,height:50,left:-20}}
                />
                </Pressable>
                    <View style={styles.textContent}>
                        <Text style={styles.titleText}> {item.title.substring(0,23)}...</Text>
                        <Text style={{top:60,width:Dimensions.get('screen').width / 2 - 60,fontSize:14,left:Dimensions.get('screen').width /2 - 230,height:120,fontFamily:'Times New Roman'}}>{item.smallcontent}</Text>
                    </View>
                
            </View>
            </Pressable>
        </View>
    );

    return (
    
        
        <FlatList
        contentContainerStyle={{
            alignItems: 'flex-start',
            justifyContent: "space-around",
            paddingTop:20,
            paddingBottom: 80
        }}
        style={[styles.flatList]}
        data={postData}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        vertical={true}
        overScrollMode="never"
        ItemSeparatorComponent={() => {
            return (
                <View
                    style={{
                        width: "100%",
                        height: 20,
                    }} />
            );
        }}
    />
   
    
        )
}
const htmlStyles = { p: {top: -20} }
const styles = StyleSheet.create({
    tourCard: {
        position: "relative",
        width: 380,
        height: 200,
        flexShrink: 0,
      },
    container:{
        left:17,
        
    },
    webView: {
        top: 30,
        backgroundColor:'transparent',
        width: 10,
        left: -10,
        height: 150,
        opacity: 0.99
    },
    titleText: {
        position: "absolute",
        top: 0,
        left: Dimensions.get('screen').width / 2 - 220,
        fontSize: 18,
        color: "#000",
        textAlign: "left",
        fontFamily: "Futura-Bold",
        fontWeight: 'bold',
        display: "flex",
        width:144,
    },
    textContent: {
        position: "absolute",
        backgroundColor:'transparent',
        top: 7,
        left: 235,
        width: Dimensions.get('window').width - 20,
        height: 181,
    },
    backgroundRectangle: {
        position: "absolute",
        top: 0,
        left: 0,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        backgroundColor: '#fff',
        shadowColor: "rgba(0, 0, 0, 90)",
        shadowOffset: {
            width: 0,
            height:7,
        },
        shadowRadius: 5,
        elevation: 15,
        shadowOpacity: 0.2,
        width: Dimensions.get('window').width - 30,
        height: 200,
    },
    photo: {
        position: "absolute",
        top: 0,
        left: 0,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 25,
        width: Dimensions.get('window').width / 2,
        height: 200,
    },
});
export default Tours
