import React, { useEffect, useState } from 'react';
import { Image, Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Button, Alert, FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import { BlurView } from 'expo-blur';
import { styles } from '../styles';
import { Modal } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config';
import { getFirestore, query, where, getDocs,  doc, getDoc, collection, addDoc, serverTimestamp, deleteDoc, updateDoc} from 'firebase/firestore';
import db from '../firebase-config';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const uri = 'https://i.pinimg.com/originals/8e/77/1a/8e771af40d04dc1577d89ab7d79bccb3.jpg'
const profilePicture = 'https://img.freepik.com/foto-gratis/mujer-joven-morena-posando_144627-35783.jpg'

// LOGIN AND REGISTER -------------------------------------------------------------------------------------------------------------
function LoginScreen(){
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const navigation = useNavigation();
  
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app); 
    // Create account 
    const handleCreateAccount = async () => {
      if (!email.endsWith('@ugto.mx')) {
        Alert.alert('Registration not allowed', 'Only emails from "@ugto.mx" are allowed.');
        return;
      }
      try {
        const alumnoRef = doc(db, 'Alumnos', email);
        const alumnoDoc = await getDoc(alumnoRef);
    
        if (alumnoDoc.exists()) {
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              console.log('Account created!!')
              Alert.alert('account successfully created')
              const user = userCredential.user;
              console.log(user)
            })
            .catch(error => {
              console.log(error)
              Alert.alert(error.message)
            });
        } else {
          Alert.alert('Mail not allowed', 'This email is not authorized for registration.');
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Ocurrió un error al verificar el correo.');
      }
    }
    // Signin account
    const handleSignIn = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Signed in!');
        const user = userCredential.user;
        console.log(user);
  
        const alumnoRef = doc(db, 'Alumnos', email);
        const alumnoDoc = await getDoc(alumnoRef);
        
        if (alumnoDoc.exists()) {
          const userData = alumnoDoc.data();
          const { name } = userData;
          navigation.navigate('Home', { userName: name });
        } else {
          Alert.alert('User not found', 'User data not available.');
        }
      } catch (error) { 
        console.log(error);
        Alert.alert('Credentials error', 'Check your data!');
      }
    };
  
    return (
      <View style={styles.container}>
        <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]}/>
        <ScrollView contentContainerStyle={{
          flex: 1,
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <BlurView intensity={100} >
            <View style={styles.login}>
              <Image source={{uri:profilePicture}} style={styles.profilePicture}/>
              <View>
                <Text style={styles.Text}>E-mail</Text>
                <TextInput onChangeText={(text) => setEmail(text)} style={styles.input} placeholder='Enter your Email' placeholderTextColor={'#9586A8'}></TextInput>
              </View>
              <View>
                <Text style={styles.Text}>Password</Text>
                <TextInput onChangeText={(text) => setPassword(text)} style={styles.input} placeholder='Enter your password' placeholderTextColor={'#9586A8'} secureTextEntry={true}></TextInput>
              </View>
              <TouchableOpacity onPress={handleSignIn} style={[styles.button, {backgroundColor: '#2D0C57'}]}>
                <Text style={{fontSize: 17, fontWeight: '400', color: 'white'}}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreateAccount}  style={[styles.button, {backgroundColor: '#fff'}]}>
                <Text style={{fontSize: 17, fontWeight: '400', color: '#2D0C57'}}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </ScrollView>
      </View>
    );
  }


export default LoginScreen;
