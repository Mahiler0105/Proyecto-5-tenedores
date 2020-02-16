import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native'

import {NavigationEvents} from 'react-navigation'
import { Rating, Icon, ListItem } from 'react-native-elements'
import Carousel from '../../components/Restaurants/Carousel'
import Map from '../../components/Restaurants/Map'
import ListReviews from '../../components/Restaurants/ListReviews'
import Toast from 'react-native-easy-toast'


import { firebaseApp } from '../../utils/FireBase'

import firebase from 'firebase/app'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp)

const screenWidth = Dimensions.get('window').width


export default function Restaurant(props) {

    const { navigation } = props
    const { restaurant } = navigation.state.params

    const [resChange, setResChange] = useState(false)


    const toastRef = useRef()
    const [imageRestaurant, setImageRestaurant] = useState([])
    const [rating, setRating] = useState(restaurant.rating)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)


    console.log('PRIMERO', restaurant.name)
    console.log('SEGUNDO', resChange)

    firebase.auth().onAuthStateChanged(user => {
        
        console.log('ENTRE A FIREBASE')
        user ? setUserLogged(true) : setUserLogged(false)
        
    })


    useEffect(() => {
        console.log('ENTRE AL BUGGGGGGGGGGGGGGGG:')
        const arrayUrls = [];
        (async () => {
            await Promise.all(
                restaurant.images.map(async (idImage) => {
                    await firebase.storage().ref(`restaurant-images/${idImage}`).getDownloadURL()
                        .then(imageUrl => {
                            arrayUrls.push(imageUrl)
                        })
                })
            )
            setImageRestaurant(arrayUrls)

        })();
        setResChange(false)
    }, [resChange])

    useEffect(() => {
        userLogged && (
            db.collection('favorites').where('idRestaurant', '==', restaurant.id)
                .where('idUser', '==', firebase.auth().currentUser.uid)
                .get().then(response => {
                    if (response.docs.length === 1) {
                        setIsFavorite(true)
                    }
                })

        )
    }, [userLogged])

    const addFavorite = () => {
        const payload = {
            idUser: firebase.auth().currentUser.uid,
            idRestaurant: restaurant.id
        }
        db.collection('favorites').add(payload).then(() => {
            setIsFavorite(true)
            toastRef.current.show('Restaurante añadido a la lista de favoritos')
        }).catch(() => {
            toastRef.current.show('Error al añadir el restaurante a la lista de favoritos')
        })
    }



    const removeFavorite = () => {
        db.collection('favorites').where('idRestaurant', '==', restaurant.id)
            .where('idUser', '==', firebase.auth().currentUser.uid)
            .get().then(response => {
                response.forEach(doc => {
                    const idFavorite = doc.id
                    db.collection('favorites')
                        .doc(idFavorite).delete()
                        .then(() => {
                            setIsFavorite(false)
                            toastRef.current.show('Restaurante elimininado de la lista de favoritos')
                        }).catch(() => {
                            toastRef.current.show('El restaruante no se a podido eliminar')
                        })
                })
            })
    }

    return (
        <ScrollView style={styles.viewBody}>
               <NavigationEvents onWillFocus={() => setResChange(true)} />
            {
                userLogged === true && (

                    <View style={styles.favoritos}>
                        <Icon
                            type='material-community'
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            onPress={isFavorite ? removeFavorite : addFavorite}
                            color={isFavorite ? '#00a680' : '#000'}
                            size={35}
                            underlayColor='transparent'
                        />
                    </View>
                )
            }
            <Carousel
                arrayImage={imageRestaurant}
                width={screenWidth}
                height={250}
            />
            <TitleRestaurant
                name={restaurant.name}
                description={restaurant.description}
                rating={rating}
            />
            <RestaurantInfo
                location={restaurant.location}
                name={restaurant.name}
                address={restaurant.address}

            />
            <ListReviews
                navigation={navigation}
                idRestaurant={restaurant.id}
                setRating={setRating}

            />
            <Toast ref={toastRef} position='center' opacity={0.5} />
        </ScrollView>
    )
}

function TitleRestaurant(props) {
    const { name, description, rating } = props
    console.log(props)
    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.nameRestaurnt}> {name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descripcionRestaurant}> {description}</Text>
        </View>
    )

}


function RestaurantInfo(props) {
    const { location, name, address } = props
    const listInfo = [
        {
            text: address,
            iconName: 'map-marker',
            iconType: 'material-community',
            action: null
        }
    ]
    return (
        <View style={styles.info}>
            <Text style={styles.restaurantInfoTitle}>
                Información sobre el restaurante
            </Text>
            <Map location={location} name={name} height={100} />
            {listInfo.map((item, index) => (
                <ListItem
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.iconType,
                        color: '#00a680'
                    }}
                    containerStyle={styles.containerListItem}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    favoritos: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 30,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 5,
        paddingLeft: 15
    }

    , viewRestaurantTitle: {
        margin: 15
    },
    nameRestaurnt: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    rating: {
        position: 'absolute',
        right: 0
    },
    descripcionRestaurant: {
        // color: 'grey',
        marginTop: 5
    },
    info: {
        margin: 15,
        marginTop: 15
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    containerListItem: {
        borderBottomColor: '#d8d8d8',
        borderBottomWidth: 1
    }
})