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


    return (
    
        
        <FlatList
        contentContainerStyle={{ paddingBottom: 150 }}
        data={postData}

        style={styles.flat}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.container}>
                          <Pressable style={{zIndex:100}} onPress={() => navigation.navigate({ name: 'ItemDetail', params: { itemtitle: item.title, itemcontent: item.content,longitude:item.longtitude,latitude:item.latitude,itemphone: item.phone,itemAttachment:item.attachmentList,youtube: item.youtube,address: item.additional,itemid:item.id,aciliskapanis: item.acilis + ' / ' + item.kapanis,smallcontent: item.smallcontent  } })}>
            <View style={styles.tourCard}>
            <Pressable style={{width:45,zIndex:99,left:Dimensions.get('screen').width - 70}} onPress={() => AddFavorites(item.id)}>
                <Image
                source={favorite.includes(item.id) ? require('../assets/likeButton.png') : require('../assets/likeButtonInactive.png')}
                style={{width:50,height:50,position:'absolute'}}
                />
                </Pressable>
                <View style={styles.backgroundRectangle} />
                <Image
                  style={styles.photo}
                  resizeMode="cover"
                  source={{ uri:"https://kastamonutravelguide.com/" + item.path}}
                />
                <View style={styles.textContent}>
                  <Text style={styles.titleText}>{item.title.length >  20 ? item.title.substring(0,20) + '...': item.title}</Text>
                  <View style={styles.webView}>
                    <Text style={{fontFamily:'sans-serif-condensed'}}> { item.category_name == "Restoran" || item.category_name == "Otel" ? item.additional + '/' + item.ilce_adi : item.smallcontent}</Text>
                  </View>
                </View>
            </View>
            </Pressable>
          </View>
        )}
        keyExtractor={item => item.id}
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
    hepsisubmitClicked: {
        marginTop: 10,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#fff',
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 6,
        width:90,
        left:10,
        height:45,
        elevation: 6,
        shadowOpacity: 1,
        borderRadius:30 
      },
      hepsiAllSubmit: {
        paddingTop: 12,
        paddingBottom: 12,
        width:90,
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 6,
        elevation: 6,
        shadowOpacity: 1,
        borderRadius:30,
      },
      categoriesView: {
        position: "relative",
        width: 431,
        height: 60,
        flexShrink: 0,
        top:-30
      },
      hepsiItem: {
        backgroundColor: "transparent",
        height:45,
        width:130,
        left:15,
        top: 10,
        borderRadius: 30
      },
      hepsisItem: {
        backgroundColor: "transparent",
        height:45,
        width:90,
        top: 10,
        left:10,
        borderRadius: 30
      },
      categoriesScrollview: {
        position: "absolute",
        top: 1,
        marginTop: 5,
        left: 0,
        width: "100%",
        paddingBottom: 20
      },
      submit: {
        marginTop: 10,
        paddingTop: 16,
        marginLeft: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 6,
        elevation: 6,
        shadowOpacity: 1,
        borderRadius: 30
      },
      allSubmit: {
        marginTop: 10,
        paddingTop: 16,
        marginLeft: 10,
        paddingBottom: 16,
        backgroundColor: '#fff',
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 6,
        elevation: 6,
        shadowOpacity: 1,
        borderRadius: 30
      },
      hepsiSubmit: {
        paddingTop: 16,
        paddingBottom: 16,
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 6,
        elevation: 6,
        shadowOpacity: 1,
        borderRadius: 30
    
      },
      hepsisSubmit: {
        paddingTop: 16,
        paddingBottom: 16,
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 6,
        elevation: 6,
        shadowOpacity: 1,
        width:130,
        borderRadius: 30
    
      },
      submitText: {
        color: '#000000',
        textAlign: 'center',
        fontFamily:'Futura-Bold',
        fontWeight: 'bold',
        top:-3
      },
      hepsitsubmitText: {
        color: '#000000',
        textAlign: 'center',
        fontWeight:'bold',
        fontFamily:'Futura-Bold',
      },
      categoryItem: {
        backgroundColor: "transparent",
        width: 130,
        height: 80,
        shadowOffset: {
          height: 100,
          width: 100
        },
        left: 10
      },
      searchView: {
        position: "relative",
        backgroundColor: "#fff",
        flex: 1,
        width: "100%",
        height: 1536,
      },
      searchBarView: {
        position: "relative",
        width: 418,
        height: 75,
      },
      hepsisubmitText: {
        color: '#fff',
        textAlign: 'center',
        alignContent:'center',
        top:-3,
        fontWeight: 'bold',
        fontFamily:'Futura-Bold',
        alignItems:'center',
        alignSelf:'center',
        right:10,
        fontSize: 15,
      },
      hepsilinearsubmitText: {
        color: '#fff',
        textAlign: 'center',
        alignContent:'center',
        fontFamily:'Futura-Bold',
        alignItems:'center',
        alignSelf:'center',
        fontWeight: 'bold',
        fontSize: 15,
      },
      textInput: {
        position: "relative",
        top: -15,
        marginLeft:10,
        marginRight:10,
        borderRadius: 35,
        backgroundColor: "#fff",
        shadowRadius: 6,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        elevation: 6,
        shadowOpacity: 0.5,
        width: Dimensions.get('window').width - 25,
        height: 55,
        textAlign: 'center',
        fontSize: 15,
        fontFamily: 'Futura-Bold'
      },
      tourCard: {
        position: "relative",
        width: 380,
        height: 200,
        flexShrink: 0,
      },
      container: {
        left: 17,
        opacity: 0.99
      },
      webView: {
        top: 80,
        width: 130,
        left: Dimensions.get('window').width / 2 - 220,
        height: 150,
        opacity: 0.99
      },
      titleText: {
        position: "absolute",
        top: 0,
        left: Dimensions.get('screen').width / 2 - 220,
        fontSize:  Dimensions.get('screen').width  < 400 || Dimensions.get('window').height < 750 ? 17 : 22,
        color: "#000",
        textAlign: "left",
        fontFamily: "Futura-Bold",
        fontWeight: 'bold',
        display: "flex",
        width:124,
      },
      textContent: {
        position: "absolute",
        top: 7,
        left: 220,
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
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowRadius: 6,
        elevation: 15,
        shadowOpacity: 10,
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
        width: Dimensions.get('window').width / 2 - 10,
        height: 200,
      },
});
export default Tours
