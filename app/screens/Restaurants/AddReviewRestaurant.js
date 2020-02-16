import React, {useState , useRef} from 'react'
import {StyleSheet , View } from 'react-native'
import {AirbnbRating , Button , Input} from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import  Loading from '../../components/Loading'


import  {firebaseApp} from '../../utils/FireBase'
import firebase from 'firebase/app'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp)

export default function AddReviewRestaurant (props){
    const {navigation } = props
    const {idRestaurant , setReviewReload} = navigation.state.params

    const [rating , setRating] = useState(null) 
    const [title, setTitle] = useState("")
    const [review , setReview] = useState("")
    const [isVisible , setIsVisible] = useState(false) 
    
    const toastRef = useRef()
    
    const addReview = () =>{
        if(rating === null){
            toastRef.current.show('No has dado ninguna puntuación')
        }else if (!title){
            toastRef.current.show('El titulo es obligatorio')
        }else if (!review) {
            toastRef.current.show('El comentario es obligatorio')
        }else{
            setIsVisible(true)
            const user = firebase.auth().currentUser
            // console.log(user)
            
            const payload = {
                idUser:user.uid,
                avatarUser:user.photoURL,
                idRestaurant: idRestaurant,
                title: title,
                review:review,
                rating:rating,
                createAt: new Date()
            }

            db.collection('reviews').add(payload).then(()=>{
               updateRestaurant()
            
            }).catch(()=>{
                toastRef.current.show('Error al enviar la review')
                setIsVisible(false)
            })
            
        }
    }

    const updateRestaurant = () =>{
        const restaurantRef  = db.collection('restaurants').doc(idRestaurant)
        restaurantRef.get().then(response => {
            console.log('jojojojoj', response)
            const restaurantData = response.data()
            const ratingTotal = restaurantData.ratingTotal + rating
            const quantityVote = restaurantData.quantityVote + 1
            const ratingResult = ratingTotal / quantityVote
            
            console.log(ratingTotal , quantityVote , ratingResult)
            
            restaurantRef.update(
                {rating: ratingResult ,
                ratingTotal , 
                quantityVote}
            ).then(()=>{
                setIsVisible(false)
                setReviewReload(true)
                navigation.goBack()
            })
        })
        
    }
    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                 <AirbnbRating
                    count={5}
                    reviews={['Pésimo','Deficiente' ,'Normal' ,'Muy Bueno', 'Excelente']}
                    defaultRating={0}
                    size={35}
                    onFinishRating={value => setRating(value)}
                 />
            </View>
            <View style={styles.formReview}>
                <Input
                    placeholder='Titulo'
                    containerStyle={styles.input}
                    onChange={(e)=> setTitle(e.nativeEvent.text)}
                />
                 <Input
                    placeholder='Comentario...'
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    containerStyle={styles.input}
                    onChange={(e)=> setReview(e.nativeEvent.text)}
                />
                <Button
                    title='Enviar Comentario'
                    onPress= {addReview}
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                />
                <Toast 
                    ref={toastRef}
                    position='center'
                    opacity={0.5}
                />
                <Loading isvisible={isVisible} text='Enviando comentario' />
            </View>
            
        </View>
    ) 

}

const styles = StyleSheet.create({
    viewBody:{
        flex:1
    }, 
    viewRating:{
        height:110,
        backgroundColor:'#f2f2f2'
    },
    formReview:{
        margin:10,
        marginTop:40,
        flex:1,
        alignItems:'center'
    },
    input:{
        marginBottom:10
    },
    textArea:{
        height: 150,
        width: '100%',
        padding:0,
        margin:0
    },
    btnContainer:{
        flex:1 , 
        justifyContent:'flex-end',
        marginTop:20,
        marginBottom:10,
        width:'95%',
        
    }
    ,btn:{
        backgroundColor:'#00a680'
    }
})