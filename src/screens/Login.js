import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Pressable,
} from 'react-native';
import useLogin from '../hooks/useLogin';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import Logo from '../assets/login.svg';
import InputField from '../components/InputField';

const Login = ({navigation}) => {
  const {email, setEmail, password, setPassword, isLoading, handleLogin} =
    useLogin();

  const handleRegister = () => {
    navigation.navigate('Register');
  };
  return (
    <AlertNotificationRoot>
      <StatusBar backgroundColor="white" barStyle={'dark-content'} />
      <ScrollView style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo width={200} height={200} />
        </View>
        <View style={styles.greetContainer}>
          <Text style={styles.mainGreet}>Welcome back 👋</Text>
          <Text style={styles.secondGreet}>
            Silahkan login terlebih dahulu dengan akun mahasiswa anda.
          </Text>
        </View>
        <InputField
          label={'Email'}
          placeholder={'mhs@example.com'}
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <InputField
          label={'Password'}
          placeholder={'********'}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <Pressable>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </Pressable>
        <View style={styles.btnLogin}>
          <Pressable onPress={handleLogin}>
            {isLoading ? (
              <Text style={styles.btnText}>Loading..</Text>
            ) : (
              <Text style={styles.btnText}>Login</Text>
            )}
          </Pressable>
        </View>
        <View style={styles.daftarContainer}>
          <Text style={styles.secondGreet}>Belum punya akun?</Text>
          <Pressable onPress={handleRegister}>
            <Text style={styles.registerText}>Register</Text>
          </Pressable>
        </View>
        <View style={styles.footerContainer}>
          <Text style={styles.textFooter}>
            Sekolah Tinggi Teknologi Indonesia Tanjung Pinang
          </Text>
        </View>
      </ScrollView>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#176B87',
    textAlign: 'center',
    marginTop: 100,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 50,
  },
  greetContainer: {
    marginBottom: 20,
  },
  mainGreet: {
    fontSize: 24,
    fontWeight: '600',
    color: '#176B87',
    marginLeft: 20,
    marginTop: 40,
  },
  secondGreet: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6F7789',
    marginLeft: 20,
    marginRight: 5,
  },
  forgot: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#8294C4',
    marginRight: 20,
    textAlign: 'right',
  },
  btnLogin: {
    backgroundColor: '#176B87',
    borderRadius: 10,
    padding: 13,
    marginHorizontal: 20,
    marginTop: 20,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  daftarContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 40,
  },
  registerText: {
    color: '#8294C4',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textFooter: {color: '#6F7789', fontWeight: 'bold'},
});

export default Login;
