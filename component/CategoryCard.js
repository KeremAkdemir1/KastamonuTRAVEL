
import {View,Text,Image,TouchableHighlight,ImageBackground,StyleSheet,FlatList,ScrollView,ActivityIndicator, Dimensions, Pressable,Linking} from 'react-native'
import { useState,useEffect } from "react";
import {getLocales} from 'expo-localization';
import CategoryCardService from '../services/CategoryCardService';
import I18n from "i18n-js";
import { WebView } from 'react-native-webview';
import { useNavigation } from "@react-navigation/native";
import AddToFavoriteService from "../services/AddToFavoriteService";
import GetFavoritesService from "../services/GetFavoritesService";
import * as Application from 'expo-application';
const CategoryCard = () =>{
  
  const navigation = useNavigation();
    const [categoryData, setCategoryData] = useState()
    const [isLoaded,setIsLoaded] = useState(true)
    const [favorite, setFavorite] = useState([])
    const categories = new Map();
    const getCategoryData = () => {
        const categoryServices = new CategoryCardService
        const params = getLocales()[0].languageCode;
        categoryServices.getAllCategory(params)
            .then(res => res.json())
            .then(resJson => {
              for (const [value] of Object.entries(resJson)) {
                for(const item of value.slice(0,4)){
                
                }
              }
                setIsLoaded(false)
                setCategoryData(Object.entries(resJson))
            }).catch(error => console.log('error', error))
    }

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        getFavorites()
        getCategoryData()
      })
      return unsubscribe
       
        
    }, [navigation])

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

    const renderItem = ({item}) => (
      
        <View style={styles.categoryView} key={item.id}>
                  <ScrollView horizontal contentContainerStyle={{
                    width: 1050,height:270,
                    left:5
        }}
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}
          bouncesZoom={false}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          >
        <View style={styles.categoryCardView}>
          <Pressable style={{zIndex:99}} onPress={item[1][0].detailview == 1 ? () => navigation.navigate({ name: 'ItemDetail', params: { itemtitle: item[1][0].title, itemcontent: item[1][0].content,longitude:item[1][0].longtitude,latitude:item[1][0].latitude,itemphone: item[1][0].phone,itemAttachment:item[1][0].attachmentList,youtube: item[1][0].youtube,address: item[1][0].additional,itemid:item[1][0].id,aciliskapanis: item[1][0].acilis + ' / ' + item[1][0].kapanis,smallcontent: item[1][0].smallcontent  } }): () => goToMap(item[1][0].latitude,item[1][0].longtitude,item[1][0].title)}>
          <View style={styles.backgroundRectView} />
          <View style={styles.contentView}>
            <Text style={styles.contentTitleText}>
              {item[1][0].title}
            </Text>
            <View style={{height:34,top:16}}>
              <Text style={{fontSize:11,top:-20,fontFamily:'sans-serif-condensed',width:Dimensions.get('window').width / 2 - 30}}>
              { item[1][0].category_name == "Restoran" || item[1][0].category_name == "Otel" ? item[1][0].additional + '/' + item[1][0].ilce_adi : item[1][0].smallcontent}
              </Text>
               </View>
          </View>
          <Image
            style={styles.thumbPhoto}
            resizeMode="cover"
            source={{ uri:"https://kastamonutravelguide.com/" + item[1][0].path }}
          />
          <Pressable style={{zIndex:100}} onPress={() => AddFavorites(item[1][0].id)}>
          <Image
            style={styles.likeButtonIcon}
            resizeMode="cover"
            source={favorite.includes(item[1][0].id) ? require('../assets/likeButton.png') : require('../assets/likeButtonInactive.png')}
          />
          </Pressable>
          </Pressable>
        </View>
       <View style={styles.categoryCardView2}>
        <Pressable style={{zIndex:99}} onPress={item[1][1].detailview == 1 ? () => navigation.navigate({ name: 'ItemDetail', params: { itemtitle: item[1][1].title, itemcontent: item[1][1].content,longitude:item[1][1].longtitude,latitude:item[1][1].latitude,itemphone: item[1][1].phone,itemAttachment:item[1][1].attachmentList,youtube: item[1][1].youtube,address: item[1][1].additional,itemid:item[1][1].id,aciliskapanis: item[1][1].acilis + ' / ' + item[1][1].kapanis,smallcontent: item[1][1].smallcontent  } }): () => goToMap(item[1][1].latitude,item[1][1].longtitude,item[1][1].title)}>
          <View style={styles.backgroundRectView2} />
          <View style={styles.contentView2}>
            <Text style={styles.contentTitleText}>
              {item[1][1].title}
            </Text>
              <Text style={{fontSize:11,fontFamily:'sans-serif-condensed',width:Dimensions.get('window').width / 2 - 30}}>{ item[1][1].category_name == "Restoran" || item[1][1].category_name == "Otel" ? item[1][1].additional + '/' + item[1][1].ilce_adi : item[1][1].smallcontent}</Text>
          </View>
          <Image
            style={styles.thumbPhoto2}    
            resizeMode="cover"
            source={{ uri: "https://kastamonutravelguide.com/" + item[1][1].path}}
          />
          </Pressable>
          <Pressable style={{zIndex:100}} onPress={() => AddFavorites(item[1][1].id)}>
          <Image
            style={styles.likeButtonIcon2}
            resizeMode="cover"
            source={favorite.includes(item[1][1].id) ? require('../assets/likeButton.png') : require('../assets/likeButtonInactive.png')}
          />
          </Pressable>
    </View>
    <View style={styles.categoryCardView3}>
        <Pressable style={{zIndex:99}} onPress={item[1][2].detailview == 1 ? () => navigation.navigate({ name: 'ItemDetail', params: { itemtitle: item[1][2].title, itemcontent: item[1][2].content,longitude:item[1][2].longtitude,latitude:item[1][2].latitude,itemphone: item[1][2].phone,itemAttachment:item[1][2].attachmentList,youtube: item[1][2].youtube,address: item[1][2].additional,itemid:item[1][2].id,aciliskapanis: item[1][2].acilis + ' / ' + item[1][2].kapanis,smallcontent: item[1][2].smallcontent  } }): () => goToMap(item[1][2].latitude,item[1][2].longtitude,item[1][2].title)}>
          <View style={styles.backgroundRectView2} />
          <View style={styles.contentView2}>
            <Text style={styles.contentTitleText}>
              {item[1][2].title}
            </Text>
              <Text style={{fontSize:11,fontFamily:'sans-serif-condensed',width:Dimensions.get('window').width / 2 - 30}}>{ item[1][2].category_name == "Restoran" || item[1][2].category_name == "Otel" ? item[1][2].additional + '/' + item[1][2].ilce_adi : item[1][2].smallcontent}</Text>
          </View>
          <Image
            style={styles.thumbPhoto2}    
            resizeMode="cover"
            source={{ uri: "https://kastamonutravelguide.com/" +item[1][2].path}}
          />
          </Pressable>
          <Pressable style={{zIndex:100}} onPress={() => AddFavorites(item[1][2].id)}>
          <Image
            style={styles.likeButtonIcon2}
            resizeMode="cover"
            source={favorite.includes(item[1][2].id) ? require('../assets/likeButton.png') : require('../assets/likeButtonInactive.png')}
          />
          </Pressable>
    </View>
    <View style={styles.categoryCardView4}>
    <Pressable style={{zIndex:99}} onPress={item[1][3].detailview == 1 ? () => navigation.navigate({ name: 'ItemDetail', params: { itemtitle: item[1][3].title, itemcontent: item[1][3].content,longitude:item[1][3].longtitude,latitude:item[1][3].latitude,itemphone: item[1][3].phone,itemAttachment:item[1][3].attachmentList,youtube: item[1][3].youtube,address: item[1][3].additional,itemid:item[1][3].id,aciliskapanis: item[1][3].acilis + ' / ' + item[1][3].kapanis,smallcontent: item[1][3].smallcontent  } }): () => goToMap(item[1][3].latitude,item[1][3].longtitude,item[1][3].title)}>
          <View style={styles.backgroundRectView2} />
          <View style={styles.contentView2}>
            <Text style={styles.contentTitleText}>
              {item[1][3].title}
            </Text>
              <Text style={{fontSize:11,fontFamily:'sans-serif-condensed',width:Dimensions.get('window').width / 2 - 30}}>{ item[1][3].category_name == "Restoran" || item[1][3].category_name == "Otel" ? item[1][3].additional + '/' + item[1][3].ilce_adi : item[1][3].smallcontent}</Text>
          </View>
          <Image
            style={styles.thumbPhoto2}    
            resizeMode="cover"
            source={{ uri: "https://kastamonutravelguide.com/" + item[1][3].path}}
          />
          </Pressable>
          <Pressable style={{zIndex:100}} onPress={() => AddFavorites(item[1][3].id)}>
          <Image
            style={styles.likeButtonIcon2}
            resizeMode="cover"
            source={favorite.includes(item[1][3].id) ? require('../assets/likeButton.png') : require('../assets/likeButtonInactive.png')}
          />
          </Pressable>
    </View>
    <View style={styles.categoryCardView5}>
        <Pressable style={{zIndex:99}} onPress={item[1][4].detailview == 1 ? () => navigation.navigate({ name: 'ItemDetail', params: { itemtitle: item[1][4].title, itemcontent: item[1][4].content,longitude:item[1][4].longtitude,latitude:item[1][4].latitude,itemphone: item[1][4].phone,itemAttachment:item[1][4].attachmentList,youtube: item[1][4].youtube,address: item[1][4].additional,itemid:item[1][4].id,aciliskapanis: item[1][4].acilis + ' / ' + item[1][4].kapanis,smallcontent: item[1][4].smallcontent  } }): () => goToMap(item[1][4].latitude,item[1][4].longtitude,item[1][4].title)}>
          <View style={styles.backgroundRectView2} />
          <View style={styles.contentView2}>
            <Text style={styles.contentTitleText}>
              {item[1][4].title}
            </Text>
              <Text style={{fontSize:11,fontFamily:'sans-serif-condensed',width:Dimensions.get('window').width / 2 - 30}}>{ item[1][4].category_name == "Restoran" || item[1][4].category_name == "Otel" ? item[1][4].additional + '/' + item[1][4].ilce_adi : item[1][4].smallcontent}</Text>
          </View>
          <Image
            style={styles.thumbPhoto2}    
            resizeMode="cover"
            source={{ uri: "https://kastamonutravelguide.com/" + item[1][4].path}}
          />
          </Pressable>
          <Pressable style={{zIndex:100}} onPress={() => AddFavorites(item[1][4].id)}>
          <Image
            style={styles.likeButtonIcon2}
            resizeMode="cover"
            source={favorite.includes(item[1][4].id) ? require('../assets/likeButton.png') : require('../assets/likeButtonInactive.png')}
          />
          </Pressable>
    </View>
    </ScrollView>
        <Text style={styles.categoryTitleText}>{item[1][0].category_name}</Text>
        <TouchableHighlight
          style={styles.showMoreTouchable}
          onPress={() => navigation.navigate({name: 'KategoriDetail',params: {kategoridetailid : item[1][0].category_id,kategoridetailname: item[1][0].category_name},merge: true})}
        >
          <Text style={styles.showMoreText}>{I18n.t('hepsiGor')}</Text>
        </TouchableHighlight>
      </View>
    );


    return(
      <View>
        {isLoaded ? <ActivityIndicator size="large" style={styles.loader}/> : 
        <FlatList
        contentContainerStyle={{
            alignItems: 'flex-start',
            justifyContent: "space-around",
            paddingBottom: 200
        }}
        overScrollMode="never"
        style={[styles.flatList]}
        data={categoryData}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        vertical={true}
        ItemSeparatorComponent={() => {
            return (
                <View
                    style={{
                        height: 20,
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
    top: -60
},
    showMoreText: {
        fontSize: 15,
        left:10,
        fontWeight: "500",
        fontFamily: "Futura-Bold",
        color: "#707070",
      },
    likeButtonIcon: {
        position: "absolute",
        top: -3,
        left: Dimensions.get('screen').width / 2 -60,
        width: 47,
        height: 47,
      },
      likeButtonIcon2: {
        position: "absolute",
        top: -3,
        left: Dimensions.get('window').width - 260,
        width: 47,
        height: 47,
      },
      categoryTitleText: {
        position: "absolute",
        paddingTop: 10,
        left: 10,
        fontSize: 15,
        fontFamily: "Futura-Bold",
        color: "#000",
        fontWeight: 'bold',
      },
      showMoreTouchable: {
        position: "absolute",
        left: 0,
        top: 25,
      },
      categoryView: {
        position: "relative",
        width: 426,
        left:10,
        height: 274,
        flexShrink: 0,
      },
      categoryCardView: {
        position: "absolute",
        top: 54,
        left: 0,
        width: 200,
        height: 200,
      },
      categoryCardView2: {
        position: "absolute",
        top: 54,
        left: 195,
        width: 180,
        height: 180,
      },
      categoryCardView3: {
        position: "absolute",
        top: 54,
        left: 395,
        width: 180,
        height: 180,
      },
      categoryCardView4: {
        position: "absolute",
        top: 54,
        left: 595,
        width: 180,
        height: 180,
      },
      categoryCardView5: {
        position: "absolute",
        top: 54,
        left: 795,
        width: 180,
        height: 180,
      },
      backgroundRectView: {
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
        width: Dimensions.get('window').width / 2 - 20,
        height: 210,
      },
      backgroundRectView2: {
        position: "absolute",
        top: 0,
        left: Dimensions.get('window').width /2 - 200,
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
        width: Dimensions.get('window').width / 2 - 20,
        height: 210,
      },
      contentView: {
        position: "absolute",
        top: 152,
        left: 8,
        width: Dimensions.get('window').width / 2 - 30,
        height: 36,
      },
      contentView2: {
        position: "absolute",
        top: 152,
        left: Dimensions.get('screen').width /2- 190,
        width: 182,
        height: 36,
      },
      contentTitleText: {
        top: -4,
        width:Dimensions.get('window').width / 2 - 30,
        height:20,
        fontSize: 13,
        fontFamily: "Futura-Bold",
        color: "#000",
        fontWeight: 'bold',
        
      },
      contentTitleText: {
        top: -4,
        width:Dimensions.get('window').width / 2 - 30,
        height:20,
        fontSize: 13,
        fontFamily: "Futura-Bold",
        color: "#000",
        fontWeight: 'bold',
        
      },
      contentDescText: {
        top: 24,
        left: 0,
        fontSize: 10,
        fontFamily: "Futura-Bold",
        color: "#000",
      },
      thumbPhoto: {
        position: "absolute",
        top: 0,
        left: 0,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 40,
        width: Dimensions.get('screen').width / 2- 20,
        height: 140,
      },
      thumbPhoto2: {
        position: "absolute",
        top: 0,
        left: 0,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 40,
        width: Dimensions.get('screen').width / 2- 20,
        height: 140,
        left:Dimensions.get('screen').width / 2- 200
      },
})
export default CategoryCard;