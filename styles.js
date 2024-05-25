import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    login: {
      width: 350,
      height: 500,
      borderColor: '#fff',
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderColor: '#fff',
      borderWidth: 1,
      marginVertical: 30,
    },
    input: {
      width: 250,
      height: 40,
      borderColor: '#fff',
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
      backgroundColor: '#ffffff90',
      marginBottom: 20
    },
    button: {
      width: 250,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      borderColor: '#fff',
      borderWidth: 1,
    },
    Text:{
      fontSize: 19, 
      fontWeight: '400', 
      color:'#2D0C57',
      fontWeight: 'bold'
    },
    modalView: {
      margin: 20,
      backgroundColor: '#F6F5F5',
      borderColor: '#9586A8',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 10,
      borderWidth: 2,
      borderColor: '#2D0C57',
      maxHeight: '65%',
      marginTop: '40%'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonNewP:{
      marginTop:25,
      width: 150,
      height: 50,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      borderColor: '#fff',
      borderWidth: 1,
      backgroundColor: '#918D96'
    },
    containerTAB: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    table: {
      marginTop: 20,
    },
    headerTAB: {
      flexDirection: 'row',
      backgroundColor: '#f1f1f1',
      paddingVertical: 10,
      paddingHorizontal: 5,
    },
    headerCell: {
      width: 120, 
      fontWeight: 'bold',
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingVertical: 10,
      paddingHorizontal: 5,
    },
    cell: {
      width: 120, 
      textAlign: 'center',
    },
    publicationContainer: {
      backgroundColor: '#EDEDED',
      padding: 10,
      marginBottom: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    publicationHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    publicationDetail: {
      fontSize: 15,
      marginBottom: 5,
    },
    publicationsList: {
      paddingHorizontal: 10,
    },
    inputSelect: {
      width: '98%',
      padding: 0,
      marginVertical: 4,
      borderColor: '#9586A8',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: '#ffffff90',
      borderColor: '#fff',
      borderWidth: 1,
      color: '#9586A8'
    },
    inputbarra: {
      width: 270,
      height: 40,
      borderColor: '#fff',
      borderWidth: 2,
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
      backgroundColor: '#ffffff90',
      marginRight: 60

    },
  });