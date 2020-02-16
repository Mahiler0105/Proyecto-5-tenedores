import React from 'react'
import MapView from 'react-native-maps'
// import openMap  from 'react-native-open-maps'
import OpenMap from "react-native-open-map";



export default function Map (props){
    const {location , name , height} = props

    const openAppMap = () =>{
        OpenMap.show({
            latitude: location.latitude,
            longitude: location.longitude,
            title: "jose no mames",
            //query:'jose'
              
        })
    }

    return (
        <MapView
            style={{height:height , width:'100%'}}
            initialRegion={location}
            onPress={openAppMap}
        >
            <MapView.Marker
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                }}
            
            />

        </MapView>
    )

}


