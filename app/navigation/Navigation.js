import React from 'react'
import {Icon, Badge, withBadge} from 'react-native-elements'
import {createAppContainer} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs'

import RestaurantsScreenStacks from './RestaurantsStacks'
import TopListScreenStacks from './TopListStack'
import SearchScreenStacks from './SearchStacks'
import AccountScreenStacks from './AccountStacks'
import FavoritesScreenStacks from './FavoritesStacks'


const NavigationStacks = createMaterialBottomTabNavigator({
    Restaurants:{
        screen: RestaurantsScreenStacks,
        navigationOptions: () => ({
            tabBarLabel: 'Restaurantes',
            tabBarIcon:({tintColor}) => (
                <Icon
                    type='material-community'
                    name="compass-outline"
                    size={25}
                    color = {tintColor}
                    
                />
            )
        })
    },
    Favorites:{
        screen:FavoritesScreenStacks,
        navigationOptions:()=>({
            tabBarLabel:'Favoritos',
            tabBarIcon:({tintColor}) => (
                <Icon
                    type='material-community'
                    name='heart-outline'
                    size={25}
                    color ={tintColor}
                />
            )
        })
    },
    TopLists:{
        screen: TopListScreenStacks,
        navigationOptions:() => ({
            tabBarLabel:'Ranking',
            tabBarIcon:({tintColor}) => (
                <Icon
                    type='material-community'
                    name="star-outline"
                    size={25}
                    color = {tintColor}
                />
            )
        })
    },
    Search:{
        screen: SearchScreenStacks,
        navigationOptions:() => ({
            tabBarLabel:'Buscar',
            tabBarIcon:({tintColor}) => (
                <Icon
                    type='material-community'
                    name="magnify"
                    size={25}
                    color = {tintColor}
                />
            )
        })
    },
    Account:{
        screen: AccountScreenStacks,
        navigationOptions:() => ({
            tabBarLabel:'Cuenta',
            tabBarIcon:({tintColor}) => (
                <Icon
                    type='material-community'
                    name="home-outline"
                    size={25}
                    color = {tintColor}
                />
            ),
        })
    }

},
{
    initialRouteName:'Restaurants',
    order:['Restaurants','Favorites', 'TopLists','Search','Account'],
    activeColor:'#f2f2f2',
    barStyle:{backgroundColor:'#00a680'},
}


);

export default createAppContainer(NavigationStacks);

