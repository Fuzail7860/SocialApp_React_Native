import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {IMAGES} from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

let userId = '';

const Home = () => {
  const [onLikeClick, setOnLikeClick] = useState(false);
  const [isFocused, setIsFocused] = useState();
  const [postsData, setPostsData] = useState([]);

  const navigation = useNavigation();
  useEffect(() => {
    getPostsData();
  });

  useEffect(() => {
    getUserId();
  }, [onLikeClick]);

  const getUserId = async () => {
    userId = await AsyncStorage.getItem('USERID');
    // console.log('Uid', userId);
    // console.log(JSON.stringify(postsData));
  };
  const getPostsData = () => {
    let tempData = [];
    firestore()
      .collection('Posts')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          tempData.push(documentSnapshot.data());
          // console.log("Image url".documentSnapshot.data().comments.profile);
        });
        
        setPostsData(tempData);
      });
    return () => subscriber();
  };
  const getLikeStatus = likes => {
    let status = false;
    likes.map(item => {
      if (item === userId) {
        status = true;
      } else {
        status = false;
      }
    });
    return status;
  };

  const onLike = item => {
    let tempLikes = item.likes;
    if (tempLikes.length > 0) {
      tempLikes.map(item1 => {
        if (item1 == userId) {
          let index = tempLikes.indexOf(item1);
          if (index > -1) {
            tempLikes.splice(index, 1);
          }
        } else {
          tempLikes.push(userId);
        }
      });
    } else {
      tempLikes.push(userId);
    }

    firestore()
      .collection('Posts')
      .doc(item.postId)
      .update({
        likes: tempLikes,
      })
      .then(() => {
        console.log('post updated');
      })
      .catch(err => {
        console.log('Error!!!!!!!', err);
      });
    setOnLikeClick(!onLikeClick);
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.headerview}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={IMAGES.leftIcon}
            style={{
              height: 20,
              width: 20,
              tintColor: '#000000',
              marginRight: 20,
            }}
          />
        </TouchableOpacity> */}

        <Text style={styles.headerText}>Home</Text>
      </View>
      {postsData.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={postsData}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: 20,
                  borderRadius: 20,
                  backgroundColor: '#fff',
                  elevation: 10,
                  marginBottom: postsData.length - 1 == index ? 85 : 0,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Image
                    source={IMAGES.userIcon}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      marginLeft: 15,
                    }}
                  />
                  <Text
                    style={{marginLeft: 15, fontSize: 18, fontWeight: '600'}}>
                    {item.name}
                    {/* {item.postId} */}
                  </Text>
                </View>
                <Text style={{marginTop: 10, marginLeft: 15, marginBottom: 10}}>
                  {item.caption}
                </Text>
                <Image
                  source={{uri: item.image}}
                  style={{
                    width: '90%',
                    height: 120,
                    borderRadius: 10,
                    marginBottom: 20,
                    alignSelf: 'center',
                  }}
                />
                <View style={styles.likecommentView}>
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => {
                      onLike(item);
                    }}>
                    <Text style={{marginRight: 10}}>{item.likes.length}</Text>
                    {getLikeStatus(item.likes) ? (
                      <Image
                        source={IMAGES.fillLove}
                        style={{width: 24, height: 24, tintColor: 'red'}}
                      />
                    ) : (
                      <Image
                        source={IMAGES.like}
                        style={{width: 24, height: 24}}
                      />
                    )}
                    {/* <Image
                      source={IMAGES.like}
                      style={{width: 24, height: 24}}
                    /> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => {
                      navigation.navigate('Comments', {postId: item.postId,comments:item.comments});
                      
                    }}>
                      {/* {console.log("item",item?.comments[0]?.profile)} */}
                    <Text style={{marginRight: 10}}>{item.comments.length}</Text>
                    <Image
                      source={IMAGES.comment}
                      style={{width: 24, height: 24}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No Posts Found</Text>
        </View>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  headerview: {
    width: '100%',
    height:60,
    // justifyContent:'center',
    alignItems: 'center',
    paddingLeft: 30,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '700',
  },
  likecommentView: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
