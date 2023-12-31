import React from 'react';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const useLogin = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Peringatan',
        textBody: 'Email/Password tidak boleh kosong!',
        button: 'Tutup',
      });
      return;
    }
    try {
      setIsLoading(true);
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );

      const userDoc = firestore()
        .collection('users')
        .doc(userCredential.user.uid);

      try {
        const docSnapshot = await userDoc.get();

        if (docSnapshot.exists) {
          const userData = docSnapshot.data();
          console.log(userData);

          const userRole = userData.role;
          if (userRole === 'Mahasiswa') {
            console.log('User logged in successfully!');
            const userToken = userCredential.user.uid;
            await AsyncStorage.setItem('userToken', userToken);
            navigation.replace('Homepage');
          } else {
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: 'Peringatan',
              textBody: 'Anda bukan Mahasiswa',
              button: 'Tutup',
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Peringatan',
          textBody: 'Akun tidak terdaftar!',
          button: 'Tutup',
        });
      } else if (error.code === 'auth/wrong-password') {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Peringatan',
          textBody: 'Email/Password salah',
          button: 'Tutup',
        });
      } else {
        Alert.alert('Error', 'Login failed. Please try again later.');
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    handleLogin,
  };
};

export default useLogin;
