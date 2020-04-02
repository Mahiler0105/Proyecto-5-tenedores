import React from 'react'
import {Button , View} from 'react-native'
import {createStackNavigator} from 'react-navigation-stack'


import FavoritesScreen from '../screens/Favorites'

const FavoritesScreenStacks = createStackNavigator({
    Favorites: {
        screen:FavoritesScreen,
        navigationOptions:(props)=>({
            title:'Restaurantes Favoritos',
            headerRight:<Button title='jose' onPress={()=> props.navigation.navigate('Favorites', {nuevo: props.navigation.getParam('contador')})}></Button>
            
        })
    }
})


export default FavoritesScreenStacks