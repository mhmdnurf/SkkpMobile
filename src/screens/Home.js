import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DataPendaftar from '../components/DataPendaftar';
import Pengumuman from '../components/Pengumuman';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign';

export default function Home({navigation}) {
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

  const handlePengajuan = () => {
    navigation.navigate('Pengajuan');
  };

  const handleSidang = () => {
    navigation.navigate('Sidang');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pendaftarContainer}>
        <View>
          <Text style={styles.userTitle}>Welcome Back,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <DataPendaftar />
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
          onPress={handlePengajuan}>
          <Icon
            name="copy1"
            size={30}
            color="#0D4C92"
            style={{alignSelf: 'center', marginBottom: 5}}
          />
          <Text style={styles.iconText}>Pengajuan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 30,
            paddingVertical: 10,
          }}
          onPress={handleSidang}>
          <Icon
            name="calendar"
            size={30}
            color="#0D4C92"
            style={{alignSelf: 'center', marginBottom: 5}}
          />
          <Text style={{color: '#0D4C92', fontWeight: 'bold'}}>Sidang</Text>
        </TouchableOpacity>
      </View>
      <Pengumuman />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: 'white'},
  menuContainer: {
    marginTop: -30,
    marginHorizontal: 20,
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-around',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 10,
    borderRadius: 10,
  },
  pendaftarContainer: {
    backgroundColor: '#59C1BD',
    paddingBottom: 50,
  },
  dashboardTitle: {
    padding: 16,
    marginTop: 16,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userTitle: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 18,
  },
  userName: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconText: {color: '#0D4C92', fontWeight: 'bold'},
});
