import React, {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {Input, Icon, Button} from 'react-native-elements'
import { hide } from 'expo/build/launch/SplashScreen'
import {validateEmail} from '../../utils/Validation'

import {withNavigation} from 'react-navigation'

import * as firebase from 'firebase'

import Loading from '../Loading'


function RegisterForm(props){
    const {toastRef, navigation} = props;
    const [hidePassword, setHidePassword] = useState(true)
    const [hidePasswordSecond, setHidePasswordSecond] = useState(true)
    const [isVisibleLoading, setIsVisibleLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordSecond, setPasswordSecond] = useState("")
    
    const register =  async () =>{
        setIsVisibleLoading(true)
        if (!email || !password || !passwordSecond){
            toastRef.current.show('Todos los campos son obligatorios')
        }else {
            if (!validateEmail(email)) {
                toastRef.current.show('El email no es correcto')
            }else{
                if(password !== passwordSecond){
                       toastRef.current.show('Las contraseñas no son iguales')
                }else{
                    await firebase.
                    auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(()=>{
                         navigation.navigate('MyAccount')
                    }).catch((err)=>{
                        console.log(err)
                        // toastRef.current.show( JSON.parse(err))
                    })  
                }
            }
        } 
        setIsVisibleLoading(false)  
    }
    return (
        <View style={styles.formContainer} behavior='padding' enabled>
            <Input 
                placeholder='Correo electronico'
                containerStyle={styles.inputForm}
                onChange={ e => setEmail(e.nativeEvent.text)}
                rightIcon={
                    <Icon
                        type='material-community'
                        name='at'
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder='Contraseña'
                password={true}
                secureTextEntry={hidePassword}
                containerStyle={styles.inputForm}
                onChange={e => setPassword(e.nativeEvent.text)}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setHidePassword(!hidePassword)}
                    />
                }
            
            />
             <Input
                placeholder='Repetir Contraseña'
                password={true}
                secureTextEntry={hidePasswordSecond}
                containerStyle={styles.inputForm}
                onChange={e => setPasswordSecond(e.nativeEvent.text)}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={hidePasswordSecond ? 'eye-outline' : 'eye-off-outline'}
                        iconStyle={styles.iconRight}
                        onPress={()=> setHidePasswordSecond(!hidePasswordSecond)}
                    />
                }
            
            />
            <Button
                title='Unirse'
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={register}
            />
            <Loading
                text='Creando cuenta'
                isvisible={isVisibleLoading}
            />
        </View>
    )
}

export default withNavigation(RegisterForm);

const styles = StyleSheet.create ({
    formContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginTop:30
    },
    iconRight:{
        color:'#c1c1c1'
    },
    inputForm:{
        width:'100%',
        marginTop:20
    },
    btnContainerRegister:{
        marginTop:20,
        width:'95%'
    },btnRegister:{
        backgroundColor:'#00a680'
    }
}) 