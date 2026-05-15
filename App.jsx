import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import AccountScreen from './src/screens/AccountScreen';
import FightCase from './src/screens/FightCase';
import GameScreen from './src/screens/GameScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';
import CrosswordScreen from './src/screens/CrosswordScreen';
import CommunityHub from './src/screens/CommunityHub';
import FightForRights from './src/screens/FightForRights';
import VerdictPredictor from './src/screens/VerdictPredictor';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          // Smooth transitions across all screens
          contentStyle: { backgroundColor: '#0d0d2b' },
        }}
        initialRouteName="HOME"
      >
        <Stack.Screen name="HOME" component={HomeScreen} />
        <Stack.Screen name="LOGIN" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Fight" component={FightCase} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="Crossword" component={CrosswordScreen} />
        <Stack.Screen name="CommunityHub" component={CommunityHub} />
        <Stack.Screen name="FightForRights" component={FightForRights} />
        <Stack.Screen name="VerdictPredictor" component={VerdictPredictor} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
