import { View, TextInput, StyleSheet, Dimensions, FlatList, Text, Image, Pressable, TouchableOpacity, ScrollView,ActivityIndicator,Linking } from 'react-native'
import WebView from 'react-native-webview';
import { useEffect, useState } from 'react'
import PostService from '../services/PostService'
import { getLocales } from 'expo-localization';
import { useNavigation } from "@react-navigation/native";
import CategoryService from '../services/CategoryService';
import CategoryDetailService from '../services/CategoryDetailService';
import { LinearGradient } from 'expo-linear-gradient';
import I18n from "i18n-js";
import Icon from 'react-native-vector-icons/Ionicons';
const SearchComp = () => {
  const navigation = useNavigation();
  const [postData, setPostData] = useState([])
  const [search, setsearch] = useState('')
  const [categoryData, setCategoryData] = useState([])
  const [loading,setLoading] = useState(true)
  const [masterData, setmasterData] = useState([])
  const [idData, setIdData] = useState(0)
  const getCategoryData = () => {
    
    const categoryServices = new CategoryService
    const params = getLocales()[0].languageCode;
    categoryServices.getAllCategory(params)
      .then(res => res.json())
      .then(resJson => {
        setCategoryData(resJson)
        setLoading(false)
      }).catch(error => console.log('error', error))
  }
  const getPostData = () => {
    setLoading(true)
    setIdData(0)
    const postService = new PostService
    const params = getLocales()[0].languageCode;
    postService.getAllPosts(params)
      .then(res => res.json())
      .then(resJson => {
        setPostData(resJson)
        setmasterData(resJson)
        setLoading(false)
      }).catch(error => console.log('error', error))
  }
  const searchFilter = (text) => {
    if (text) {
        const newData = masterData.filter((item) => {
        const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1
      });
      setPostData(newData);
      setsearch(text);
    } else {
      setPostData(masterData);
      setsearch(text)
    }
  }
  const searchFilterCategory = (id) => {
    setLoading(true)
    setIdData(id)
    const postService = new CategoryDetailService
    const params = getLocales()[0].languageCode;
    postService.getAllCategoryPosts(params, id)
      .then(res => res.json())
      .then(resJson => {
        setPostData(resJson)
        setLoading(false)
      }).catch(error => console.log('error', error))
  }
  useEffect(() => {
    
    getPostData();
    getCategoryData();
  }, [])
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
  return (
    <View>
      <View
        style={styles.searchBarView}
      >
        <TextInput
          style={styles.textInput}
          theme={{ colors: { background: "#fff" } }}
          placeholder="Ne Aramak Istersiniz"
          value={search}
          onChangeText={(text) => searchFilter(text)}
        />
        <Icon name='search-outline' size={34} style={{ position: 'absolute',top:-5, left: 20 }} />

      </View>
      <View style={styles.categoriesView}>

        <ScrollView style={styles.categoriesScrollview} horizontal contentContainerStyle={{
          justifyContent: "flex-start",
          flexDirection: "row", paddingRight: 90, paddingBottom: 20,paddingLeft:10

        }}
          showsHorizontalScrollIndicator={false}>
          {idData === 0 ?
            <LinearGradient colors={['#07ef75', '#2f9e63']} style={[styles.hepsisItem]}>
              <TouchableOpacity
                style={styles.hepsiAllSubmit}
                onPress={() => getPostData()}
                underlayColor='#fff'>
                <Text style={[styles.hepsilinearsubmitText]}>{I18n.t('hepsi')}</Text>
              </TouchableOpacity>
            </LinearGradient>
            :
            <TouchableOpacity
              style={styles.hepsisubmitClicked}
              onPress={() => getPostData()}
              underlayColor='#fff'>
              <Text style={[styles.hepsitsubmitText]}>{I18n.t('hepsi')}</Text>
            </TouchableOpacity>
          }


          {categoryData.map((cat, index) => {
            if (idData === cat.categoryId.id) {
              return (
                <LinearGradient colors={['#07ef75', '#2f9e63']} style={[styles.hepsiItem]}>
                  <View style={styles.categoryItem} key={cat.id}>
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.hepsisSubmit}
                      onPress={(id) => searchFilterCategory(cat.categoryId.id)}
                      underlayColor='#fff'
                    >
                      <Text style={[styles.hepsisubmitText]}>{cat.name}</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              )
            }
            else {
              return (
                <View style={styles.categoryItem} key={cat.id}>
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.submit}
                    onPress={(id) => searchFilterCategory(cat.categoryId.id)}
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

          {loading ? <ActivityIndicator size="large" style={styles.loader}/> : 
          
          <FlatList
          contentContainerStyle={{ paddingBottom: 750 }}
          data={postData}
  
          style={styles.flat}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.container}>
                            <Pressable style={{zIndex:100}} onPress={item.detailview == 1 ? () => navigation.navigate({ name: 'ItemDetail', params: { itemtitle: item.title, itemcontent: item.content,longitude:item.longtitude,latitude:item.latitude,itemphone: item.phone,itemAttachment:item.attachmentList,youtube: item.youtube,address: item.additional,itemid:item.id,aciliskapanis: item.acilis + ' / ' + item.kapanis,smallcontent: item.smallcontent  } }): () => goToMap(item.latitude,item.longtitude,item.title)}>
              <View style={styles.tourCard}>
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
          }
     

    </View>

  )

}
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
    left: 235,
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
    width: Dimensions.get('window').width / 2,
    height: 200,
  },
})
export default SearchComp