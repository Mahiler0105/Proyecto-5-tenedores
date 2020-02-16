import React , {useState} from 'react'
import {View , Text , StyleSheet} from 'react-native'

import {Input, Button}from 'react-native-elements'
import * as firebase from 'firebase'
import {reauthenticate} from '../../utils/Api'


export default function ChangeEmailForm (props) {
    const {email , setIsVisibleModal, setReloadData, toastRef} = props
    
    const [newEmail , setNewEmail] = useState("")
    const [isLoading , setIsLoading] = useState(false)
    const [error , setError] = useState({})
    const [hidePassword ,setHidePassword] = useState(true)
    const [password, setPassword] = useState("")

    const updateEmail= () =>{
        setError({})
        if(!newEmail || email == newEmail){
            setError({email:'El email no puede ser igual o estar vacio'})
        }else{
            setIsLoading(true)
            reauthenticate(password)
            .then(()=>{
                firebase.auth().currentUser.updateEmail(newEmail).then(()=>{
                    setIsLoading(false)
                    setReloadData(true)
                    toastRef.current.show('Email actualizado correctamente')
                    setIsVisibleModal(false)
                }).catch(()=>{
                    setError({email:'Error al actualizar el email'})
                    setIsLoading(false)
                })
            }).catch(()=>{
                setError({password:'La contraseña no es correcta'})
                setIsLoading(false)
            })

        }

    }
    return (
        <View style={styles.view}>
            <Input
                placeholder='Email'
                rightIcon={{
                    type:'material-community',
                    name:'at',
                    color:'#c2c2c2'
                }}
                errorMessage={error.email}
                containerStyle={styles.inputContainer}
                onChange={(e)=>setNewEmail(e.nativeEvent.text)}
                defaultValue={email && email}
            />
             <Input
                placeholder='Contraseña'
                rightIcon={{
                    type:'material-community',
                    name: hidePassword ? 'eye-outline' : 'eye-off-outline',
                    color:'#c2c2c2',
                    onPress: ()=> setHidePassword(!hidePassword)
                }}
                errorMessage={error.password}
                containerStyle={styles.inputContainer}
                onChange={(e)=>setPassword(e.nativeEvent.text)}
                password={true}
                secureTextEntry={hidePassword}
                
            />

            <Button
                title='Cambiar email'
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={updateEmail}
                loading={isLoading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view:{
        alignItems:'center',
        paddingTop:10,
        paddingBottom:10
    },
    inputContainer:{
        marginBottom:10,
    },
    btn:{
        backgroundColor:'#00a680'
    },
    btnContainer:{
        marginTop:20,
        width:'95%'
    }

})