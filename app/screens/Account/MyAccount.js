import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import * as firebase from 'firebase'

import Loading from '../../components/Loading'
import UserGuest from './UserGuest'
import UserLogged from './UserLogged'


export default function MyAccount(props) {

    const {navigation} = props
    

    const [login, setLogin] = useState(null);


    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            !user ? (setLogin(false),navigation.setParams({hola: false} )) : (setLogin(true), navigation.setParams({hola: true} ));
            
        })

    }, []);


    if (login === null) {
        return <Loading isvisible={true} text='Cargando...' />
    }
    return login ? <UserLogged /> : <UserGuest />;
}