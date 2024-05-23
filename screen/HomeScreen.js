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

function HomeScreen({ route }) {
    const { userName } = route.params;
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [publications, setPublications] = useState([]);
    
    const [product, setProducto] = useState('');
    const [price, setPrecio] = useState('');
    const [description, setDescripcion] = useState('');
    const [category, setCategory] = useState('');
    const [availability, setAvailability] = useState('');
  
    useEffect(() => {
      const loadPublications = async () => {
        const db = getFirestore();
        const publicationsQuery = query(collection(db, 'Publicación'), where("userName", "!=", userName));
        const publicationsSnapshot = await getDocs(publicationsQuery);
        const fetchedPublications = [];
    
        for (const doc of publicationsSnapshot.docs) {
          const publicationData = doc.data();
          const userQuery = query(collection(db, 'Alumnos'), where('name', '==', publicationData.userName));
          const userSnapshot = await getDocs(userQuery);
          let division = "";
          userSnapshot.forEach(userDoc => {
            const userData = userDoc.data();
            division = userData.division;
          });
    
          fetchedPublications.push({ 
            id: doc.id, 
            ...publicationData,
            division: division,
          });
        }
        setPublications(fetchedPublications);
      };
      loadPublications();
    }, [userName]);
  
    const handleGuardarPublicacion = async () => {
      try {
        const currentDate = new Date();
        const timestamp = currentDate.toISOString();
        const db = getFirestore();
        const publicationRef = await addDoc(collection(db, 'Publicación'), {
          product,
          price,
          description,
          category,
          availability,
          userName,
          timestamp
        });
        console.log('Publication saved with ID: ', publicationRef.id);
        setModalVisible(false);
        loadPublications();
      } catch (error) {
        console.error('Error saving publication: ', error);
        Alert.alert('Error', 'Error saving publication.');
      }
    };
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    };
  
    const renderItem = ({ item }) => (
      <View style={styles.publicationContainer}>
        <Text style={styles.publicationHeader}>
          {item.userName} - {item.division} - {formatDate(item.timestamp)}
        </Text>
        <Text style={styles.publicationDetail}>Product: {item.product}</Text>
        <Text style={styles.publicationDetail}>Price: {item.price}</Text>
        <Text style={styles.publicationDetail}>Description: {item.description}</Text>
        <Text style={styles.publicationDetail}>Category: {item.category}</Text>
        <Text style={styles.publicationDetail}>Availability: {item.availability}</Text>
      </View>
    );
    return (
      <View style={styles.container}>
        <Text>{`Welcomez ${userName}!`}</Text>
        <TouchableOpacity
          style={styles.buttonNewP}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ fontSize: 17, fontWeight: '200', color: 'white' }}>New Publication</Text>
          <AntDesign name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        {/* Modal for Product Form */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.centeredView}
            keyboardVerticalOffset={60}
          >
            <View style={[styles.modalView, { flex: 1 }]}>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{ position: 'absolute', top: -6, right: 0, zIndex: 1 }}
                >
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text>{``}</Text>
                <TextInput
                  value={product}
                  onChangeText={setProducto}
                  placeholder="Product"
                  placeholderTextColor={'#9586A8'}
                  style={styles.input}
                />
                <TextInput
                  value={price}
                  onChangeText={setPrecio}
                  placeholder="Price"
                  placeholderTextColor={'#9586A8'}
                  style={styles.input}
                  keyboardType="numeric"
                />
                <TextInput
                  value={description}
                  onChangeText={setDescripcion}
                  placeholder="Description"
                  placeholderTextColor={'#9586A8'}
                  style={[styles.input, { height: 100 }]}
                  multiline
                />
                <TextInput
                  value={category}
                  onChangeText={setCategory}
                  placeholder="Category"
                  placeholderTextColor={'#9586A8'}
                  style={styles.input}
                />
                <TextInput
                  value={availability}
                  onChangeText={setAvailability}
                  placeholder="Product availability"
                  placeholderTextColor={'#9586A8'}
                  style={styles.input}
                />
                <TouchableOpacity onPress={handleGuardarPublicacion} style={[styles.button, { backgroundColor: '#2D0C57' }]}>
                  <Text style={{ fontSize: 17, fontWeight: '200', color: 'white' }}>SAVE</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
  
        {/* Publications List */}
        <Text style={styles.header}>Publications from other users:</Text>
        <FlatList
          data={publications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.publicationsList}
        />
  
        {/* Button for User Greeting */}
        <TouchableOpacity
          onPress={() => setUserModalVisible(true)}
          style={{ position: 'absolute', top: 10, right: 20 }}
        >
          <AntDesign name="user" size={24} color="#2D0C57" />
        </TouchableOpacity>
  
        {/* Modal for User Greeting */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={userModalVisible}
          onRequestClose={() => setUserModalVisible(false)}
        >
          <View style={[styles.modalView, styles.centeredView]}>
            <TouchableOpacity
              onPress={() => setUserModalVisible(false)}
              style={{ position: 'absolute', top: 25, right: 20, zIndex: 1 }}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: '400', marginBottom: 20 }}>{`Hola, ${userName}!`}</Text>
            <TouchableOpacity onPress={() => {
              setUserModalVisible(false);
              navigation.navigate('OwnPublications', { userName });
            }} style={[styles.button, { backgroundColor: '#2D0C57' }]}>
              <Text style={{ fontSize: 17, fontWeight: '200', color: 'white' }}>Own Publications</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

export default HomeScreen;
