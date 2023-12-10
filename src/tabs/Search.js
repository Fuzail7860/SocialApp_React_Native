import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {IMAGES} from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

let userId = '';
const Search = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [onFollowClick, setOnFollowClick] = useState(false);
  const [usersList, setUserList] = useState([]);
  useEffect(() => {
    getUsers();
  }, [onFollowClick]);

  const getUsers = async () => {
    let tempUsers = [];
    userId = await AsyncStorage.getItem('USERID');
    firestore()
      .collection('Users')
      // Filter results
      // .where('userId', '!=', userId)
      .get()
      .then(querySnapshot => {
        querySnapshot._docs.map(item => {
          if (item._data.userId !== userId) {
            tempUsers.push(item);
          }
        });
        setUserList(tempUsers);
        // console.log("users----->",querySnapshot._docs);
      });
  };

  // console.log("state data======>",usersList);
  const getFollowStatus = followers => {
    let status = false;
    followers.map(item => {
      if (item == userId) {
        status = true;
      } else {
        status = false;
      }
    });
    return status;
  };
  const followUser = async item => {
    let tempFollowers = item._data.followers;
    let following = [];
    let name = '';
    let profilePic = '';

    firestore()
      .collection('Users')
      .doc(userId)
      .get()
      .then(snapshot => {
        // console.log('snapshot>>>>>>>', snapshot);
        following = snapshot.data().following;
        name = snapshot.data().name;
        profilePic = snapshot.data().profilePic;
        if (following.length > 0) {
          following.map(item2 => {
            if (item2.userId == item._data.userId) {
              let index2 = -1;
              following.map((x, i) => {
                if (x.userId == item._data.userId) {
                  index2 = i;
                }
              });
              if (index2 > -1) {
                following.splice(index2, 1);
              } else {
                following.push({
                  name: item._data.name,
                  userId: item._data.userId,
                  profilePic: item._data.profilePic,
                });
              }
            } else {
              following.push({
                name: item._data.name,
                userId: item._data.userId,
                profilePic: item._data.profilePic,
              });
            }
          });
        } else {
          following.push({
            name: item._data.name,
            userId: item._data.userId,
            profilePic: item._data.profilePic,
          });
        }
      });
    // console.log(following);
    if (tempFollowers.length > 0) {
      tempFollowers.map(item1 => {
        if (item1.userId == userId) {
          let index = -1;
          tempFollowers.map((x, i) => {
            if (x.userId == userId) {
              index = i;
            }
          });
          if (index > -1) {
            tempFollowers.splice(index, 1);
          }
        } else {
          tempFollowers.push({
            name: name,
            userId: userId,
            profilePic: profilePic,
          });
        }
      });
    } else {
      tempFollowers.push({
        name: name,
        userId: userId,
        profilePic: profilePic,
      });
    }
    firestore()
      .collection('Users')
      .doc(item._data.userId)
      .update({
        followers: tempFollowers,
      })
      .then(res => {})
      .catch(err => {
        console.log('Error!!!', err);
      });
    firestore()
      .collection('Users')
      .doc(userId)
      .update({
        following: following,
      })
      .then(res => {
        console.log('Done');
      })
      .catch(err => {
        console.log('Error!!!', err);
      });
    // console.log('after following user id', item._data.userId);
    setOnFollowClick(!onFollowClick);
    getUsers();
  };

  return (
    <View style={{flex: 1}}>
      {showSearch == true ? (
        <View style={styles.searchView}>
          <View style={styles.searchInnerView}>
            <TouchableOpacity
              onPress={() => setShowSearch(!showSearch)}
              style={{alignSelf: 'center'}}>
              <Image source={IMAGES.leftIcon} style={styles.arrowIcon} />
            </TouchableOpacity>
            <TextInput
              placeHolder={'Search Name'}
              placeholderTextColor={'#000000'}
              style={styles.inputView}
              onChangeText={e => {
                setSearchValue(e);
              }}
            />
            <TouchableOpacity style={{justifyContent: 'center'}}>
              <Image source={IMAGES.search} style={styles.searchIcon} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.headerView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.headerText}>Search</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
              <Image
                source={IMAGES.search}
                style={{height: 20, width: 20, tintColor: '#000000', top: 1}}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        showsVerticalScrollIndicator={false}
        data={usersList}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                width: '90%',
                minHeight: 70,
                flexDirection: 'row',
                marginTop: 10,
                backgroundColor: '#fff',
                borderRadius: 10,
                // paddingTop: 10,
                alignItems: 'center',
                elevation: 20,
                alignSelf: 'center',
              }}>
              {item._data.profilePic == '' ? (
                <Image
                  source={IMAGES.userIcon}
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    marginLeft: 15,
                    gap: 20,
                  }}
                />
              ) : (
                <Image
                  source={{uri: item._data.profilePic}}
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    marginLeft: 15,
                    gap: 20,
                  }}
                />
              )}
              <View style={{width: 190, paddingBottom: 15}}>
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#000000',
                  }}>
                  {item._data.name}
                </Text>
                {/* <Text style={{marginLeft: 15, fontSize: 15, color: '#000000'}}>
                  {item._data.email}
                </Text> */}
              </View>
              <TouchableOpacity
                onPress={() => {
                  followUser(item);
                }}>
                <View
                  style={{
                    alignSelf: 'flex-end',
                    marginBottom: 20,
                    marginLeft: 15,
                    padding: 5,
                    backgroundColor: '#0362fc',
                    borderRadius: 5,
                    marginTop: 20,
                  }}>
                  <Text
                    style={{color: '#fff', marginLeft: 10, marginRight: 10}}>
                    {getFollowStatus(item._data.followers)
                      ? 'Unfollow'
                      : 'Follow'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  headerView: {
    width: '100%',
    height: 60,
    paddingRight: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginTop: Platform.OS == 'ios' ? 60 : 0,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    paddingLeft: 30,
  },
  headerText2: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    marginRight: 15,
  },
  searchView: {
    width: '100%',
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
    paddingTop: 5,
  },
  searchInnerView: {
    flexDirection: 'row',
  },
  inputView: {
    width: '100%',
    borderRadius: 18,
    alignSelf: 'center',
  },
  arrowIcon: {
    height: 20,
    width: 20,
    alignSelf: 'center',
    tintColor: '#000000',
  },
  searchIcon: {
    height: 20,
    width: 20,
    right: 20,
    tintColor: '#000000',
    alignSelf: 'center',
    position: 'absolute',
  },
});
