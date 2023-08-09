import {View, Text, Button, StyleSheet, Image, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth'; // Import Firebase auth
import {useNavigation} from '@react-navigation/native'; // Jika Anda menggunakan @react-navigation
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

export default function Menu() {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        const userUid = user.uid;
        const userRef = firestore().collection('users').doc(userUid);

        const unsubscribeSnapshot = userRef.onSnapshot(
          doc => {
            if (doc.exists) {
              const userData = doc.data();
              const nama = userData.nama;
              const role = userData.role;
              setUserName(nama);
              setUserRole(role);
            } else {
              console.log('No such document!');
            }
          },
          error => {
            console.log('Error fetching document:', error);
          },
        );

        return () => {
          unsubscribeSnapshot(); // Unsubscribe saat komponen unmount
        };
      } else {
        // User is logged out, handle accordingly
        setUserName('');
        setUserRole('');
      }
    });

    return () => {
      unsubscribe(); // Unsubscribe saat komponen unmount
    };
  }, []);
  const navigation = useNavigation();
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
    <ScrollView>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://cdn06.pramborsfm.com/storage/app/media/Prambors/Editorial/zayn%20malik-20211103185111.jpg?tr=w-800',
          }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.textNama}>{userName}</Text>
        <Text style={styles.textRole}>{userRole}</Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileBox}>
          <View style={styles.profileContent}>
            <Text style={styles.profileTitle}>Profile</Text>
          </View>
        </View>
      </View>
      <Button title="Logout" onPress={handleSignOut} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 300,
    backgroundColor: '#133B5C',
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
    backgroundColor: '#FCDAB7',
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
});
