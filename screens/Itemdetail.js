import React from "react";
import { useEffect, useState } from "react";
import AutoHeightWebView from 'react-native-autoheight-webview'
import {
    FlatList,
    StyleSheet,
    Text,
    Pressable,
    View,
    Image,
    ScrollView,
    ImageBackground,
    Dimensions,
    Linking, Platform, SafeAreaView
} from "react-native";
import { Modal } from 'react-native';
import { WebView } from 'react-native-webview'
import * as Application from 'expo-application';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImageSlider from 'react-native-image-slider';
import { Audio } from 'expo-av'
import { useNavigation } from "@react-navigation/native";
import I18n from "i18n-js";
import AddToFavoriteService from "../services/AddToFavoriteService";
import GetFavoritesService from "../services/GetFavoritesService";
const deviceWidth = Dimensions.get('screen').width
const Itemdetail = ({ route }) => {
    const [favorite, setFavorite] = useState([])
    const [newFavorite, setNewFavorite] = useState(undefined)
    const navigation = useNavigation()
    const [iconBackground, setIconBackground] = useState(require('../assets/voiceButton.png'))
    const [masterData, setMasterData] = useState(route.params?.itemAttachment)
    const [display, setDisplay] = useState('none')
    const [vr, setVr] = useState([])
    const [photos, setPhotos] = useState([])
    const [state, setState] = useState({
        index: 0,
        modalVisible: false
    });
    const sound = new Audio.Sound();
    Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INNTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: true
    })
    const goToMap = (lat, lng, title) => {
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
        if (Platform.OS == "ios") {
            Application.getIosIdForVendorAsync().then((res) => {
                favoritesService.AddFavorites(res, postId).then(rest => rest.json()).then(restJson => {
                    setFavorite(restJson)
                }).catch(error => console.log(error))
            })
        }
        else {
            favoritesService.AddFavorites(Application.androidId, postId).then(res => res.json()).then(resJson => {
                setFavorite(resJson)
            }).catch(error => console.log(error))
        }
    }

    const getFavorites = () => {
        const favoriteService = new GetFavoritesService
        if (Platform.OS == "ios") {
            Application.getIosIdForVendorAsync().then((res) => {
                favoriteService.getAllFavorites(res).then(rest => rest.json()).then(restJson => {
                    setFavorite(restJson)
                }).catch(error => console.log(error))
            })
        }
        else {
            favoriteService.getAllFavorites(Application.androidId).then(res => res.json()).then(resJson => {
                setFavorite(resJson)
            }).catch(error => console.log(error))
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getFavorites()
            if (masterData === undefined && masterData[0] === [] && masterData[0] === null) {
                setDisplay('none')
            }
            else {
                setDisplay('flex')
                var PATTERN = '360'

                setVr(masterData.filter(function (str) { return str.filename.includes(PATTERN); }))
                setPhotos(masterData.filter(function (str) { return !str.filename.includes(PATTERN); }))
            }
        });
        return unsubscribe
    }, [navigation])
    sound.loadAsync({ uri: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg' })
    const playSound = () => {
        sound.playAsync();
        sound.setPositionAsync(0)
    }
    const images = []
    photos.forEach(element => {
        images.push("https://kastamonutravelguide.com/" + element.filepath)
    })

    const imageViewer = [];
    photos.forEach(element => {
        imageViewer.push({
            url: "https://kastamonutravelguide.com/" + element.filepath,
            props: {

            },
            freeHeight: true
        })
    });



    return (
        <View>
            <View style={styles.topbarView}>
                <View style={styles.rectangleView} />
                <Text style={styles.titleText}> {route.params?.itemtitle.substring(0, 20)}...</Text>
                <Pressable
                    style={styles.goBack}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        style={styles.goBackIcon}
                        source={require("../assets/goBack.png")}
                        resizeMode="cover"
                    />
                </Pressable>

            </View>
            <ScrollView
                overScrollMode="never"
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ width: Dimensions.get('screen').width }}
            >

                <View style={{ height: 540 }}>
                    <View style={styles.topCardRect} />
                    <View style={{ height: 340 }}>
                        <ImageSlider
                            images={images}
                            loopBothSides
                            autoPlayWithInterval={5000}
                            customSlide={({ index, item, style, width }) => (
                                <View
                                    key={index}
                                    style={[
                                        style,
                                        styles.customSlide,

                                    ]}
                                >
                                    <Pressable style={{ width: 200, height: 300, position: 'absolute' }} onPress={() => setState({ modalVisible: true })}>
                                        <Image source={{ uri: item }} style={styles.customImage} />
                                    </Pressable>
                                    <View
                                    >

                                        <Modal
                                            visible={state.modalVisible}
                                            transparent={true}
                                            onRequestClose={() => setState({ modalVisible: false })}
                                        >

                                            <Pressable
                                                style={styles.goBack}
                                                onPress={() => setState({ modalVisible: false })}
                                            >
                                                <Image
                                                    style={styles.goBackIcon}
                                                    source={require("../assets/itemGalleryGoBack.png")}
                                                    resizeMode="cover"
                                                />
                                            </Pressable>
                                            <ImageViewer
                                                imageUrls={imageViewer}
                                                index={state.index}
                                                onSwipeDown={() => {
                                                    setState({ modalVisible: false })
                                                }}
                                                enableSwipeDown={true}
                                            />
                                        </Modal>
                                    </View>

                                </View>
                            )}
                        />
                        <View>
                            <Pressable onPress={() => AddFavorites(route.params?.itemid)} style={{ left: Dimensions.get('screen').width - 70 }}>
                                <Image
                                    source={favorite.includes(route.params?.itemid) ? require('../assets/likeButton.png') : require('../assets/likeButtonInactive.png')}
                                    style={{ width: 50, height: 50, position: 'absolute' }}
                                />
                            </Pressable>
                            <Pressable onPress={() => goToMap(route.params?.latitude, route.params?.longitude, route.params?.itemtitle)} style={{ left: Dimensions.get('screen').width - 120 }}>
                                <Image
                                    source={require('../assets/itemDetailMap.png')}
                                    style={{ width: 53, height: 53, position: 'absolute' }}
                                />
                            </Pressable>
                            <Pressable onPress={() => playSound()} style={{ left: Dimensions.get('screen').width - 170, display: 'none' }}>
                                <Image
                                    source={require('../assets/voiceButton.png')}
                                    style={{ width: 50, height: 50, position: 'absolute' }}
                                />
                            </Pressable>
                            <Pressable style={{ position: "absolute", top: -80, left: 26, width: 70, height: 76, display: vr.length > 0 ? 'flex' : 'none' }} onPress={() => navigation.navigate({ name: 'VirtualReality', params: { itemid: route.params?.itemid, images: vr, itemtitle: route.params?.itemtitle } })}>
                                <Image
                                    style={styles.vrButtonBackground}
                                    source={require('../assets/vrButtonBackground.png')}
                                    resizeMode="cover"
                                />
                                <Image
                                    style={styles.vrButton}
                                    source={require('../assets/vrButton.png')}
                                    resizeMode="cover"
                                />
                            </Pressable>
                        </View>
                        <Text style={styles.contentTitleText}>{route.params?.itemtitle}</Text>
                        <Text style={styles.contentAddressText}>{route.params?.smallcontent !== null ? route.params?.smallcontent : I18n.t('smallContentYok')}</Text>
                        <Text style={styles.contentOpenCloseText}>{route.params?.aciliskapanis === 'null / null' ? '' : route.params?.aciliskapanis}</Text>
                    </View>
                </View>
                {route.params?.youtube !== null ?
                    <View >
                        <WebView

                            javaScriptEnabled={true}
                            scrollEnabled={false}
                            source={{ uri: route.params?.youtube }}
                            overScrollMode='never'
                            containerStyle={{ opacity: 0.99, width: Dimensions.get('screen').width, height: 300, top: -100 }}
                        />
                        <AutoHeightWebView
                            containerStyle={{ opacity: 0.99, top: -60 }}
                            customStyle={`
                            p {
                                width: 95% !important;
                                font-size: 20px !important;
                                text-indent: -1px !important;
                                margin: 0 auto !important;
                              }
                              p > img {
                                  width: 95% !important;
                                  height:auto !important;
                                  margin: 0 auto !important;
                              }
                              span {
                                  font-size:20px !important;
                                  font-family: "Times New Roman", Times, serif !important;
                                  text-indent: -10px !important;
                              }
    
                              img {
                                 display: block !important;
                                  width: 95% !important;
                                  height:auto !important;
                              }

                                `}
                            source={{ html: route.params?.itemcontent + `<div style="height:100px">.</div>` }}
                            originWhitelist={['*']}
                            scalesPageToFit={false}
                            nestedScrollEnabled={false}
                            scrollEnabled={false}
                            style={{ backgroundColor: 'transparent' }}
                        />
                    </View>
                    :

                    <AutoHeightWebView
                        containerStyle={{ opacity: 0.99, top: -60 }}
                        customStyle={`
                        p {
                            width: 95% !important;
                            font-size: 20px !important;
                            text-indent: -1px !important;
                            margin: 0 auto !important;
                            word-break:break-all
                          }
                          p > img {
                              width: 95% !important;
                              height:auto !important;
                              margin: 0 auto !important;
                          }
                          span {
                              font-size:20px !important;
                              font-family: "Times New Roman", Times, serif !important;
                              word-break: break-word;
                              text-indent: -10px !important;
                          }

                          img {
                             display: block !important;
                              width: 95% !important;
                              height:auto !important;
                          }

                                `}
                        source={{ html: route.params?.itemcontent + `<div style="height:100px">.</div>` }}
                        originWhitelist={['*']}
                        scalesPageToFit={false}
                        nestedScrollEnabled={false}
                        scrollEnabled={false}
                        style={{ backgroundColor: 'transparent' }}
                    />

                }
            </ScrollView>

        </View>

    );
}
const styles = StyleSheet.create({
    likeButtonIcon: {
        left: Dimensions.get('screen').width - 70,
        width: 47,
        height: 50.5,
    },
    mapViewBackground: {
        position: "absolute",
        left: -6,
        width: 47,
        height: 50.5,
    },
    mapViewIcon: {
        position: "absolute",
        width: 27,
        height: 30.5,
        left: 4,
        top: 8
    },
    mapViewPressable: {
        left: Dimensions.get('screen').width - 115,
        width: 35,
        height: 38.5,
    },
    voiceButtonIcon: {
        position: "absolute",
        width: 47,
        height: 50.5,
    },
    vrButtonBackground: {
        position: "absolute",
        left: -6,
        width: 62,
        height: 68,
    },
    vrButton: {
        top: 20,
        position: "absolute",
        left: 13,
        width: 24,
        height: 24.75,
    },
    vrPressable: {
        position: "absolute",
        top: -80,
        left: 26,
        width: 70,
        height: 76,
    },
    contentTitleText: {
        fontFamily: 'Futura-Bold',
        fontWeight: 'bold',
        textAlign: 'left',
        width: Dimensions.get('screen').width - 80,
        top: 55,
        fontSize: 20,
        left: 30
    },
    contentPhoneText: {
        fontFamily: 'Futura-Bold',
        textAlign: 'left',
        top: 60,
        fontSize: 15,
        left: 30
    },
    contentAddressText: {
        fontFamily: 'Futura Md BT',
        textAlign: 'left',
        fontSize: 20,
        top: 70,
        left: 30
    },
    contentOpenCloseText: {
        fontFamily: 'Futura Md BT',
        textAlign: 'left',
        fontSize: 17,
        top: 80,
        left: 30
    },
    topCardRect: {
        position: 'absolute',
        borderRadius: 30,
        backgroundColor: "#fff",
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 6,
        elevation: 6,
        shadowOpacity: 1,
        width: Dimensions.get('window').width,
        height: 430,
    },
    customImage: {
        width: Dimensions.get('window').width,
        height: 400,
    },
    rectangleView: {
        position: "absolute",
        top: 0,
        left: 0,
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
        width: Dimensions.get('window').width,
        height: 80,
    },
    rectangleView2: {
        position: "absolute",
        top: 30,
        left: 20,
        borderRadius: 40,
        backgroundColor: "#fff",
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 6,
        elevation: 6,
        shadowOpacity: 1,
        width: 60,
        height: 60,
    },
    titleText: {
        position: "absolute",
        top: 32,
        fontSize: 20,
        fontFamily: "Futura-Bold",
        fontWeight: 'bold',
        color: "#000",
        textAlign: "center",
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    goBackIcon: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
    },
    goBack: {
        position: "absolute",
        left: 25,
        top: 29,
        width: 30.25,
        height: 35,
        zIndex:99
    },
    topbarView: {
        position: "relative",
        top: 0,
        left: 0,
        width: Dimensions.get('window').width,
        height: 100
    },

});
export default Itemdetail;
