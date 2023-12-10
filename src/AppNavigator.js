import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from './Screens/Splash';
import Login from './Screens/Login';
import SignUp from './Screens/SignUp';
import HomeScreen from './Screens/HomeScreen';
import Comments from './Screens/Comments';
const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={props => <Splash {...props} />}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={props => <Login {...props} />}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={props => <SignUp {...props} />}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeScreen"
          component={props => <HomeScreen {...props} />}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Comments"
          component={props => <Comments {...props} />}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
