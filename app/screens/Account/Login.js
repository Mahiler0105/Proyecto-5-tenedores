import React, { useRef } from 'react'
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native'
import { Divider } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LoginForm from '../../components/Account/LoginForm'
import LoginFacebook from '../../components/Account/LoginFacebook'


export default function Login(props) {

    const { navigation } = props
    const toastRef = useRef()

    return (
        <ScrollView>
            <KeyboardAwareScrollView enableOnAndroid={true}>
            <Image source={require('../../../assets/images/5icono-logo.png')}
                style={styles.logo}
                resizeMode='contain'
            />
            <View style={styles.viewContainer}>
                <LoginForm toastRef={toastRef}></LoginForm>
                <CreateAccount navigation={navigation}></CreateAccount>
            </View>
            <Divider style={styles.divider}  />
            <View style={styles.viewContainer}>
                <LoginFacebook toastRef={toastRef} navigation={navigation} />
            </View>
            <Toast ref={toastRef}  position='center' opacity={0.8} />
            </KeyboardAwareScrollView>
        </ScrollView>
    )
}

function CreateAccount(props) {
    const { navigation } = props;
    return (
        <Text style={styles.textRegister}> ¿Aun no tienes una cuenta?
            <Text style={styles.btnRegister}
                onPress={() => navigation.navigate('Register')}
            >
                Registrarte
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: '100%',
        height: 150,
        marginTop: 20
    }, 
    viewContainer: {
        marginRight: 40,
        marginLeft: 40,    
    },
     divider: {
        backgroundColor: '#00a680',
        margin: 40,
        marginTop:20,
        marginBottom:20
    },
    textRegister: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        textAlign:'center'
    }, btnRegister: {
        color: '#00a680',
        fontWeight: 'bold'
    }
})