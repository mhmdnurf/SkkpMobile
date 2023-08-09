import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import DataPendaftar from '../components/DataPendaftar';
import Pengumuman from '../components/Pengumuman';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import auth from '@react-native-firebase/auth'; // Import Firebase Auth

export default function Home() {
  const [userName, setUserName] = useState('');

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
              setUserName(nama);
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
      }
    });

    return () => {
      unsubscribe(); // Unsubscribe saat komponen unmount
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pendaftarContainer}>
        <View>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          <Text style={styles.userTitle}>Welcome Back, {userName}</Text>
        </View>
        <DataPendaftar />
      </View>
      <Pengumuman />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#CFF5E7'},
  pendaftarContainer: {
    backgroundColor: '#59C1BD',
    paddingBottom: 50,
    borderBottomLeftRadius: 60,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  dashboardTitle: {
    padding: 16,
    marginTop: 16,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userTitle: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
