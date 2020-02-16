import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import {NavigationEvents} from 'react-navigation'
import * as firebase from 'firebase'

export default function ListRestaurants(props) {

    const { restaurants, isLoading,  handleLoadMore , navigation } = props

    return (
        <View >
            {restaurants ? (
                <FlatList
                    renderToHardwareTextureAndroid={true}
                    data={restaurants}
                    renderItem={restaurant => <Restaurant navigation={navigation}  restaurant={restaurant} handleLoadMore={handleLoadMore} />}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={<FooterList isLoading={isLoading}/>}
                />) 
                : (
                    <View style={styles.loaderRestaurants}>
                        <ActivityIndicator size='large' />
                        <Text> Cargando restaurantes</Text>
                    </View>
                )}
        </View>
    )
}


function Restaurant(props) {
    const { restaurant , navigation  } = props
    const { name, address, description, images } = restaurant.item.restaurant
    const [imageRestaurant, setImageRestaurant] = useState(null)
    const [changeRest , setChangeRest] = useState(false)

    console.log(navigation)

    useEffect(() => {
        const image = images[0]
        console.log('*****',name ,' : ', image)

        firebase.storage().ref(`restaurant-images/${image}`).getDownloadURL()
            .then(restult =>{
                setImageRestaurant(restult)
                setChangeRest(false)}
        ).catch(err => console.log('pero que pedo pedo',err))
    }, [changeRest])

    return (
        <TouchableOpacity onPress={()=> navigation.navigate('Restaurant', {restaurant : restaurant.item.restaurant})}>
             <NavigationEvents onWillFocus={() => setChangeRest(true)} />
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}>
                    <Image
                        resizeMode='cover'
                        source={{ uri: imageRestaurant }}
                        style={styles.imageRestaurant}
                        PlaceholderContent={<ActivityIndicator color='#fff' />}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantAddress}>{address}</Text>
                    <Text style={styles.restaurantDescripcion}>{description.substr(0, 34)}...</Text>
                </View>
            </View>
        </TouchableOpacity>

    )

}

function FooterList (props){
    const {isLoading} = props

    if(isLoading){
        return(
            <View style={styles.loadingRestaurants}>
                <ActivityIndicator  size='large'/>
            </View>
        )
    }else{
        return(
            <View style={styles.notFoundRestaurants}>
                <Text> No quedan restaurantes</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loadingRestaurants: {
        marginTop: 20,
        alignItems: 'center'
    },
    viewRestaurant: {
        flexDirection: 'row',
        margin: 10
    },
    viewRestaurantImage: {
        marginRight: 15
    }, imageRestaurant: {
        width: 80,
        height: 80
    },
    restaurantName: {
        fontWeight: 'bold'
    },
    restaurantAddress: {
        paddingTop: 2,
        color: 'grey'
    },
    restaurantDescripcion: {
        paddingTop: 2,
        color: 'grey',
        width: 300
    },
    loaderRestaurants:{
        marginTop:10,
        marginBottom:10
    },
    notFoundRestaurants:{
        marginTop:10,
        marginBottom:20,
        alignItems:'center'
    }

})