import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

export default function Menu({navigation}) {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        const userUid = user.uid;
        const userRef = firestore().collection('users').doc(userUid);

        const unsubscribeSnapshot = userRef.onSnapshot(
          doc => {
            if (doc.exists) {
              const data = doc.data();
              setUserData(data);
              // console.log('Data from Firestore:', data);
            } else {
              console.log('No such document!');
            }
          },
          error => {
            console.log('Error fetching document:', error);
          },
        );

        return () => {
          unsubscribe();
          unsubscribeSnapshot();
        };
      }
    });
  }, []);

  const handleSignOut = async () => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await auth().signOut();
        await AsyncStorage.removeItem('userToken');
        console.log('User signed out!');
        navigation.navigate('Login');
      } else {
        console.log('No user is currently signed in.');
      }
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{backgroundColor: 'white'}}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `${userData.image}`,
          }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.textNama}>{userData.nama}</Text>
        <Text style={styles.textRole}>{userData.role}</Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileBox}>
          <Text style={styles.profileTitle}>Profile</Text>
          <Text style={styles.textTitleProfile}>NIM</Text>
          <Text style={styles.textContent}>{userData.nim}</Text>
          <Text style={styles.textTitleProfile}>Jurusan</Text>
          <Text style={styles.textContent}>{userData.jurusan}</Text>
          <Text style={styles.textTitleProfile}>Email</Text>
          <Text style={styles.textContent}>{userData.email}</Text>
          <Text style={styles.textTitleProfile}>Nomor HP</Text>
          <Text style={styles.textContent}>{userData.nomorHP}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              // onPress={}
              style={[styles.buttonContainer]}>
              <Text style={styles.buttonText}>Ubah Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSignOut}
              style={[styles.buttonLogoutContainer]}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 300,
    backgroundColor: '#7895CB',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 175,
    height: 175,
    borderRadius: 100,
  },
  textNama: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    padding: 5,
  },
  textRole: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: '#CFF5E7',
    padding: 5,
    marginTop: 10,
    borderRadius: 5,
    width: 150,
    textAlign: 'center',
    marginBottom: 30,
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 150,
  },
  profileBox: {
    width: 375,
    height: 375,
    backgroundColor: 'white',
    marginTop: -25,
    borderRadius: 7,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  profileTitle: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  textTitleProfile: {
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  textContent: {
    paddingHorizontal: 10,
    color: 'black',
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    margin: 25,
    // alignSelf: 'center',
    backgroundColor: '#7895CB',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonLogoutContainer: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    margin: 25,
    // alignSelf: 'center',
    backgroundColor: '#BB2525',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
