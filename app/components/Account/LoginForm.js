import React, {useState} from 'react'

import {StyleSheet, View} from 'react-native'
import {Input, Icon, Button} from 'react-native-elements'

import {validateEmail} from '../../utils/Validation'
import {withNavigation} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import * as firebase from 'firebase'
import Loading from '../Loading'

function LoginForm (props) {
    
    
    const {toastRef,navigation} = props;
    const [hidenpassword , setHidenPassword] = useState(true) 
    
    const [email, setEmail] = useState("") 
    const [password , setPassword] = useState("") 
    const [isVisibleLoadign, setIsVisibleLoading] = useState(false)
   
    const login = async () =>{
        setIsVisibleLoading(true)
        if (!email || !password){
            toastRef.current.show('Todos los campos son obligatorios')
        }else {
            if(!validateEmail(email)){
                toastRef.current.show('Correo no valido')
            }else{
                await firebase.auth().signInWithEmailAndPassword(email, password)
                .then(()=>{
                    navigation.navigate('MyAccount');
                }).catch((err)=>{
                    toastRef.current.show( "Correo o contraseña invalidos")
                })
            }
        }
        
        setIsVisibleLoading(false)
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder = 'Correo electronico'
                containerStyle={styles.inputForm}
                onChange={(e) => setEmail(e.nativeEvent.text)}
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
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={hidenpassword}
                onChange={(e) => setPassword(e.nativeEvent.text)}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={ hidenpassword ? 'eye-outline':'eye-off-outline'}
                        iconStyle={styles.iconRight}
                        onPress={()=> setHidenPassword(!hidenpassword)}
                    />
                }
            />
            <Button 
            title='Iniciar sesión'
            containerStyle={styles.btnContainerLogin}
            buttonStyle={styles.btnLogin}
            onPress={login}
            />
            <Loading isvisible={isVisibleLoadign} text='Iniciando sesión'/>
        </View>
    )
}

export default withNavigation(LoginForm);

const styles = StyleSheet.create({
    formContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
    },
    inputForm:{
        width:'100%',
        marginTop:20
    },iconRight:{
        color:'#c1c1c1'
    },btnContainerLogin:{
        width:'95%',
        marginTop:20
    },btnLogin:{
        backgroundColor:'#00a680'
    }
})