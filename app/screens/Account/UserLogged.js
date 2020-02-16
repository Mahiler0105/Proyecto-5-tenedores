import React, {useState , useEffect, useRef}from 'react'
import {View, Text, StyleSheet}from 'react-native'
import {Button} from 'react-native-elements'
import Toast from 'react-native-easy-toast'

import * as firebase from 'firebase'

import InfoUser from '../../components/Account/InfoUser'
import Loading from '../../components/Loading'
import AccountOptions from '../../components/Account/AccountOptions'

export default function UserLogged (){
    const [userInfo, setUserInfo] = useState({})
    const [reloadData , setReloadData] = useState(false)
    const [isLoading , setIsLoading] = useState(false)
    const [textLoading, setTextLoading] = useState("")
    const toastRef = useRef();
    
    useEffect(()=>{
        (async()=>{
            const user = await firebase.auth().currentUser
            setUserInfo(user.providerData[0]);
        })();
        setReloadData(false)
    },[reloadData]) 
    
    return (
        <View style={styles.viewUserInfo}>
            <InfoUser userInfo={userInfo} 
            setReloadData={setReloadData} 
            toastRef={toastRef}
            setIsLoading={setIsLoading}
            setTextLoading={setTextLoading}
            />
            <AccountOptions  toastRef={toastRef} userInfo={userInfo} setReloadData={setReloadData}/>
            <Button
                title='Cerrar sesión'
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionText}
                onPress={()=> firebase.auth().signOut()}

            ></Button>
            <Toast 
                ref={toastRef} 
                style={{backgroundColor:'#ffc107'}}
                textStyle={{color:'black'}}
                position='center' opacity={0.8}
                   
            />
            <Loading text={textLoading} isvisible={isLoading} />
        </View>
    ) 
}

const styles = StyleSheet.create({
    viewUserInfo:{
        minHeight:'100%',
        backgroundColor:'#f2f2f2'
    },
    btnCloseSession:{
        marginTop:30,
        borderRadius:0,
        backgroundColor:'#fff',
        borderTopWidth:1,
        borderTopColor:'#e3e3e3',
        borderBottomWidth:1,
        borderBottomColor:'#e3e3e3',
        paddingTop:10,
        paddingBottom:10   
    },
    btnCloseSessionText:{
        color:'#00a680'
    }
})