import {View,StyleSheet,Dimensions,Text,Image,Pressable,StatusBar,SafeAreaView} from 'react-native'
import { useNavigation } from "@react-navigation/native";
import I18n from "i18n-js";
import MapComp from '../component/MapComp';

const Harita = () => {
    const navigation = useNavigation();
return(
    <SafeAreaView>
        <SafeAreaView style={styles.topbarView}>
        <SafeAreaView style={styles.rectangleView} />
        <Text style={styles.titleText}>{I18n.t('harita')}</Text>
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
          </SafeAreaView>
          
          <MapComp/>
          </SafeAreaView>
)
}
const styles = StyleSheet.create({
    mapPageView:{
        height:1,
        zIndex:99
    },
    topbarView: {
        position: "absolute",
        left: 0,
        width: Dimensions.get('window').width,
        height: 10,
        zIndex:99
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
        height: 70,
        zIndex:99,
    
    },
    titleText: {
        position: "absolute",
        fontSize: 25,
        fontFamily: "Futura-Bold",
        fontWeight: 'bold',
        color: "#000",
        textAlign: "center",
        alignContent:'center',
        alignItems:'center',
        alignSelf:'center',
        margin:20,
        zIndex:99
    },
    goBack: {
        position: "absolute",
        left: 25,
        top: 23,
        width: 26.25,
        height: 35,
        zIndex:99
    },
    goBackIcon: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex:99
    },
})
export default Harita;