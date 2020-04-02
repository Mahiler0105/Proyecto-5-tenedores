import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import { Image, Icon, Button } from 'react-native-elements'

import Toast from 'react-native-easy-toast'
import Loading from '../components/Loading'

import { firebaseApp } from '../utils/FireBase'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { NavigationEvents } from 'react-navigation'

const db = firebase.firestore(firebaseApp)

export default function Favorites(props) {

    const { navigation } = props
    const [favorites, setFavorites] = useState([])
    const [reloadRestaurants, setReloadRestaurant] = useState(false)
    const [isVisibleLoading, setIsVisibleLoading] = useState(false)
    const toastRef = useRef()

    const [userLogged, setUserLogged] = useState(false)
    const [changeRest  , setChangeRest] = useState(false)

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useEffect(() => {
        if (userLogged) {
            setChangeRest(false)
            const idUser = firebase.auth().currentUser.uid
            db.collection('favorites').where('idUser', '==', idUser).get()
                .then(response => {
                    const idRestaurantsArray = []
                    response.forEach(doc => {
                        idRestaurantsArray.push(doc.data().idRestaurant)
                    })
                    getDataRestaurants(idRestaurantsArray)
                        .then(response => {
                            const restaurants = []
                            response.forEach(doc => {
                                let restaurant = doc.data()
                                restaurant.id = doc.id
                                restaurants.push(restaurant)
                            })
                            setFavorites(restaurants)
                            setChangeRest(true)
                        })
                })
           
        }
        setReloadRestaurant(false)
        navigation.setParams({contador: 1} )
       
    }, [reloadRestaurants])

    const getDataRestaurants = idRestaurantArray => {
        const arrayRestaurants = []
        idRestaurantArray.forEach(idRestaurant => {
            const restult = db.collection('restaurants').doc(idRestaurant).get()
            arrayRestaurants.push(restult)
        })
        return Promise.all(arrayRestaurants)
    }

    if (!userLogged){
        return (<UserNotLogged setReloadRestaurant={setReloadRestaurant} navigation={navigation}/>)
    }if (favorites.length === 0) return <NotFoundRestaurants setReloadRestaurant={setReloadRestaurant} />
    
    return (
        <View style={styles.viewBody}>
            <NavigationEvents onWillFocus={() => setReloadRestaurant(true)} />
            {favorites ?
                (
                    <FlatList
                        data={favorites}
                        renderItem={restaurant =>
                            <Restaurant restaurant={restaurant}
                                navigation={navigation}
                                setIsVisibleLoading={setIsVisibleLoading}
                                setReloadRestaurant={setReloadRestaurant}
                                toastRef={toastRef}
                                changeRest={changeRest}

                            />}
                        keyExtractor={(item, index) => index.toString()}
                    >
                    </FlatList>
                ) :
                (
                    <View style={styles.loaderRestaurant}>
                        <ActivityIndicator size='large' />
                        <Text>Cargando restarurates</Text>
                    </View>
                )
            }
            <Toast ref={toastRef} position='center' opacity={1} />
            <Loading text='Eliminando Restaurante' isvisible={isVisibleLoading} />
        </View>
    )
}

function Restaurant(props) {
    const { restaurant, navigation, setIsVisibleLoading, setReloadRestaurant, toastRef , changeRest} = props
    const { name, images, id } = restaurant.item
    const [image, setImage] = useState("")

    useEffect(() => {
        const image = images[0]
        firebase.storage().ref(`restaurant-images/${image}`).getDownloadURL()
            .then(response => {
                setImage(response)
            })
    }, [changeRest])


    const confirmRemoveFavorite = () => {
        Alert.alert(
            'Eliminar Restaurante de Favoritos',
            '¿Estas seguro de que quiere eliminar el restaurante de favoritos ?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    onPress: removeRestaurant
                }
            ],
            { cancelable: false }

        )
    }
    const removeRestaurant = () => {
        setIsVisibleLoading(true)

        db.collection('favorites').where('idUser', '==', firebase.auth().currentUser.uid)
            .where('idRestaurant', '==', id)
            .get().then(response => {
                response.forEach(doc => {
                    const idFavorite = doc.id
                    db.collection('favorites').doc(idFavorite).delete().then(() => {
                        setIsVisibleLoading(false)
                        setReloadRestaurant(true)
                        toastRef.current.show('Restaurante eliminado')
                    }).catch(() => {
                        setIsVisibleLoading(false)
                        toastRef.current.show('Error al eliminar el restaurante')
                    })
                })
            })
    }

    return (
        <View style={styles.restaurant}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Restaurant', { restaurant: restaurant.item  })}
            >
                <Image
                    resizeMode='cover'
                    source={{ uri: image }}
                    style={styles.imageRestaurant}
                    PlaceholderContent={<ActivityIndicator color='#fff' />}
                />
            </TouchableOpacity>
            <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <Icon
                    type='material-community'
                    name='heart'
                    color='#00a680'
                    containerStyle={styles.favorite}
                    onPress={confirmRemoveFavorite}
                    size={40}
                    underlayColor='transparent'
                />
            </View>
        </View>
    )
}


function NotFoundRestaurants(props) {
    const { setReloadRestaurant} = props
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <NavigationEvents onWillFocus={() => setReloadRestaurant(true)} />

            <Icon
                type='material-community'
                name='alert-outline'
                size={50}
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            No tienes restaurantes en tu lista
 
            </Text>
           
        </View>
    )
}



function UserNotLogged(props) {
    const { setReloadRestaurant, navigation } = props
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <NavigationEvents onWillFocus={() => setReloadRestaurant(true)} />

            <Icon
                type='material-community'
                name='alert-outline'
                size={50}
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign:'center' }}>
            Necesitas estar logeado para ver esta sección 
            </Text>
            <Button
                title='Ir al login'
                onPress={()=>navigation.navigate('Login')}
                containerStyle={{marginTop:20, width:'80%'}}
                buttonStyle={{backgroundColor:'#00a680'}}
            />
        </View>
    )
}






const styles = StyleSheet.create({
    loaderRestaurant: {
        marginTop: 10,
        marginBottom: 10
    },
    viewBody: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    restaurant: {
        margin: 10,
    },
    imageRestaurant: {
        width: '100%',
        height: 180
    },
    info: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: -30,
        backgroundColor: '#fff'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20
    },
    favorite: {
        marginTop: -35,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 100
    }
})