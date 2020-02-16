import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ActionButton from 'react-native-action-button'
import ListRestaurants from '../../components/Restaurants/ListRestaurants'

import { firebaseApp } from '../../utils/FireBase'
import firebase from 'firebase/app'
import 'firebase/firestore'
const db = firebase.firestore(firebaseApp)


export default function Restaurants(props) {

    const { navigation } = props;
    const [user, setUser] = useState(null)
    const [restaurants, setRestaurants] = useState([])
    const [startRestaurants, setStartRestaurants] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [totalRestaurants, setTotalRestaurants] = useState(0)
    const [isReloadRestaurant, setIsReloadRestaurant] = useState(false)
    const limitRestaurants = 8
   
   // console.log('PERO QUE PEDO PEDO PEDO PEDO',restaurants)
   
    useEffect(() => {
        firebase.auth().onAuthStateChanged(userInfo => {
            setUser(userInfo)
        })
    }, [])

    useEffect(() => {
        db.collection('restaurants').get().then(snap => {
            setTotalRestaurants(snap.size)
        });
        (async () => {
            const resultRestaurant = []
            const restaurantes = db.collection('restaurants').orderBy('createAt', 'desc').limit(limitRestaurants)
            await restaurantes.get().then(response => {
                setStartRestaurants(response.docs[response.docs.length - 1])
                response.forEach(doc => {
                    let restaurant = doc.data()
                    restaurant.id = doc.id;
                    resultRestaurant.push({ restaurant })
                })
                setRestaurants(resultRestaurant)
            })
        })()
        setIsReloadRestaurant(false)
    }, [isReloadRestaurant])

    const handleLoadMore = async () => {
        // console.log('Entre perros')
        const resultRestaurants = []
        restaurants.length < totalRestaurants && setIsLoading(true)

        const restaurantDb = db.collection('restaurants').orderBy('createAt', 'desc').startAfter(startRestaurants.data().createAt)
            .limit(limitRestaurants)
        await restaurantDb.get().then(response => {
            if (response.docs.length > 0) {
                setStartRestaurants(response.docs[response.docs.length - 1])
            } else {
                setIsLoading(false)
            }
            response.forEach(doc => {
                let restaurant = doc.data()
                restaurant.id = doc.id;
                resultRestaurants.push({ restaurant })
            })
            setRestaurants([...restaurants, ...resultRestaurants])
            setIsLoading(false)
        })
    }

    return (
        <View style={styles.viewBody}>
            <ListRestaurants restaurants={restaurants} navigation={navigation} isLoading={isLoading} handleLoadMore={handleLoadMore} />
            {
                user && <AddRestaurantButton navigation={navigation} setIsReloadRestaurant={setIsReloadRestaurant} />

            }

        </View>
    )
}


function AddRestaurantButton(props) {
    const { navigation, setIsReloadRestaurant } = props
    return (
        <ActionButton
            buttonColor='#00a680'
            onPress={() => navigation.navigate('AddRestaurant', { setIsReloadRestaurant })}
        />
    );
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    }
})