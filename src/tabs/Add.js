import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {IMAGES} from '../styles';
import firestore from '@react-native-firebase/firestore';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import Snackbar from 'react-native-snackbar';
import {requestUserPermission} from '../utils/notificationsServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';


let token = '';
let name = '';
let email = '';
let profile = ''

const Add = () => {
  const [imagedata, setImagedata] = useState(null);
  const [caption, setCaption] = useState(null);
  
  const navigation = useNavigation();
  useEffect(() => {
    requestUserPermission();
    getFcmToken();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setImagedata(null);
      setCaption('');
    }, []),
  );

  const getFcmToken = async () => {
    token = await AsyncStorage.getItem('fcmToken');
    name = await AsyncStorage.getItem('Name');
    email = await AsyncStorage.getItem('Email');
    // console.log('Fcm Token', token);
    console.log('name:' + name + 'email:', email);
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

  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo'});
    // console.log('result>>>>>>>>', result);
    setImagedata(result);
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    console.log('result>>>>>>>>', result);
    setImagedata(result);
  };

  const UploadImage = async () => {
    if (imagedata === null) {
      showError('Please select image.');
      return;
    }
    if (caption === '') {
      showError('Please enter caption.');
      return;
    }
    let postId = new Date().getTime().toString();
    const reference = storage().ref(imagedata.assets[0].fileName);
    const pathToFile = imagedata.assets[0].uri;
    const userId= await AsyncStorage.getItem('USERID')
    // uploads file
    await reference.putFile(pathToFile);
    console.log('file uploaded');
    // Alert.alert("Image Uploaded successfully")
    const url = await storage()
      .ref(imagedata.assets[0].fileName)
      .getDownloadURL();
    // console.log('Image url>>>>>>>>', url);
    // console.log('name123:' + name + 'email123:', email);
    firestore()
      .collection('Posts').doc(postId)
      .set({
        image: url,
        caption: caption,
        name: name,
        email: email,
        userId:userId,
        postId:postId,
        likes:[],
        comments:[],
        // profilePic:profile
      })
      .then(() => {
        setTimeout(() => {
          Snackbar.show({
            text: 'Image uploaded successfully.',
            duration: 2000,
            backgroundColor: '#3adb76',
            action: {
              text: 'HIDE',
            },
          });
        }, 500);
        console.log('posts added!');
        getAllTokens();
        navigation.navigate('HomeScreen');
      });
  };

  const getAllTokens = () => {
    let tempTokens = [];
    firestore()
      .collection('Tokens')
      .get()
      .then(querySnapshot => {
        // console.log('Total posts: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          // tempTokens.push(documentSnapshot.data().token);
          // console.log(
          //   'Tokens: ',
          //   // documentSnapshot.id,
          //   documentSnapshot.data().token,
          // );
          sendNotification(documentSnapshot.data().token);
        });
        // setPostsData(tempData);
        sendNotification(tempTokens);
        console.log('tokens', tempTokens);
      });
  };

  const sendNotification = async token => {
    // var axios = require('axios');
    var data = JSON.stringify({
      data: {},
      notification: {
        body: 'click to open check Post',
        title: 'New Post Added',
      },
      to: token,
    });
    var config = {
      method: 'post',
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        Authorization:
          'key=AAAAxAAEr00:APA91bE9viZCTWchL-ucXaSfWkYPZUUWC5OZ2tG5hHW6qq8xPJnONnTIU0hy_IuKT-PNBt1g3pEgGEEcfMN9wowtaf9-ZzSGanowobsNrR2BuG3yVc7hhI7cgIHyWNq5YBCzp-nnuty3',
        'Content-Type': 'application/json',
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  console.log('name123:' + name + 'email123:', email);
  return (
    <View style={{flex: 1}}>
      <View style={styles.headerView}>
        <Text style={[styles.headerText, {marginLeft: 20, color: '#000'}]}>
          Post
        </Text>
        <Text
          style={[
            styles.headerText,
            {
              marginRight: 20,
              color: imagedata !== null && caption !== '' ? 'blue' : '#8e8e8e',
            },
          ]}
          onPress={() => {
            UploadImage();
          }}>
          Upload
        </Text>
      </View>
      <View style={styles.postView}>
        {imagedata !== null ? (
          <Image
            source={{uri: imagedata.assets[0].uri}}
            style={{width: 50, height: 50, borderRadius: 10}}
          />
        ) : (
          <Image
            source={IMAGES.placeImg}
            style={{width: 50, height: 50, borderRadius: 10}}
          />
        )}
        <TextInput
          placeholder="Type Caption Here..."
          style={{width: '70%'}}
          value={caption}
          onChangeText={txt => {
            setCaption(txt);
          }}
        />
      </View>
      <TouchableOpacity style={styles.camerabtn} onPress={() => openCamera()}>
        <Image source={IMAGES.camera1} style={styles.cameraIcon} />
        <Text style={styles.labelText}>Open Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.camerabtn} onPress={() => openGallery()}>
        <Image source={IMAGES.gallery} style={styles.cameraIcon} />
        <Text style={styles.labelText}>Open Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  headerView: {
    width: '100%',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    // elevation:20,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '8e8e8e',
  },
  headerText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: '500',
  },
  postView: {
    width: '90%',
    height: 150,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    borderColorL: '8e8e8e',
    borderWidth: 0.2,
    borderRadius: 10,
    backgroundColor: '#fff',
    // elevation:10,
    padding: 20,
  },
  camerabtn: {
    width: '100%',
    height: 50,
    borderBottomWidth: 0.2,
    borderBottomColor: '#8e8e8e',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  cameraIcon: {
    width: 24,
    height: 24,
    marginLeft: 20,
  },
  labelText: {
    marginLeft: 20,
  },
});
