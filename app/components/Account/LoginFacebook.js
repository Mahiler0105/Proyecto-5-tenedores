import React, {useState} from 'react'
import * as firebase from 'firebase'
import {SocialIcon} from 'react-native-elements'
import * as Facebook from 'expo-facebook'
import {FacebookApi} from '../../utils/Social'
import Loading from '../../components/Loading' 
// import Expo from 'expo'
export default function LoginFacebookI(props){
    
    const {toastRef , navigation} = props;
    const [isLoading, setIsLoading] = useState(false)


    const login = async () =>{
        await Facebook.initializeAsync(FacebookApi.application_id)
        const {type, token} = await Facebook.logInWithReadPermissionsAsync({
        permissions: FacebookApi.permissions 
        });

        if(type === 'success'){
            setIsLoading(true)
            const credentials = firebase.auth.FacebookAuthProvider.credential(token)
            await firebase.auth().signInWithCredential(credentials)
            .then(()=>{
                navigation.navigate('MyAccount')
            }).catch(()=>{
                toastRef.current.show('Error accediendo con Facebook, intentelo mas tarde')
            })
        }else if (type === 'cancel') {
            toastRef.current.show('Inicio de sesion cancelado')
        }else{
            toastRef.current.show('Error desconocido, intentelo mas tarde')
        }
        setIsLoading(false)
    } 
    return (
        <>
        <SocialIcon
            title='Iniciar sesión con facebook'
            button
            type='facebook'
            onPress={login}
        />
        <Loading isvisible={isLoading} text='Iniciando sesión'/>
        </>
    )
}