import React, { useEffect, useState } from 'react';
import { Image, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../styles';
import { Modal } from 'react-native';
import { AntDesign} from '@expo/vector-icons';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, query, where, getDocs, collection, addDoc} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

function HomeScreen({ route }) {
  const { userName } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [publications, setPublications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');

  const [product, setProducto] = useState('');
  const [price, setPrecio] = useState('');
  const [description, setDescripcion] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('');

  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Furniture','Stationery'];

  const loadPublications = async () => {
    const db = getFirestore();
    let publicationsQuery = query(collection(db, 'Publicacion'), where("userName", "!=", userName));
  
    if (selectedCategory) {
      publicationsQuery = query(publicationsQuery, where("category", "==", selectedCategory));
    }

    const publicationsSnapshot = await getDocs(publicationsQuery);
    let fetchedPublications = publicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
    if (searchText) {
      fetchedPublications = fetchedPublications.filter(publication => 
        publication.product.toLowerCase().includes(searchText.toLowerCase()) || 
        publication.userName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    for (const publication of fetchedPublications) {
      const userQuery = query(collection(db, 'Alumnos'), where('name', '==', publication.userName));
      const userSnapshot = await getDocs(userQuery);
      userSnapshot.forEach(userDoc => {
        const userData = userDoc.data();
        publication.division = userData.division;
      });
    }
    
    setPublications(fetchedPublications);
  };
  
  useEffect(() => {
    loadPublications();
  }, [userName, selectedCategory, searchText]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (result && !result.cancelled && result.assets.length > 0) {
      console.log("Image URI:", result.assets[0].uri);
      setImageUri(result.assets[0].uri);
    } else {
      console.log("Image selection cancelled or failed.");
    }
  };

  const handleGuardarPublicacion = async () => {
    setUploading(true);
    try {
      const currentDate = new Date();
      const timestamp = currentDate.toISOString();
      const db = getFirestore();
      
      let imageUrl = '';
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const storageRef = ref(getStorage(), `images/${Date.now()}_${userName}`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }
  
      const publicationRef = await addDoc(collection(db, 'Publicacion'), {
        product,
        price,
        description,
        category,
        availability,
        userName,
        imageUrl, // agega url la imagen a los datos de la publicación
        timestamp
      });
  
      console.log('Publication saved with ID: ', publicationRef.id);
      setModalVisible(false);
      setImageUri(null);
      setUploading(false);
      loadPublications();
    } catch (error) {
      console.error('Error saving publication: ', error);
      Alert.alert('Error', 'Error saving publication.');
      setUploading(false);
    }
  };
     
  const handleOpenModal = () => {
    setProducto('');
    setPrecio('');
    setDescripcion('');
    setCategory('');
    setAvailability('');
    setImageUri(null);
    setModalVisible(true);
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
      <Text style={styles.publicationDetail}>{item.product}</Text>
      <Text style={styles.publicationDetail}>${item.price}</Text>
      <Text style={styles.publicationDetail}>Description: {item.description}</Text>
      <Text style={styles.publicationDetail}>Category: {item.category}</Text>
      <Text style={styles.publicationDetail}>Availability: {item.availability}</Text>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={{ width: 300, height: 300, borderRadius:10}} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        placeholder="Search by user or product"
        placeholderTextColor={'#9586A8'}
        style={styles.inputbarra}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>

        <TouchableOpacity style={styles.buttonNewP} onPress={handleOpenModal}>
          <Text style={{ fontSize: 17, fontWeight: '200', color: 'white' }}>New Publication</Text>
          <AntDesign name="plus" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.buttonNewP}>
          <Picker
            selectedValue={selectedCategory}
            style={{ height: 50, width: 100, color: 'white' }}
            onValueChange={(itemValue) => {
              setSelectedCategory(itemValue);
              loadPublications();
            }}
          >
            <Picker.Item label="All" value="" />
            {categories.map((category, index) => (
              <Picker.Item key={index} label={category} value={category} />
            ))}
          </Picker>
        </View>
      </View>

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
              <View style={styles.inputSelect}>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                >
                  {categories.map((category, index) => (
                    <Picker.Item key={index} label={category} value={category} />
                  ))}
                </Picker>
              </View>
              <TextInput
                value={availability}
                onChangeText={setAvailability}
                placeholder="Product availability"
                placeholderTextColor={'#9586A8'}
                style={styles.input}
              />
              <TouchableOpacity onPress={pickImage} style={[styles.button, { backgroundColor: '#2D0C57' }]}>
                <Text style={{ fontSize: 17, fontWeight: '200', color: 'white' }}>Select Image</Text>
              </TouchableOpacity>
              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: 100, height: 100, marginTop: 10 }}
                />
              )}
              <TouchableOpacity onPress={handleGuardarPublicacion} style={[styles.button, { backgroundColor: '#2D0C57' }]}>
                {uploading ? (
                  <Text style={{ fontSize: 17, fontWeight: '200', color: 'white' }}>Uploading...</Text>
                ) : (
                  <Text style={{ fontSize: 17, fontWeight: '200', color: 'white' }}>SAVE</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Publications List */}
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