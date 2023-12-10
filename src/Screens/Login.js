import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {requestUserPermission} from '../utils/notificationsServices';
import messaging from '@react-native-firebase/messaging';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailfocus, setEmailfocus] = useState(false);
  const [passwordfocus, setPasswordfocus] = useState(false);

  const showError = message => {
    Snackbar.show({
      text: message,
      duration: 2000,
      backgroundColor: '#DF0000',
      numberOfLines: 4,
      action: {
        text: 'HIDE',
      },
    });
  };

  const checkLogin = () => {
    if (email === '') {
      showError('Email is required.');
      return;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      showError('Email must be a valid email');
      return;
    }
    if (password === '') {
      showError('Password is required.');
      return;
    }
    // eslint-disable-next-line prettier/prettier
    let regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/;
    if (!regex.test(password)) {
      showError(
        'Password at least 8 characters in length, Lowercase letters (a-z) Uppercase letters (A-Z), Numbers (0-9), Special characters ($@$!%*?&)',
      );
      return;
    }
    firestore()
      .collection('Users')
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        console.log('Snapshot>>>>>>>>', querySnapshot.docs);
        if (querySnapshot.docs.length > 0) {
          if (
            querySnapshot.docs[0]._data.email === email &&
            querySnapshot.docs[0]._data.password === password
          ) {
            // Alert.alert('Login Success', 'User loggeg in successfully');
            setTimeout(() => {
              Snackbar.show({
                text: 'Logged in successfully.',
                duration: 2000,
                backgroundColor: '#3adb76',
                action: {
                  text: 'HIDE',
                },
              });
            }, 500);
            goToHome(
              querySnapshot.docs[0]._data.userId,
              querySnapshot.docs[0]._data.name,
              querySnapshot.docs[0]._data.profilePic,
            );
          } else {
            Alert.alert('Login Error', 'Incorrect email or password');
          }
          console.log(
            querySnapshot.docs[0]._data.email +
              ' ' +
              querySnapshot.docs[0]._data.password,
          );
        } else {
          console.log('Account does not exist');
        }
      })
      .catch(err => {
        console.log('Error!!!!', err);
      });
  };

  const goToHome = async (userId, name,profileUrl) => {
    await AsyncStorage.setItem('USERID', userId);
    await AsyncStorage.setItem('NAME', name);
    await AsyncStorage.setItem('PROFILE_PIC', profileUrl);
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={{flex: 1}}>
      <Text style={styles.title}>Firebase</Text>
      <TextInput
        placeholder="Enter Email ID"
        value={email}
        onChangeText={txt => {
          setEmail(txt);
        }}
        onFocus={() => {
          setEmailfocus(true);
          setPasswordfocus(false);
        }}
        style={[
          styles.inputview,
          {
            borderColor: emailfocus === true ? 'orange' : 'gray',
          },
        ]}
      />
      <TextInput
        placeholder="Enter Password"
        value={password}
        onChangeText={txt => {
          setPassword(txt);
        }}
        onFocus={() => {
          setEmailfocus(false);
          setPasswordfocus(true);
        }}
        style={[
          styles.inputview,
          {
            marginTop: 20,
            borderColor: passwordfocus === true ? 'orange' : 'gray',
          },
        ]}
      />
      <TouchableOpacity
        style={styles.btncon}
        onPress={() => {
          checkLogin();
        }}>
        <Text
          style={{
            fontSize: 20,
            color: '#000',
          }}>
          Login
        </Text>
      </TouchableOpacity>
      <Text
        style={styles.Account}
        onPress={() => navigation.navigate('SignUp')}>
        Create New Account
      </Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    marginTop: 100,
    fontSize: 20,
    fontWeight: '800',
  },
  inputview: {
    width: '84%',
    height: 50,
    paddingLeft: 15,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 100,
  },
  btncon: {
    width: '84%',
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 30,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Account: {
    fontSize: 18,
    color: 'gray',
    alignSelf: 'center',
    textDecorationLine: 'underline',
    marginVertical: 30,
  },
});
