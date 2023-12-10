import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {requestUserPermission} from '../utils/notificationsServices';
//   import messaging from '@react-native-firebase/messaging';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

let token = '';

const SignUp = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [namefocus, setNamefocus] = useState(false);
  const [emailfocus, setEmailfocus] = useState(false);
  const [phonefocus, setPhonefocus] = useState(false);
  const [passwordfocus, setPasswordfocus] = useState(false);

  useEffect(() => {
    requestUserPermission();
    getFcmToken();
  }, []);

  const getFcmToken = async () => {
    token = await AsyncStorage.getItem('fcmToken');
    console.log('Fcm Token', token);
  };

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

  const signUpActionFun = () => {
    if (name === '') {
      showError('Name is required.');
      return;
    }
    if (email === '') {
      showError('Email is required.');
      return;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      showError('Email must be a valid email');
      return;
    }
    if (phone === '') {
      showError('Phone number is required.');
      return;
    }
    if (!/^[1-9][0-9]{7,15}$/.test(phone)) {
      showError('Invalid phone number.');
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
    let userId=new Date().getTime().toString();
    firestore()
      .collection('Users').doc(userId)
      .set({
        name: name,
        email: email,
        phone: phone,
        password: password,
        token: token,
        // token: token,
        userId:userId,
        followers:[],
        following:[],
        posts:[],
        profilePic:'',
        bio:''
      })
      .then(() => {
        console.log('User added!');
      });
    firestore()
      .collection('Tokens')
      .add({
        token: token,
        // token: token,
      })
      .then(() => {
        setTimeout(() => {
          Snackbar.show({
            text: 'Sign Up successfully.',
            duration: 2000,
            backgroundColor: '#3adb76',
            action: {
              text: 'HIDE',
            },
          });
        }, 500);
        console.log('User added!');
        saveLocalData();
        navigation.navigate('Login');
      });
  };

  const saveLocalData = async () => {
    await AsyncStorage.setItem('Name', name);
    await AsyncStorage.setItem('Email', email);
  };

  // console.log('Token>>>>', token);
  return (
    <View style={{flex: 1}}>
      <Text style={styles.title}>Firebase</Text>
      <TextInput
        placeholder="Enter Name"
        value={name}
        onChangeText={txt => {
          setName(txt);
        }}
        onFocus={() => {
          setNamefocus(true);
          setEmailfocus(false);
          setPhonefocus(false);
          setPasswordfocus(false);
        }}
        style={[
          styles.inputview,
          {
            borderColor: namefocus === true ? 'orange' : 'gray',
          },
        ]}
      />
      <TextInput
        placeholder="Enter Email ID"
        value={email}
        onChangeText={txt => {
          setEmail(txt);
        }}
        onFocus={() => {
          setNamefocus(false);
          setEmailfocus(true);
          setPhonefocus(false);
          setPasswordfocus(false);
        }}
        style={[
          styles.inputview,
          {
            marginTop: 20,
            borderColor: emailfocus === true ? 'orange' : 'gray',
          },
        ]}
      />
      <TextInput
        placeholder="Enter Mobile Number"
        value={phone}
        onChangeText={txt => {
          setPhone(txt);
        }}
        onFocus={() => {
          setNamefocus(false);
          setEmailfocus(false);
          setPhonefocus(true);
          setPasswordfocus(false);
        }}
        style={[
          styles.inputview,
          {
            marginTop: 20,
            borderColor: phonefocus === true ? 'orange' : 'gray',
          },
        ]}
      />
      <TextInput
        placeholder="Enter Password"
        value={password}
        onChangeText={txt => {
          setPassword(txt);
        }}
        style={[
          styles.inputview,
          {
            marginTop: 20,
            borderColor: passwordfocus === true ? 'orange' : 'gray',
          },
        ]}
        onFocus={() => {
          setNamefocus(false);
          setEmailfocus(false);
          setPhonefocus(false);
          setPasswordfocus(true);
        }}
      />
      <TouchableOpacity
        style={styles.btncon}
        onPress={() => {
          signUpActionFun();
        }}>
        <Text
          style={{
            fontSize: 20,
            color: '#000',
          }}>
          Sign up
        </Text>
      </TouchableOpacity>
      <Text style={styles.Account} onPress={() => navigation.navigate('Login')}>
        Already have an Account
      </Text>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  inputview: {
    width: '84%',
    height: 50,
    paddingLeft: 15,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 60,
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
  title: {
    alignSelf: 'center',
    marginTop: 100,
    fontSize: 20,
    fontWeight: '800',
  },
  Account: {
    fontSize: 18,
    color: 'gray',
    alignSelf: 'center',
    textDecorationLine: 'underline',
    marginVertical: 30,
  },
});
