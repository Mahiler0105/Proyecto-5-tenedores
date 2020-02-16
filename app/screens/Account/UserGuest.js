import React, { useEffect } from 'react'
import { StyleSheet, View, ScrollView, Text, Image, StatusBar, Platform } from 'react-native'
import { Button } from 'react-native-elements'
import { withNavigation } from 'react-navigation'
import Constants from 'expo-constants'

function UserGuest(props) {
    const { navigation } = props;

    return (

        <ScrollView style={styles.viewBody} centerContent={true}>
            <Image
                source={require("../../../assets/images/user-guest.jpg")}
                style={styles.image}
                resizeMode='contain'
            />
            <Text style={styles.title}>
                Consulta tu perfil de 5 tenedores
            </Text>
            <Text style={styles.description}>
                ¿Como describirias tu mejor restaurante? Busca y visualiza los mejores
                restaurantes de una forma sencilla, vota cual te ha gustado mas y comenta
                como a sido tu experiencia
            </Text>
            <View style={styles.viewbtn}>
                <Button
                    buttonStyle={styles.btnStyles}
                    containerStyle={styles.btnContainer}
                    title='Ver tu perfil'

                    onPress={() => navigation.navigate("Login")}
                />
            </View>
        </ScrollView>
        
    )
}
export default withNavigation(UserGuest);

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30,
        
    }, image: {
        height: 300,
        width: '100%',
        marginBottom: 40,
    }, title: {
        fontWeight: 'bold',
        fontSize: 19,
        marginBottom: 16,
        textAlign: 'center'
    }, description: {
        textAlign: 'center',
        marginBottom: 20
    }, viewbtn: {
        flex: 1,
        alignItems: 'center'
    }, btnStyles: {
        backgroundColor: '#00a680'
    }, btnContainer: {
        width: '70%'
    }
})