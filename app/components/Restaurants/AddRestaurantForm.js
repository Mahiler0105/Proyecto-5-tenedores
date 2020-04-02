import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Alert, Dimensions, Text } from 'react-native'
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements'


import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'

import MapView from 'react-native-maps'
import Modal from '../Modal'
import uuid from 'uuid/v4'

import {firebaseApp} from '../../utils/FireBase'
import firebase from 'firebase/app'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp)



const widthScreen = Dimensions.get('window').width

export default function AddRestaurantForm(props) {
    const { navigation, setIsLoading, toastRef, setIsReloadRestaurant } = props
    const [imageSelected, setImageSelected] = useState([])
    const [restaurantName, setRestaurantName] = useState("")
    const [restaurantAddress, setRestaurantAddress] = useState("")
    const [restaurantDescription, setRestaurantDescription] = useState("")
    const [isVisibleMap , setIsVisibleMap] = useState(false)
    const [locationRestaurant , setLocationRestaurant] = useState(null)

    const addRestaurant =() =>{
        if(!restaurantName || !restaurantAddress || !restaurantDescription){
            toastRef.current.show('Todos los campos del formulario son obligatorios')
        }else if(imageSelected.length === 0){
            toastRef.current.show('El restaurante tiene que tener almenos una foto')
        }else if(!locationRestaurant){
            toastRef.current.show('Tienes que localizar el restaurate en el mapa')
        }else{
            setIsLoading(true)
            uploadImageStorage(imageSelected).then(arrayImages =>{
                db.collection("restaurants").add({
                    name:restaurantName,
                    address:restaurantAddress,
                    description:restaurantDescription,
                    location:locationRestaurant,
                    images:arrayImages,
                    rating:0,
                    ratingTotal:0,
                    quantityVote: 0,
                    createAt: new Date(),
                    createBy:firebase.auth().currentUser.uid
                }).then(()=>{
                    setIsLoading(false)
                    setIsReloadRestaurant(true)
                    navigation.navigate('Restaurants')
                    
                }).catch(()=>{
                    setIsLoading(false)
                    toastRef.current.show('Error al subir el restaurante, itento mas tarde')
                })
            })

        }
    }


     const uploadImageStorage= async imageArray =>{
         const imageBlob = []
         await Promise.all(
             imageArray.map(async image =>{
                 const response = await fetch(image)
                 const blob = await response.blob()
                 const ref = firebase.storage().ref('restaurant-images').child(uuid())
                 await ref.put(blob)
                 .then(result =>{
                     imageBlob.push(result.metadata.name)
                 })
                 
             })
         )
         return imageBlob

     }
    return (
        <ScrollView>
            <KeyboardAwareScrollView enableOnAndroid={true}>
                <ImageRestaurant imageRestaurant={imageSelected[0]} />
                <FormAdd setRestaurantName={setRestaurantName}
                    setRestaurantAddress={setRestaurantAddress}
                    setRestaurantDescription={setRestaurantDescription} 
                    setIsVisibleMap={setIsVisibleMap}
                    locationRestaurant={locationRestaurant}
                    
                    />
                <UploadImage toastRef={toastRef}
                    imageSelected={imageSelected}
                    setImageSelected={setImageSelected} />
                <Button
                    title='Crear Restaurante'
                    onPress={addRestaurant}
                    buttonStyle={styles.btnAddRestaurant}
                />

                <Map 
                    isVisibleMap={isVisibleMap}
                    setIsVisibleMap={setIsVisibleMap}
                    setLocationRestaurant={setLocationRestaurant}
                    toastRef={toastRef}
                
                />
            </KeyboardAwareScrollView>
        </ScrollView>
    )
}

function ImageRestaurant(props) {
    const { imageRestaurant } = props
    return (
        <View style={styles.viewFoto}>
            {imageRestaurant ? (
                <Image
                    source={{ uri: imageRestaurant }}
                    style={{ width: widthScreen, height: 200 }}
                />
            ) : (
                    <Image
                        source={require("../../../assets/images/no-image.png")}
                        style={{ width: widthScreen, height: 200 }}
                    />
                )}
        </View>
    )
}

