import React ,{useRef, useState} from 'react'
import {View, Text} from 'react-native'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'
import AddRestaurantForm from '../../components/Restaurants/AddRestaurantForm'

export default function AddRestaurant (props){
    const {navigation } = props
    const {setIsReloadRestaurant} = navigation.state.params
    const [isLoading , setIsLoading] = useState(false)
    const toastRef = useRef()
    return (
        <View>
            <AddRestaurantForm 
                navigation={navigation} 
                toastRef={toastRef} 
                setIsLoading={setIsLoading}
                setIsReloadRestaurant={setIsReloadRestaurant}
            />
            <Toast  ref={toastRef} position='center' opacity={0.8} />
            <Loading isvisible={isLoading} text='Creando Restaurante'/>
        </View>
    )
}