import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import InputField from '../components/InputField';

export default function Profile({navigation}) {
  const [userData, setUserData] = useState([]);

  const handleSignOut = async () => {
    Alert.alert(
      'Logout',
      'Anda yakin ingin keluar dari akun saat ini?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Sign Out Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const currentUser = auth().currentUser;
              if (currentUser) {
                await auth().signOut();
                await AsyncStorage.removeItem('userToken');
                console.log('User signed out!');
                navigation.replace('Login');
              } else {
                console.log('No user is currently signed in.');
              }
            } catch (error) {
              console.log('Error signing out:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleResetPassword = async () => {
    Alert.alert(
      'Reset Password',
      'Apakah anda yakin ingin mereset ulang password?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Password Reset Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const email = userData.email;
              console.log(email);
              // await auth().sendPasswordResetEmail(email);
              console.log('Email reset password telah dikirim.');
              Alert.alert(
                'Reset Password',
                'Email reset password telah dikirim.',
                [
                  {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed'),
                    style: 'cancel',
                  },
                ],
                {cancelable: false},
              );
            } catch (error) {
              console.log('Error mengirim email reset password:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

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

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        {userData.image && (
          <Image
            source={{
              uri: `${userData.image}`,
            }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        <Text style={styles.textNama}>{userData.nama}</Text>
        <Pressable style={styles.btnEdit}>
          <Text style={styles.btnEditText}>Edit Profile</Text>
        </Pressable>
      </View>
      <View style={styles.dataContainer}>
        <InputField label={'NIM'} editable={false} value={userData.nim} />
        <InputField
          label={'Nama Lengkap'}
          editable={false}
          value={userData.nama}
        />
        <InputField
          label={'Program Studi'}
          editable={false}
          value={userData.jurusan}
        />
        <InputField
          label={'Nomor HP'}
          editable={false}
          value={userData.nomorHP}
        />
        <InputField label={'Email'} editable={false} value={userData.email} />
        <View style={styles.btnContainer}>
          <Pressable style={styles.btnReset} onPress={handleResetPassword}>
            <Text style={styles.btnResetText}>Reset Password</Text>
          </Pressable>
          <Pressable style={styles.btnLogout} onPress={handleSignOut}>
            <Text style={styles.btnLogoutText}>Logout</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
  },
  imageContainer: {
    height: 350,
    backgroundColor: '#176B87',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 50,
  },
  image: {
    width: 175,
    height: 175,
    borderRadius: 100,
  },
  textNama: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    paddingBottom: 5,
    paddingTop: 10,
  },
  btnEdit: {
    backgroundColor: 'whitesmoke',
    padding: 15,
    width: 300,
    marginTop: 10,
    borderRadius: 20,
    marginBottom: 30,
  },
  btnEditText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#176B87',
    textAlign: 'center',
  },
  btnLogout: {
    backgroundColor: '#FF6868',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  btnLogoutText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  dataContainer: {
    paddingVertical: 20,
  },
  btnReset: {
    backgroundColor: '#176B87',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  btnResetText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  btnContainer: {paddingHorizontal: 10},
});