function UploadImage(props) {

    const { imageSelected, setImageSelected, toastRef } = props


    const imageSelect = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        console.log(resultPermission)
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status
        if (resultPermissionCamera === 'denied') {
            toastRef.current.show('Es necesario aceptar los permisos de galeria , si los has rechazado tienes que ir a ajustes')

        } else if (imageSelected.length >= 2) {
            toastRef.current.show('Solo se pueden seleccionar 3 imagenes')
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })
            if (result.cancelled) {
                toastRef.current.show('Has cerrado la galeria sin seleccionar una imagen')
            } else {
                setImageSelected([...imageSelected, result.uri])
            }
        }
    }

    const removeImage = image => {
        const arrayImages = imageSelected
        Alert.alert(
            'Eliminar imagen',
            "Estas seguro que quieres eliminar la imagen",
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    onPress: () => setImageSelected(arrayImages.filter(imageUrl => imageUrl !== image))
                }
            ],
            { cancelable: false }
        )
    }
    return (
        <View style={styles.viewImage}>
            <Icon
                type='material-community'
                name='camera'
                color='#7a7a7a'
                containerStyle={styles.containerIcon}
                onPress={imageSelect}
            />
            {imageSelected.map(imageRestaurant => (
                <Avatar
                    key={imageRestaurant}
                    onPress={() => removeImage(imageRestaurant)}
                    style={styles.miniatureStyle}
                    source={{ uri: imageRestaurant }}
                />
            ))}
        </View>
    )
}

function FormAdd(props) {
    const {
        setRestaurantName, 
        setRestaurantAddress, 
        setRestaurantDescription, 
        setIsVisibleMap,
        locationRestaurant
    } = props
    return (
        <View style={styles.viewForm}>
            <Input
                placeholder='Nombre del restaurante'
                containerStyle={styles.input}
                onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder='Direccion'
                containerStyle={styles.input}
                rightIcon={{
                    type: 'material-community',
                    name: 'google-maps',
                    color: locationRestaurant ?  '#00a680' :'#c2c2c2',
                    onPress: () => setIsVisibleMap(true)
                }}
                onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
            />
            <Input
                placeholder='Descripcion del restaurante'
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )

}

function Map (props){
    const {isVisibleMap ,
         setIsVisibleMap , 
         setLocationRestaurant , 
         toastRef} = props
    
    const [location , setLocation] = useState(null)
    console.log(location)

    useEffect(()=>{
        (async ()=>{
            const resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
            const statusPermissions = resultPermissions.permissions.location.status
            if(statusPermissions !== 'granted' ){
                toastRef.current.show('Tienes que aceptar los permisos de localizacion')
            }else{
                const loc = await Location.getCurrentPositionAsync({})
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude:loc.coords.longitude,
                    latitudeDelta:0.001,
                    longitudeDelta:0.001

                })
            }
        })()
    },[])
    const confirmLocation =()=>{
        setLocationRestaurant(location)
        toastRef.current.show('Localizacion guardada correctamente')
        setIsVisibleMap(false)
    }
    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView 
                        style ={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={region => setLocation(region)}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude:location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                        <Button
                            title='Guardar Ubicacion'
                            onPress={confirmLocation}
                            containerStyle={styles.viewMapBtnContainerSave}
                            buttonStyle={styles.viewMapBtnSave}
                        
                        />
                        <Button
                            title='Cancelar Ubicacion'
                            onPress={()=> setIsVisibleMap(false)}
                            containerStyle={styles.viewMapBtnContainerCancel}
                            buttonStyle={styles.viewMapBtnCancel}
                            // titleStyle={{fontSize:10}}
                        
                        />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    viewImage: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: '#e3e3e3'
    },
    miniatureStyle: {
        width: 70,
        width: 70,
        marginRight: 10
    },
    viewFoto: {
        alignItems: 'center',
        height: 200,
        marginBottom: 20
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 100,
        width: '100%',
        padding: 0,
        margin: 0
    },
    mapStyle:{
        width:'100%',
        height:550
    },
    viewMapBtn:{
        flexDirection:'row',
        justifyContent:'center',
        marginTop:10
    },
    viewMapBtnContainerSave:{
        paddingRight:5,
        fontSize:10
    },
    viewMapBtnSave:{
        backgroundColor:'#00a680',

        
    },
    viewMapBtnContainerCancel:{
        paddingLeft:5
    },
    viewMapBtnCancel:{
        backgroundColor:'#a6060d'
    },
    btnAddRestaurant:{
        backgroundColor:'#00a680',
        margin:20
    },
    
})