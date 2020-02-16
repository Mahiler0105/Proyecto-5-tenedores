import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, FlatList } from 'react-native'
import { SearchBar, ListItem, Icon } from 'react-native-elements'

import { FireSQL } from 'firesql'
import firebase from 'firebase/app'


const fireSQL = new FireSQL(firebase.firestore(), { includeId: 'id' })

export default function Search(props) {

    const { navigation } = props
    const [restaurants, setRestaurants] = useState([])
    const [search, setSearch] = useState("")
    const [changeRestaurant , setChangeRestaurant] = useState(false)

    useEffect(() => {
       setChangeRestaurant(false)
        if (search) {
            fireSQL.query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
                .then(response => {
                    setRestaurants(response)
                    setChangeRestaurant(true)
                    console.log('que pedo',response)
                })
        }else{
            setRestaurants([])
        }
        console.log('DI ALGO:*',search,'*')
        console.log('CANTIDAD: ',restaurants.length)
    }, [search])
    
    return (
        <View>
            <SearchBar
                placeholder='Busca tu restaurante'
                onChangeText={e => setSearch(e)}
                value={search}
                containerStyle={styles.searchBar}
            />
            {restaurants.length === 0 ? (
                <NoFoundRestauranta/>
            ) : (

                    <FlatList
                        data={restaurants}
                        renderItem={restaurant => <Restaurant restaurant={restaurant}  navigation={navigation} changeRestaurant={changeRestaurant}/>}
                        keyExtractor={(item, index) => index.toString()}
                    />
                )}
        </View>
    )
}


function Restaurant(props) {
    const { restaurant, navigation , changeRestaurant } = props
    const {name , images} = restaurant.item
    const [imageRestaurant, setImageRestaurant] = useState(null)

    

    useEffect(()=>{
        const image = images[0]
        firebase.storage().ref(`restaurant-images/${image}`).getDownloadURL()
        .then((response)=>{
            setImageRestaurant(response)
            console.log('imagen',response)
        })
    },[changeRestaurant])

    return (
        <ListItem
            title={name}
            leftAvatar={{source:{uri: imageRestaurant}}}
            rightIcon={<Icon type='material-community' name='chevron-right' />}
            onPress={()=> navigation.navigate('Restaurant',{restaurant: restaurant.item} ) }
        />
    )

}

function NoFoundRestauranta () {
    return (
        <View style={{flex:1 , alignItems:'center'}}>
            <Image  
                source={require('../../assets/images/no-result-found.png')}
                resizeMode='cover'
                style={{width:200, height:200}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20
    }
})