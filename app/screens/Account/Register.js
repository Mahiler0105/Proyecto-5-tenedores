import React, {useRef} from 'react'
import {StyleSheet, View, Image, Text} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RegisterForm from '../../components/Account/RegisterForm'
import Toast from 'react-native-easy-toast'

export default function Register(){
    const toastRef = useRef()
    return (
        <KeyboardAwareScrollView enableOnAndroid={true}>
            <Image
                source={require('../../../assets/images/5icono-logo.png')}
                style={styles.logo}
                resizeMode='contain'
            />
            <View style={styles.viewForm}>
                <RegisterForm toastRef={toastRef}></RegisterForm>
            </View>
            <Toast 
                position='center' 
                ref={toastRef} 
                opacity={0.5}
            />
        </KeyboardAwareScrollView>

        
    ) 
}

const styles = StyleSheet.create({
    logo:{
        width:'100%',
        height:150,
        marginTop:20
    },viewForm:{
        marginRight:40,
        marginLeft:40
    }
})