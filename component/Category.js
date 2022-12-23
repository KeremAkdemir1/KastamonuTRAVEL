import React, {useState, useEffect} from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    Pressable,
    TouchableOpacity,
    TouchableHighlight,
    NativeModules,
    View
} from "react-native";
import {getLocales} from 'expo-localization';
import CategoryService from '../services/CategoryService'
import { useNavigation } from "@react-navigation/native";

const Category = () => {
    const navigation = useNavigation();
    const [categoryId, setCategoryId] = useState(undefined)
    const [categoryData, setCategoryData] = useState([])

    const navigateToCategoryScreen = () => {

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

    useEffect(() => {
        getCategoryData()
    }, [])


    const renderItem = ({item}) => (
        <View style={[styles.categoryItem]}>
            <TouchableOpacity
                style={styles.submit}
                underlayColor='#fff'
                onPress={() => navigation.navigate({name: 'KategoriDetail',params: {kategoridetailid : item.categoryId.id,kategoridetailname: item.name},merge: true})}>
                <Text style={[styles.submitText]}>{item.name}</Text>
            </TouchableOpacity>
        </View>
    );
    return (
        
        <FlatList
            contentContainerStyle={{
                alignItems: 'flex-start',
                justifyContent: "space-around",
                paddingLeft:10,
                paddingRight:10,
                paddingTop:10,
                paddingBottom:10
            }}
            style={[styles.flatList]}
            data={categoryData}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
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
        )

};

const styles = StyleSheet.create({
    submit: {
        marginTop: 10,
        paddingTop: 12,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        backgroundColor: '#fff',
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
          width: 0,
          height: 1,
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
        fontSize:16,
        height:30,
        fontWeight: 'bold',
    },
    categoryItem: {
        alignSelf: "flex-start",
        backgroundColor: "transparent",
        color:'#fff',
        width: 130,
        height:'100%'
    },
    flatList: {
        alignSelf: "flex-start",
        backgroundColor: "transparent"
    }
});

export default Category;
