import { View,Text,Pressable,Image,StyleSheet,Dimensions,StatusBar ,SafeAreaView} from "react-native"
import FavorilerComp from "../component/FavorilerComp"
import I18n from "i18n-js"
import { useNavigation } from "@react-navigation/native";
const Favoriler = () =>{
    const navigation = useNavigation();
return(
    <SafeAreaView style={styles.favorilerView}>
        <View style={styles.topbarView}>
        <View style={styles.rectangleView} />
        <Text style={styles.titleText}>{I18n.t('favoriler')}</Text>
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
          <FavorilerComp/>
          </View>
    </SafeAreaView>
)
}
const styles = StyleSheet.create({
    contentView: {
        top:100
       },
       topbarView: {
           position: "absolute",
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
           height: 70,
           paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30
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
           margin:20
       },
       goBack: {
           position: "absolute",
           left: 25,
           top: 23,
           width: 26.25,
           height: 35,
       },
       goBackIcon: {
           width: "100%",
           height: "100%",
           overflow: "hidden",
       },
})
export default Favoriler