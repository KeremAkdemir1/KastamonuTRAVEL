import CategoryDetailService from "../services/CategoryDetailService";
import { useEffect,useState } from "react";
import { StyleSheet,View,Text,Image,Pressable,Dimensions,FlatList,ActivityIndicator,TouchableOpacity, Linking } from "react-native";
import {getLocales} from 'expo-localization';
import { useNavigation } from "@react-navigation/native";
import CategoryService from "../services/CategoryService";
import AddToFavoriteService from "../services/AddToFavoriteService";
import GetFavoritesService from "../services/GetFavoritesService";
import { LinearGradient } from 'expo-linear-gradient';
import * as Application from 'expo-application';
const CategoryDetailCard = ({id}) =>{
    const navigation = useNavigation()
    const [categoriesData, setCategoriesData] = useState([])
    const [idData,setIdData] = useState(id)
    const [isLoaded,setIsLoaded] = useState(true)
    const [favorite, setFavorite] = useState([])
    const [categoryData, setCategoryData] = useState([])
    const getCategoriesData = () => {
      setIsLoaded(true)
        const categoryServices = new CategoryDetailService
        const params = getLocales()[0].languageCode;
        categoryServices.getAllCategoryPosts(params,idData)
            .then(res => res.json())
            .then(resJson => {
              setCategoriesData([])
              setCategoriesData(resJson)
              setIsLoaded(false)
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
  const goToMap = (lat,lng,title) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
     const latLng = `${lat},${lng}`;
     const label = title;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
     android: `${scheme}${latLng}(${label})`
     
});

Linking.openURL(url)
  }

  
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
    useEffect(() => {
        getCategoriesData()
        getCategoryData()
        getFavorites()
        async function prepare() {
          await new Promise(resolve => setInterval(resolve, 2000));
      }
      prepare();
      
    }, [idData])
    const reRenderScreen = (newid,name) => {
      setIdData(newid)
      getCategoriesData()
      navigation.navigate({name: 'KategoriDetail',params: {kategoridetailid : newid,kategoridetailname: name},merge: true})
    }
    
    const renderCat = ({item}) => (
      <View style={[styles.categoryItem]}>
        {idData === item.categoryId.id ? 
         <LinearGradient  colors={['#07ef75',  '#2f9e63']} style={[styles.submitClicked]}>
        <TouchableOpacity
              underlayColor='#fff'
              onPress={() => reRenderScreen(item.categoryId.id,item.name)}>
               <Text style={[styles.submitClickedText]}>{item.name}</Text>
          </TouchableOpacity>
          </LinearGradient>
        : 
        
        
        <TouchableOpacity
              style={styles.submit}
              underlayColor='#fff'
              onPress={() => reRenderScreen(item.categoryId.id,item.name)}>
               <Text style={[styles.submitText]}>{item.name}</Text>
          </TouchableOpacity>
        
        }
          
      </View>
  );
    return(
      <View style={{width:Dimensions.get('window').width}}>
                
                <FlatList
            contentContainerStyle={{
                alignItems: 'flex-start',
                justifyContent: "space-around",
                paddingBottom:10,
                top:-10,
                paddingLeft:20
            }}
            style={[styles.flatList]}
            data={categoryData}
            showsHorizontalScrollIndicator={false}
            renderItem={renderCat}
            keyExtractor={item => item.id}
            horizontal={true}
            ItemSeparatorComponent={() => {
                return (
                    <View
                        style={{
                            height: "100%",
                            width: 20,
                        }} />
                );
            }}
        />
        {isLoaded ? <ActivityIndicator size="large" style={styles.loader}/> : 
        
        <FlatList
        contentContainerStyle={{
            alignItems: 'flex-start',
            justifyContent: "space-around",
            left:15,
            paddingBottom:400
        }}
        style={[styles.flatList]}
        data={categoriesData}
        showsHorizontalScrollIndicator={false}
        vertical
        renderItem={({ item }) => (
          <Pressable style={{width:Dimensions.get('screen').width,height:240,zIndex:101}} onPress={item.detailview == 1 ? () => navigation.navigate({ name: 'ItemDetail', params: { itemtitle: item.title, itemcontent: item.content,longitude:item.longtitude,latitude:item.latitude,itemphone: item.phone,itemAttachment:item.attachmentList,youtube: item.youtube,address: item.additional,itemid:item.id,aciliskapanis: item.acilis + ' / ' + item.kapanis,smallcontent: item.smallcontent  } }): () => goToMap(item.latitude,item.longtitude,item.title)}>
          <View style={styles.favoriCardView}>
          <View style={styles.backgroundRectangle} />
          <View style={styles.contentView}>
            <Text style={styles.titleText}>
              {item.title}
            </Text>
            <Text style={styles.contentText}>
              { item.category_name == "Restoran" || item.category_name == "Otel" ? item.additional + '/' + item.ilce_adi : item.smallcontent}
            </Text>
          </View>
          <Image
            style={styles.thumbPhoto}
            resizeMode="cover"
            source={{ uri: "https://kastamonutravelguide.com/" + item.path }}
          />
          
          <Pressable style={{zIndex:100}} onPress={() => AddFavorites(item.id)}>
          <Image
            style={styles.likeButtonIcon}
            resizeMode="cover"
            source={favorite.includes(item.id) ? require('../assets/likeButton.png') : require('../assets/likeButtonInactive.png')}
          />
          </Pressable>
          <Pressable  style={styles.mapViewPressable} onPress={() => goToMap(item.latitude,item.longtitude,item.title)}>
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
        </Pressable>
        )}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => { 
            return (
                <View
                    style={{
                      height:20
                    }} />
            );
        }}
    />

        }
         
        </View>
    )
}
const styles = StyleSheet.create({
  
  submit: {
    marginTop: 10,
    paddingTop: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 12,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    backgroundColor:'#fff',
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowRadius: 6,
    elevation: 6,
    shadowOpacity: 1,
    borderRadius:30 
},
submitClicked: {
  marginTop: 10,
  paddingTop: 12,
  paddingLeft: 10,
  paddingRight: 10,
  paddingBottom: 12,
  shadowColor: "rgba(0, 0, 0, 0.5)",
  shadowOffset: {
      width: 0,
      height: 3,
  },
  shadowRadius: 6,
  elevation: 6,
  shadowOpacity: 1,
  borderRadius:30 
},
submitText: {
    color: '#000000',
    textAlign: 'center',
    fontFamily:'Futura-Bold',
    fontSize:20,
    fontWeight: 'bold',
    height:30
},
submitClickedText: {
  color: '#fff',
  textAlign: 'center',
  fontFamily:'Futura-Bold',
  fontWeight: 'bold',
  fontSize:20,
  height:30
},
categoryItem: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    width: 130,
    height: "100%",
    shadowColor: "blue",
    shadowOpacity: 0.8,
    shadowRadius: 20,
    shadowOffset: {
        height: 100,
        width: 100
    }
},
flatList: {
    alignSelf: "flex-start",
    backgroundColor: "transparent"
},
  loader: {
    minHeight: "100%",
    display:'flex',
    justifyContent: "center",
    alignItems: 'center',
    top: -60
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
      top: -3,
      left: Dimensions.get('screen').width - 70,
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
      top:20,
      width: Dimensions.get('window').width,
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
      fontSize: 15,
      fontFamily: "Futura-Bold",
      fontWeight: 'bold',
      color: "#000",
      textAlign: "center",
    },
    contentText: {
      position: "absolute",
      top: 34,
      left: 7,
      fontSize: 13,
      fontFamily: "Futura-Bold",
      textAlign: "center",
      fontFamily:'sans-serif-condensed'
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
export default CategoryDetailCard