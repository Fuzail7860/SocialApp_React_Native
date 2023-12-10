import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {IMAGES} from '../styles';
import Home from '../tabs/Home';
import Search from '../tabs/Search';
import Add from '../tabs/Add';
import Chat from '../tabs/Chat';
import Profile from '../tabs/Profile';

const HomeScreen = ({navigation}) => {
  const [imagedata, setImagedata] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  // const openCamera = async () => {
  //   const result = await launchCamera({mediaType: 'photo'});
  //   console.log('result>>>>>>>>', result);
  //   setImagedata(result);
  // };

 

  // const openGallery = () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 400,
  //     cropping: true,
  //   }).then(image => {
  //     console.log('Gallery>>>>>>>', image);
  //   });
  // };

  // const UploadImage = async () => {
  //   const reference = storage().ref(imagedata.assets[0].fileName);
  //   const pathToFile = imagedata.assets[0].uri;
  //   // uploads file
  //   await reference.putFile(pathToFile);
  //   console.log('file uploaded');
  //   const url = await storage()
  //     .ref(imagedata.assets[0].fileName)
  //     .getDownloadURL();
  //   // console.log("Image url>>>>>>>>",url);
  // };

  return (
    <View style={{flex: 1,}}>
      {/* {imagedata!==null?(
          <Image source={{uri:imagedata.assets[0].uri}}
           style={{
            height:100,
            width:100,
            borderRadius:50,
            marginBottom:30
           }}
          />
         ):null}
      <TouchableOpacity onPress={() => openCamera()}>
        <Text>Open Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => UploadImage()} style={{marginTop: 30}}>
        <Text>UploadImage</Text>
      </TouchableOpacity> */}
      {selectedTab == 0 ? (
        <Home />
      ) : selectedTab == 1 ? (
        <Search />
      ) : selectedTab == 2 ? (
        <Add />
      ) : selectedTab == 3 ? (
        <Chat />
      ) : (
        <Profile />
      )}
      <View style={styles.tabConatiner}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            setSelectedTab(0);
          }}>
             <View style={{
            backgroundColor:selectedTab == 0 ? '#fff' : '#FFCD05',
            borderRadius:10,
            padding:8
          }}>
          <Image
            source={IMAGES.home}
            style={{
              height: 24,
              width: 24,
              tintColor: selectedTab == 0 ? '#FFCD05' : 'black',
            }}
            resizeMode="contain"
          /></View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            setSelectedTab(1);
          }}>
             <View style={{
            backgroundColor:selectedTab == 1 ? '#fff' : '#FFCD05',
            borderRadius:10,
            padding:8
          }}>
          <Image
            source={IMAGES.search}
            style={{
              height: 24,
              width: 24,
              tintColor: selectedTab == 1 ? '#FFCD05' : 'black',
            }}
            resizeMode="contain"
          /></View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            setSelectedTab(2);
          }}>
            <View style={{
            backgroundColor:selectedTab == 2 ? '#fff' : '#FFCD05',
            borderRadius:10,
            padding:8
          }}>
          <Image
            source={IMAGES.add}
            style={{
              height: 24,
              width: 24,
              tintColor: selectedTab == 2 ? '#FFCD05' : 'black',
            }}
            resizeMode="contain"
          /></View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            setSelectedTab(3);
          }}>
            <View style={{
            backgroundColor:selectedTab == 3 ? '#fff' : '#FFCD05',
            borderRadius:10,
            padding:8
          }}>
          <Image
            source={IMAGES.message}
            style={{
              height: 24,
              width: 24,
              tintColor: selectedTab == 3 ? '#FFCD05' : 'black',
            }}
            resizeMode="contain"
          /></View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            setSelectedTab(4);
          }}>
          <View style={{
            backgroundColor:selectedTab == 4 ? '#fff' : '#FFCD05',
            borderRadius:10,
            padding:8
          }}>
          <Image
            source={IMAGES.profile}
            style={{
              height: 24,
              width: 24,
              tintColor: selectedTab == 4 ? '#FFCD05' : 'black',
            }}
            resizeMode="contain"
          /></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  tabConatiner: {
    position: 'absolute',
    bottom: 10,
    height: 60,
    width: '95%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFCD05',
    alignSelf: 'center',
    elevation: 30,
    borderRadius: 20,
  },
  iconContainer: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
