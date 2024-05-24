import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
