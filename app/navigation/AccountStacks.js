import React, { useState } from 'react'
import { Button, Alert } from 'react-native'
import Modal from '../components/Modal'

import { createStackNavigator } from 'react-navigation-stack'
import MyAccountScreen from '../screens/Account/MyAccount'
import LoginScreen from '../screens/Account/Login'
import RegisterScreen from '../screens/Account/Register'

import * as firebase from 'firebase'


const AccountScreenStacks = createStackNavigator({
    MyAccount: {
        screen: MyAccountScreen,
        navigationOptions: (props) => ({

            title: 'Mi cuenta',
            headerRight: props.navigation.getParam('hola') === true && <Button title='Edit' color='#19b' onPress={() => console.log(props.navigation.getParam('hola'))} />,
            // headerLeft:<Button title='C' />,
            headerRightContainerStyle: {
                marginRight: 20
            },
            //headerTintColor:'#00a680',
            //headerBackground:
            headerStyle: {
                backgroundColor: '#19b000',
                flex: 1,
                //alignItems:'center',
                //justifyContent:'center',
                alignContent: 'center'
            },
            headerTitleStyle: {
                marginLeft: 140,
                color: '#fff'
            }
        })
    },
    Login: {
        screen: LoginScreen,
        navigationOptions: () => ({
            title: 'Login'
        })
    },
    Register: {
        screen: RegisterScreen,
        navigationOptions: () => ({
            title: 'Registro'
        })
    }
})
export default AccountScreenStacks;