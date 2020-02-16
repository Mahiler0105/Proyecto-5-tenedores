import React, {useState} from 'react'
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native'
import {Overlay} from 'react-native-elements'

export default function Loading (props){
    const {isvisible, text} = props ;
    return (
        <Overlay
            isVisible= {isvisible}
            windowBackgroundColor='rgba(0,0,0,.5)'
            overlayBackgroundColor='transparent'
            overlayStyle = {styles.overlay}
        >
            <View style= {styles.view}>
                <ActivityIndicator size='large' color='#00a680'/>
                   {text && <Text style={styles.text}>{text}</Text>}
            </View>

        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay:{
        height:100,
        width:200,
        backgroundColor: '#fff',
        borderColor:'#00a680',
        borderRadius:10,
        borderWidth:2
    },
    view:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    text:{
        color:'#00a680',
        textTransform:'uppercase',
        marginTop:10
    }
})