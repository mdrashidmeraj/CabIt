import React, {useEffect, useRef} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView, { Marker} from 'react-native-maps';
import { selectOrigin, selectdestination, setTravelTimeInformation } from '../slices/navSlice';
import { useSelector, useDispatch } from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from "@env";


const Map = () => {
    const origin = useSelector(selectOrigin)
    const destination = useSelector(selectdestination);
    const mapRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
       if(!origin || !destination) return;
        //Zoom & fit
       mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
           edgePadding:{ top: 50, right: 50, bottom: 50, left: 50},
       })
    }, [origin, destination])

    
    useEffect(()=>{
        if(!origin || !destination) return;
        const getTravelTime = async() => {
            await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=AIzaSyAEDZFhs4Iig2OPsMovUj4rn6gu6ZHju4s`)
            .then((res)=> res.json())
            .then((data)=>{
                dispatch(setTravelTimeInformation(data.rows[0].elements[0]))
            });
        };
        getTravelTime();
    }, [origin, destination, GOOGLE_MAPS_APIKEY])

    return (
        <View>
            <MapView
                ref={mapRef}
                style={styles.map}
                mapType="mutedStandard"
                initialRegion={{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
                }}
            >
                {origin && destination && (
                    <MapViewDirections
                        lineDashPattern={[0]}
                        origin={origin.description}
                        destination={destination.description}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="black"
                    />
                )}
                {origin?.location &&(
                    <Marker
                        coordinate={{
                            latitude: origin.location.lat,
                            longitude: origin.location.lng
                        }}
                        title="Origin"
                        description={origin.description}
                        identifier="origin"
                    />
                )}
                {destination?.location &&(
                    <Marker
                        coordinate={{
                            latitude: destination.location.lat,
                            longitude: destination.location.lng
                        }}
                        title="Destination"
                        description={destination.description}
                        identifier="destination"
                    />
                )}
            </MapView>
        </View>
    )
}

export default Map

const styles = StyleSheet.create({
    map:{
        height:400,
        width:400

    }
})
