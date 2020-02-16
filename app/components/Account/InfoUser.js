import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Avatar } from 'react-native-elements'
import * as firebase from 'firebase'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

export default function InfoUser(props) {

    const {
        userInfo,
        userInfo: { uid, displayName, email, photoURL, providerId },
        setReloadData,
        toastRef,
        setTextLoading,
        setIsLoading
    } = props
    const changeAvatar = async () => {
        if (providerId === 'facebook.com') {
            toastRef.current.show('No se puede cambiar avatar')
        } else {
            const resultPermision = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            const resultPermissionCamera = resultPermision.permissions.cameraRoll.status;
            if (resultPermissionCamera === 'denied') {
                toastRef.current.show('Es necesario aceptar los permisos de la galeria')
            } else {
                const result = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    aspect: [4, 3]
                })
                if (result.cancelled) {
                    toastRef.current.show('Has cerrado la galeria sin seleccionar una imagen')
                } else {
                    uploadImage(result.uri, uid).then(() => {
                        updatePhotoUrl(uid);
                    })
                }
            }

            console.log(resultPermissionCamera)

        }
    }
    const uploadImage = async (uri, nameImage) => {
        setTextLoading('actualizando Avatar')
        setIsLoading(true)
        const response = await fetch(uri)
        const blob = await response.blob()
        const ref = firebase.storage().ref().child(`avatar/${nameImage}`);
        return ref.put(blob);

    }

    const updatePhotoUrl = uid => {
        firebase.storage().ref(`avatar/${uid}`)
            .getDownloadURL()
            .then(async result => {
                const update = {
                    photoURL: result
                }
                jose = await firebase.auth().currentUser.updateProfile(update);
                setReloadData(true)
                setIsLoading(false)
            }).catch(() => {
                toastRef.current.show('Error al recuperar avatar del servidor')
            })
    }
    return (
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size='large'
                showEditButton
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
                source={{ uri: photoURL ? photoURL : 'https://api.adorable.io/avatars/116/abott@adorable.png' }}
            />
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : 'Anónimo'}
                </Text>
                <Text>
                    {email ? email : 'Social Login'}
                </Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        marginRight: 30
    }, displayName: {
        fontWeight: 'bold'
    }
})