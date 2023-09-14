import React, {useState} from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';

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
        textBody: 'Inputan tidak boleh kosong',
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

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <Text style={styles.registerTitle}>Register</Text>
        <Text style={styles.registerText}>Silahkan Buat Akun Anda</Text>
        <TextInput
          style={styles.input}
          placeholder="NIM"
          onChangeText={text => setNim(text)}
          value={nim}
        />
        <TextInput
          style={styles.input}
          placeholder="Nama Lengkap"
          onChangeText={text => setNama(text)}
          value={nama}
        />
        <View style={styles.picker}>
          <Picker
            selectedValue={jurusan}
            onValueChange={(itemValue, itemIndex) => setJurusan(itemValue)}>
            <Picker.Item label="Pilih Jurusan" value="" />
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
        <TextInput
          style={styles.input}
          placeholder="Nomor Handphone"
          onChangeText={text => setNomorHP(text)}
          value={nomorHP}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          value={password}
        />
        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={handleRegister}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" /> // Menampilkan loader
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Text style={styles.loginText}>Sudah punya akun?</Text>
        </TouchableOpacity>
      </View>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#7895CB',
    padding: 10,
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
  loginText: {
    color: 'gray',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  registerTitle: {
    fontSize: 36,
    padding: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  registerText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Register;
