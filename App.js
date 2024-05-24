import React, { useEffect, useState } from 'react';
import { Image, Text, StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Button, Alert, FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import { BlurView } from 'expo-blur';
import { styles } from './styles';
import { Modal } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase-config';
import { getFirestore, query, where, getDocs,  doc, getDoc, collection, addDoc, serverTimestamp, deleteDoc, updateDoc} from 'firebase/firestore';
import db from './firebase-config';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from './screen/HomeScreen';
import OwnPublicationsScreen from './screen/OwnPublicationsScreen';
import LoginScreen from './screen/LoginScreen';


const Stack = createNativeStackNavigator();
// App -------------------------------------------------------------------------------------------------------------
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerTitle: 'MarketDICIS', headerLeft: () => (
            <Ionicons
              name="cart-outline"
              size={24}
              color="#FFFFFF"
              style={{ marginLeft: 10 }}
            />
          ), headerStyle: { backgroundColor: '#2D0C57' }, headerTitleStyle: { color: '#FFFFFF' } }} />
        <Stack.Screen name="OwnPublications" component={OwnPublicationsScreen} options={{headerTitle: 'MarketDICIS', headerStyle: { backgroundColor: '#2D0C57' }, headerTitleStyle: { color: '#FFFFFF' }}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
