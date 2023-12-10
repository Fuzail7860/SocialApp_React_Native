import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

// Fcm Token--------------->
 export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      try {
        const fcmToken = await messaging().getToken();
        console.log('fcmTokenNew------->>>>>>>>>>>',fcmToken);
        if (fcmToken) {
          AsyncStorage.setItem('fcmToken', fcmToken);
        }
      } catch (error) {
        console.log('error rasied in fcmToken--------->', error);
      }
    }
  }