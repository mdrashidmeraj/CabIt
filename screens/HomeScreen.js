import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import tw from "tailwind-react-native-classnames";
import NavOptions from '../components/NavOptions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from "@env";
import {setDestination, setOrigin} from "../slices/navSlice";
import {useDispatch} from 'react-redux'
import NavFavourites from '../components/NavFavourites';

const HomeScreen = () => {
    const dispatch = useDispatch();
    return (
        <SafeAreaView style = {tw`bg-white h-full`}>
            <View style={tw`p-5`}>
                <Image
                    style={styles.image}
                    source={{
                        uri: "https://links.papareact.com/gzs"
                    }}
                />
                <GooglePlacesAutocomplete
                    placeholder='Where From?'
                    styles={{
                        container:{
                            flex:0,
                        },
                        textInput:{
                            fontSize:18,
                        },
                    }}
                    onPress={(data, details = null) => {
                       

                        dispatch(setOrigin({
                            location: details.geometry.location,
                            description: data.description
                        }))
                        dispatch(setDestination(null))
                        
                    }}
                    onFail={(error) => console.error(error)}
                    fetchDetails={true}
                    returnKeyType = {"search"}
                    minlength={2}
                    enablePoweredByContainer={false}
                    query={{
                        key: GOOGLE_MAPS_APIKEY,
                        language: 'en',
                    }}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    debounce={400}  
                />
                <NavOptions/>
                <NavFavourites/>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    image:{
        width:100,
        height: 100,
        resizeMode: "contain"
    }
})

