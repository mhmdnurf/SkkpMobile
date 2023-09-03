import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      console.log('User logged in successfully!');
      const userToken = userCredential.user.uid;
      await AsyncStorage.setItem('userToken', userToken);
      navigation.navigate('Homepage');
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

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <Text style={styles.loginTitle}>Login</Text>
        <Text style={styles.loginText}>Silahkan Login Terlebih Dahulu</Text>
        <Image
          source={require('../assets/undraw_Graduation_re_gthn.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <TextInput
          style={styles.inputEmail}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword} // Menggunakan secureTextEntry sesuai dengan showPassword
            onChangeText={text => setPassword(text)}
            value={password}
          />
          <TouchableOpacity
            style={styles.showPasswordIcon}
            onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye-slash' : 'eye'} // Menggunakan icon sesuai dengan showPassword
              size={25}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={handleLogin}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" /> // Menampilkan loader
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={() => {
            navigation.navigate('Register');
          }}>
          <Text style={styles.registerText}>Belum punya akun?</Text>
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
  inputEmail: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 20,
  },
  buttonLogin: {
    backgroundColor: '#7895CB',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  registerText: {
    color: 'gray',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  buttonRegister: {
    marginTop: 10,
    alignItems: 'center',
  },
  image: {width: 500, height: 200, marginBottom: 20},
  loginTitle: {
    fontSize: 36,
    padding: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  showPasswordIcon: {
    marginLeft: 10,
  },
});

export default Login;
