import { StyleSheet, Text, View ,Image,TouchableOpacity,Modal,TouchableWithoutFeedback,SafeAreaView,Alert} from 'react-native'
import React ,{useEffect, useState}from 'react'
import { IMAGES } from '../styles';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';

const Profile = () => {
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [imagedata, setImagedata] = useState(null);
  const [imagePicked, setImagePicked] = useState(false);
  const [uploadedPicUrl, setUploadedPicUrl] = useState('');


  const showError = message => {
    Snackbar.show({
      text: message,
      duration:2000,
      backgroundColor: '#DF0000',
      numberOfLines: 4,
      action: {
        text: 'HIDE',
      },
    });
  };

  useEffect(()=>{
    getProfileData();
  },[uploadedPicUrl])

  const getProfileData=async()=>{
    const userId=await AsyncStorage.getItem('USERID');
    firestore()
  .collection('Users')
  .doc(userId)
  .get()
  .then(documentSnapshot => {
    console.log('User exists: ', documentSnapshot.exists);

    if (documentSnapshot.exists) {
      console.log('User data: ', documentSnapshot.data());
      setUploadedPicUrl(documentSnapshot.data().profilePic)
    }
  });
  }
  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo'});
    // console.log('result>>>>>>>>', result);
    setImagedata(result);
    setImagePicked(true);
    setPickerModalVisible(!pickerModalVisible)
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    console.log('result>>>>>>>>', result);
    setImagedata(result);
    setImagePicked(true);
    setPickerModalVisible(!pickerModalVisible)
  };
  const uploadProfileImage = async ()=>{
    const userId = await AsyncStorage.getItem('USERID');
    const reference = storage().ref(imagedata.assets[0].fileName);
    const pathToFile = imagedata.assets[0].uri;
    await reference.putFile(pathToFile);
    const url = await storage()
    .ref(imagedata.assets[0].fileName)
    .getDownloadURL();
    firestore()
      .collection('Users').doc(userId)
      .update({
        profilePic:url,
      })
      .then(() => {
        setTimeout(() => {
          Snackbar.show({
            text: 'Image updated successfully.',
            duration: 2000,
            backgroundColor: '#3adb76',
            action: {
              text: 'HIDE',
            },
          });
        }, 500);
        console.log('image updated');
        setImagePicked(false)
      });
  }
// console.log("uploaded pic url",uploadedPicUrl);
  return (
    <View style={{flex:1}}>
      <View style={styles.headerview}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={IMAGES.leftIcon}
            style={styles.headerIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerText}>Profile</Text>
      </View>
       
      <View style={styles.profileView}>


        {imagedata ===null&&imagePicked==false&&uploadedPicUrl==''?(<Image
            source={IMAGES.userIcon}
            style={{width: 100, height: 100, borderRadius: 50}}
          />):imagePicked===true&&imagedata!==null?(<Image
            source={{uri: imagedata.assets[0].uri}}
            style={{width: 100, height: 100, borderRadius: 50}}
          />):(<Image
            source={{uri:uploadedPicUrl}}
            style={{width: 100, height: 100, borderRadius: 50}}
          />)}

      {/* {imagedata !== null ? (
          <Image
            source={{uri: imagedata.assets[0].uri}}
            style={{width: 100, height: 100, borderRadius: 50}}
          />
        ) : (
          <Image
            source={IMAGES.userIcon}
            style={{width: 100, height: 100, borderRadius: 50}}
          />
        )} */}
            <TouchableOpacity
              onPress={() => setPickerModalVisible(!pickerModalVisible)}
              style={styles.cameraCss}>
              <Image source={IMAGES.camera} style={{ height: 14, width: 16 }} />
            </TouchableOpacity>
          </View>
      

        <TouchableOpacity onPress={()=>{
          uploadProfileImage();
        }} style={styles.editBtn}>
          
          {imagePicked===true?(<Text style={styles.btnText}>Save Image</Text>):(<Text style={styles.btnText}>Edit Profile</Text>)}
        </TouchableOpacity>
        <Modal
            // animationType="slide"
            transparent={true}
            visible={pickerModalVisible}>
            <SafeAreaView style={styles.flexOneSafe}>
              <View style={styles.flexOne}>
                <TouchableWithoutFeedback
                  onPress={() => setPickerModalVisible(!pickerModalVisible)}>
                  <View style={styles.flexOne} />
                </TouchableWithoutFeedback>

                <View style={styles.mainView}>
                  <View style={styles.viewContainer}>
                    <View style={styles.textViewImagePicker}>
                      <TouchableOpacity
                        onPress={() => {
                          if (imagePicked===false) {
                             openCamera();
                             setImagePicked(true)
                          }
                          else{
                            showError('Image already picked please save image')
                          }
                          
                        }}
                        style={styles.imagePickerViewText}
                        activeOpacity={0.5}>
                        <Text style={styles.pickerTextCamera}>From Camera</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                         
                          if (imagePicked===false) {
                            openGallery();
                            setImagePicked(true)
                          }
                         else{ 
                           showError('Image already picked please save image')
                         }
                        }}
                        style={styles.imagePickerViewTextGallery}
                        activeOpacity={0.5}>
                        <Text style={styles.pickerTextCamera}>
                          From Gallery
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    activeOpacity={0.8}
                    onPress={() => setPickerModalVisible(!pickerModalVisible)}>
                    <Text style={styles.pickerCamera}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </Modal>
    </View>
  )
}

export default Profile;

const styles = StyleSheet.create({
  headerview: {
    width: '100%',
    height:60,
    // justifyContent:'center',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '700',
  },
  headerIcon:{
    height: 20,
    width: 20,
    tintColor: '#000000',
    marginRight: 20,
  },
  profileView:{
    width:100,
    height:100,
    alignSelf:'center',
    marginTop:50,
    justifyContent:'center',
    alignItems:'center'
  },
  profilePic:{
    height:100,
    width:100,
    borderRadius:50
  },
  editBtn:{
    width:200,
    height:40,
    borderWidth:0.2,
    alignSelf:'center',
    marginTop:20,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:8,
    borderColor:'#FFCD05'
  },
  btnText:{
    fontSize: 17,
    color: '#FFCD05',
    fontWeight: '600',
  },
  cameraCss: {
    width: 35,
    height: 35,
    position: 'absolute',
    zIndex: 999,
    backgroundColor: '#FFCD05',
    borderRadius: 18,
    alignSelf: 'flex-end',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
  },

  // -------> Modal CSS START <--------
  flexOneSafe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flexOne: {
    flex: 1,
  },
  mainView: {
    maxHeight: 160,
    borderRadius: 10,
    marginBottom: 100,
    marginHorizontal: 20,
    zIndex: 999,
  },
  viewContainer: {
    borderRadius: 10,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  textViewImagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 21,
    width: '100%',
  },
  imagePickerViewText: {
    borderBottomWidth: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderColor: 'lightgrey',
  },
  imagePickerViewTextGallery: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderColor: 'lightgrey',
  },
  // pickerTextCamera: {
  //   textAlignVertical: 'center',
  //   fontSize: 16,
  // },
  pickerTextCamera: {
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: '800',
  },
  pickerCamera: {
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#000',
    fontWeight: '800',
  },
  cancelButton: {
    marginVertical: 10,
    backgroundColor: 'lightgrey',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  //------> Modal CSS END <---------
})