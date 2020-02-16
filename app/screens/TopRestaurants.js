import React, {useState , useRef , useEffect}from 'react'
import {View, Text} from 'react-native'

import ListTopRestaurant from '../components/Ranking/ListTopRestaurant'

import {firebaseApp} from '../utils/FireBase'
import firebase from 'firebase/app'
import 'firebase/firestore'
import Toast from 'react-native-easy-toast'


const db = firebase.firestore(firebaseApp)

export default function TopRestaurants(props){
    const {navigation} = props
    const [restaurants , setRestaurants] = useState([])
    const toastRef = useRef()

    useEffect(()=>{
        (async () =>{
            db.collection('restaurants')
            .orderBy('rating', 'desc')
            .limit(5)
            .get()
            .then(response=>{
                const restaurantArray = []
                response.forEach(doc=>{
                    let restaurants = doc.data()
                    restaurants.id = doc.id
                    restaurantArray.push(restaurants)
                })
                setRestaurants(restaurantArray)
            }).catch(()=> {
                toastRef.current.show('Error al cargar el Ranking, intentelo mas tarde')
            })
        })()
    },[])
    
    
    return(
        <View>
            <ListTopRestaurant restaurants={restaurants} navigation={navigation}/>
            <Toast ref={toastRef}  position='center' opacity={0.7} />
        </View>
    )
}