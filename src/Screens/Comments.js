import {StyleSheet, Text, View, TextInput, FlatList, Image,TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {IMAGES} from '../styles';

let userId = '';
let postId = '';
let comments = [];
let name = '';
let profile = ';';
const Comments = () => {
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const inputRef = useRef();
  const route = useRoute();

  const navigation= useNavigation();

  useEffect(() => {
    getUserId();
    comments = route.params.comments;
    postId = route.params.postId;
    setCommentList(comments);
  }, []);
  // console.log("comments",comments);
  const getUserId = async () => {
    userId = await AsyncStorage.getItem('USERID');
    name = await AsyncStorage.getItem('NAME');
    profile = await AsyncStorage.getItem('PROFILE_PIC');
    // console.log("userId",userId);
    // console.log("name",userId);
    // console.log("profile",profile);
  };
  const postComment = () => {
    let tempComments = comments;
    tempComments.push({
      userId: userId,
      comment: comment,
      postId: postId,
      name: name,
      profile: profile,
    });
    firestore()
      .collection('Posts')
      .doc(postId)
      .update({
        comments: tempComments,
      })
      .then(() => {
        console.log('post updated');
        getNewComments();
      })
      .catch(err => {
        console.log('Error!!!!!!!', err);
      });
    inputRef.current.clear();
  };

  const getNewComments=async()=>{
    firestore()
      .collection('Posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        setCommentList(documentSnapshot.data().comments)
      })
      .catch(err => {
        console.log('Error!!!!!!!', err);
      });
  }
  return (
    <View style={{flex: 1}}>
      <View style={styles.headerView}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={IMAGES.leftIcon}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Comments</Text>
      </View>
    
      <FlatList
        showsVerticalScrollIndicator={false}
        data={commentList}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                width: '65%',
                minHeight:70,
                flexDirection: 'row',
                marginTop: 10,
                backgroundColor:'#fff',
                borderRadius:10,
                paddingTop:10,
                // alignItems:'center',
                elevation:20,
                marginLeft:15
              }}>
              {item.profile==''?(<Image
                source={IMAGES.userIcon}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  marginLeft: 15,
                  gap: 20,
                }}
              />):(<Image
                source={{uri:item.profile}}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  marginLeft: 15,
                  gap: 20,
                }}
              />)}
              <View style={{width:190,paddingBottom:15}}>
              <Text style={{marginLeft: 15, fontSize: 16,fontWeight:'700',color:'#000000'}}>{item.name}</Text>
              <Text style={{marginLeft: 15, fontSize: 15,color:'#000000'}}>{item.comment}</Text>
              </View>
              
            </View>
          );
        }}
      />
      <View style={styles.inputView}>
        <TextInput
          ref={inputRef}
          value={comment}
          placeholder="Tyoe comment here..."
          style={{marginLeft: 20, width: '80%'}}
          onChangeText={txt => setComment(txt)}
        />
        <Text
          style={styles.inputText}
          onPress={() => {
            postComment();
          }}>
          Send
        </Text>
      </View>
    </View>
  );
};

export default Comments;

const styles = StyleSheet.create({
  headerView: {
    width: '100%',
    height: 60,
    // justifyContent:'center',
    alignItems: 'center',
    paddingLeft: 30,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#8e8e8e',
  },
  headerIcon:{
    height: 20,
    width: 20,
    tintColor: '#000000',
    marginRight: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  inputView: {
    width: '100%',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  inputText: {
    marginRight: 20,
    fontSize: 18,
    fontWeight: '600',
    color: 'blue',
  },
});
