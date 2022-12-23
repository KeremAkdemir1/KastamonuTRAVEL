import { View,Text,StyleSheet,Dimensions,Image,Pressable,SafeAreaView } from "react-native"
import CategoryDetailCard from "../component/CategoryDetailCard"
import I18n from 'i18n-js'
const KategoriDetail = ({navigation,route}) =>{


    return(
        <SafeAreaView>
            <View style={styles.topbarView}>
        <View style={styles.rectangleView} />
        <Text style={styles.titleText}>{route.params?.kategoridetailname}</Text>
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
        <View style={styles.contentView}>
        <CategoryDetailCard 
        id={route.params?.kategoridetailid}
        />
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    contentView:{
        top:100
    },
    topbarView: {
        position: "absolute",
        top: 0,
        left: 0,
        width: Dimensions.get('window').width,
        height: 80,
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
    titleText: {
        position: "absolute",
        top: 32,
        fontSize: 25,
        fontFamily: "Futura-Bold",
        fontWeight: 'bold',
        color: "#000",
        textAlign: "center",
        alignContent:'center',
        alignItems:'center',
        alignSelf:'center',
    },
    goBack: {
        position: "absolute",
        left: 25,
        top: 29,
        width: 26.25,
        height: 35,
    },
    goBackIcon: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
    },
})

export default KategoriDetail