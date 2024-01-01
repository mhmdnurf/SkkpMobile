import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';
import InputRegister from '../components/InputRegister';

const Register = ({navigation}) => {
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [jurusan, setJurusan] = useState('');
  const [nomorHP, setNomorHP] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (
      email === '' ||
      password === '' ||
      nim === '' ||
      nama === '' ||
      jurusan === '' ||
      nomorHP === ''
    ) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Peringatan',
        textBody: 'Field tidak boleh kosong',
        button: 'Tutup',
      });
      return;
    }
    try {
      setIsLoading(true);

      const nimSnapshot = await firestore()
        .collection('users')
        .where('nim', '==', nim)
        .get();

      if (!nimSnapshot.empty) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Peringatan',
          textBody: 'NIM sudah digunakan',
          button: 'Tutup',
        });
        setIsLoading(false);
        return;
      }

      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Berhasil',
        textBody: 'Registrasi berhasil dilakukan',
        button: 'Tutup',
      });

      await firestore().collection('users').doc(userCredential.user.uid).set({
        uid: userCredential.user.uid,
        nim: nim,
        nama: nama,
        jurusan: jurusan,
        nomorHP: nomorHP,
        email: email,
        role: 'Mahasiswa',
        image:
          'https://firebasestorage.googleapis.com/v0/b/skkp-mobile.appspot.com/o/undraw_Male_avatar_g98d.png?alt=media&token=9f76fc44-dc93-43c8-bbd2-914a9822205d',
      });

      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Peringatan',
          textBody: 'Email sudah digunakan',
          button: 'Tutup',
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Peringatan',
          textBody: 'Registrasi gagal',
          button: 'Tutup',
        });
      }
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <AlertNotificationRoot>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.registerTitle}>Register</Text>
        <Text style={styles.registerText}>Silahkan Buat Akun Anda</Text>
        <InputRegister
          label={'NIM'}
          placeholder={'1219001'}
          onChangeText={text => setNim(text)}
        />
        <InputRegister
          label={'Nama Lengkap'}
          placeholder={'John Doe'}
          onChangeText={text => setNama(text)}
        />
        <Text style={styles.inputLabel}>Prodi</Text>
        <View style={styles.picker}>
          <Picker
            placeholder="Pilih Jurusan"
            selectedValue={jurusan}
            onValueChange={(itemValue, itemIndex) => setJurusan(itemValue)}>
            <Picker.Item label="Pilih Jurusan" color="#6F7789" value="" />
            <Picker.Item
              label="Teknik Informatika"
              value="Teknik Informatika"
            />
            <Picker.Item label="Sistem Informasi" value="Sistem Informasi" />
            <Picker.Item
              label="Komputer Akuntansi"
              value="Komputer Akuntansi"
            />
          </Picker>
        </View>
        <InputRegister
          label={'Nomor HP'}
          placeholder={'0827817187'}
          onChangeText={text => setNomorHP(text)}
        />
        <InputRegister
          label={'Email'}
          placeholder={'mhs@example.com'}
          onChangeText={text => setEmail(text)}
        />
        <InputRegister
          label={'Password'}
          placeholder={'********'}
          onChangeText={text => setPassword(text)}
        />
        <Pressable
          style={styles.buttonRegister}
          onPress={handleRegister}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" /> // Menampilkan loader
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </Pressable>
        <View style={styles.daftarContainer}>
          <Text style={styles.secondGreet}>Sudah punya akun?</Text>
          <Pressable onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
  },
  picker: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonRegister: {
    backgroundColor: '#176B87',
    padding: 13,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  buttonLogin: {
    marginTop: 10,
    alignItems: 'center',
  },
  registerTitle: {
    fontSize: 36,
    color: '#176B87',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 80,
  },
  registerText: {
    fontSize: 14,
    marginBottom: 20,
    color: '#6F7789',
    fontWeight: '400',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#176B87',
    marginBottom: 10,
  },
  loginText: {
    color: '#8294C4',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  daftarContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 40,
  },
  secondGreet: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6F7789',
    marginRight: 5,
  },
});

export default Register;
