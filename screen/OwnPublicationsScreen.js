import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Alert, FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import { styles } from '../styles';
import { Modal } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { getFirestore, query, where, getDocs,  doc, collection, deleteDoc, updateDoc} from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

// OWN PUBLICATIONS SCREEN -------------------------------------------------------------------------------------------------------
function OwnPublicationsScreen({ route }) {
    const { userName } = route.params;
    const [publications, setPublications] = useState([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editedItem, setEditedItem] = useState(null);
    const [editedProduct, setEditedProduct] = useState('');
    const [editedPrice, setEditedPrice] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedCategory, setEditedCategory] = useState('');
    const [editedAvailability, setAvailability] = useState('');
    const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Furniture', 'Stationery'];
    const [selectedCategory, setSelectedCategory] = useState(''); 
  
    useEffect(() => {
      const loadPublications = async () => {
        const db = getFirestore();
        const q = query(collection(db, 'Publicación'), where("userName", "==", userName));
        const querySnapshot = await getDocs(q);
        const fetchedPublications = [];
        querySnapshot.forEach((doc) => {
          fetchedPublications.push({ id: doc.id, ...doc.data() });
        });
        setPublications(fetchedPublications);
      };
  
      loadPublications();
    }, [userName]);
  
    const handleEditPress = (item) => {
      setEditedItem(item);
      setEditedProduct(item.product);
      setEditedPrice(item.price);
      setEditedDescription(item.description);
      setEditedCategory(item.category);
      setSelectedCategory(item.category);
      setAvailability(item.availability)
      setEditModalVisible(true);
    };
  
    const handleEditConfirm = async () => {
      try {
        const db = getFirestore();
        const docRef = doc(db, 'Publicación', editedItem.id);
        await updateDoc(docRef, {
          product: editedProduct,
          price: editedPrice,
          description: editedDescription,
          category: selectedCategory,
          availability: editedAvailability
        });
        setEditModalVisible(false);
      } catch (error) {
        console.error('Error editing publication: ', error);
        Alert.alert('Error', 'Error editing publication.');
      }
    };
  
    const handleDeletePress = (item) => {
      setSelectedItem(item);
      setDeleteModalVisible(true);
    };
  
    const handleDeleteConfirm = async () => {
      try {
        const db = getFirestore();
        const docRef = doc(db, 'Publicación', selectedItem.id);
        await deleteDoc(docRef);
        setPublications(publications.filter(pub => pub.id !== selectedItem.id));
        setDeleteModalVisible(false);
      } catch (error) {
        console.error('Error deleting publication: ', error);
        Alert.alert('Error', 'Error deleting publication.');
      }
    };
  
    const renderItem = ({ item }) => (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.product}</Text>
        <Text style={styles.cell}>{item.price}</Text>
        <Text style={styles.cell}>{item.description}</Text>
        <Text style={styles.cell}>{item.category}</Text>
        <Text style={styles.cell}>{item.availability}</Text>
        <View style={styles.cell}>
          <TouchableOpacity onPress={() => handleEditPress(item)}>
            <Ionicons name="create-outline" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeletePress(item)}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  
    return (
      <View style={styles.containerTAB}>
        <Text>{`Welcome ${userName}, here are your publications:`}</Text>
        <ScrollView horizontal>
          <View style={styles.table}>
            <View style={styles.headerTAB}>
              <Text style={styles.headerCell}>Product</Text>
              <Text style={styles.headerCell}>Price</Text>
              <Text style={styles.headerCell}>Description</Text>
              <Text style={styles.headerCell}>Category</Text>
              <Text style={styles.headerCell}>Availability</Text>
              <Text style={styles.headerCell}>Actions</Text>
            </View>
            <FlatList
              data={publications}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        </ScrollView>
  
        {/* Delete Confirmation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={[styles.modalView, styles.centeredView]}>
            <TouchableOpacity
              onPress={() => setDeleteModalVisible(false)}
              style={{ position: 'absolute', top: 25, right: 20, zIndex: 1 }}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={{fontSize: 20, fontWeight: '400', marginBottom: 20}}>{`Are you sure you want to delete ${selectedItem?.product}?`}</Text>
            <TouchableOpacity onPress={handleDeleteConfirm} style={[styles.button, {backgroundColor: '#2D0C57'}]}>
              <Text style={{fontSize: 17, fontWeight: '200', color: 'white'}}>DELETE</Text>
            </TouchableOpacity>
          </View>
        </Modal>
  
        {/* Edition Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.centeredView}
            keyboardVerticalOffset={80}
          >
            <View style={[styles.modalView, {flex: 1}]}>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <TouchableOpacity
                  onPress={() => setEditModalVisible(false)}
                  style={{ position: 'absolute', top: -4, right: 0, zIndex: 1 }}
                >
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text></Text>
                <Text></Text>
                <TextInput
                  value={editedProduct}
                  onChangeText={setEditedProduct}
                  placeholder="Product"
                  placeholderTextColor={'#9586A8'}
                  style={styles.input}
                />
                <TextInput
                  value={editedPrice}
                  onChangeText={setEditedPrice}
                  placeholder="Price"
                  placeholderTextColor={'#9586A8'}
                  style={styles.input}
                  keyboardType="numeric"
                />
                <TextInput
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  placeholder="Description"
                  placeholderTextColor={'#9586A8'}
                  style={[styles.input, { height: 100 }]}
                  multiline
                />
                <View>
                  <Text>Select a category:</Text>
                  <Picker
                    selectedValue={selectedCategory}
                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                  >
                    {categories.map((category, index) => (
                      <Picker.Item key={index} label={category} value={category} />
                    ))}
                  </Picker>
                </View>
                <TextInput
                  value={editedAvailability}
                  onChangeText={setAvailability}
                  placeholder="Product availability"
                  placeholderTextColor={'#9586A8'}
                  style={styles.input}
                />
                <TouchableOpacity onPress={handleEditConfirm} style={[styles.button, {backgroundColor: '#2D0C57'}]}>
                  <Text style={{fontSize: 17, fontWeight: '200', color: 'white'}}>SAVE CHANGES</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  }

export default OwnPublicationsScreen;
