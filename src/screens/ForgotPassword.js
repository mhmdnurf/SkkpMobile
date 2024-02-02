import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import React from 'react';
import Logo from '../assets/forgot_password.svg';
import auth from '@react-native-firebase/auth';

const ForgotPassword = () => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const screenHeight = Dimensions.get('window').height;
  const handleResetPassword = async () => {
    try {
      setLoading(true);
      await auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Request berhasil',
        'Email reset password telah dikirim ke email anda.',
      );
      console.log('Email reset password telah dikirim.');
      setLoading(false);
    } catch (error) {
      console.log('Error mengirim email reset password:', error);
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{...styles.container, height: screenHeight}}>
      <View>
        <View style={styles.imageContainer}>
          <Logo width={250} height={250} />
        </View>
        <Text style={styles.formTitle}>Forgot</Text>
        <Text style={styles.formTitle}>Password?</Text>
        <Text style={styles.formText}>
          Masukkan email anda yang sudah terdaftar.
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
        />
      </View>
      <Pressable style={styles.btnLogin} onPress={handleResetPassword}>
        {loading ? (
          <Text style={styles.btnText}>Loading...</Text>
        ) : (
          <Text style={styles.btnText}>Request Password</Text>
        )}
      </Pressable>
    </ScrollView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#176B87',
  },
  formText: {
    marginBottom: 10,
  },
  input: {
    width: Dimensions.get('window').width - 48,
    marginVertical: 10,
    borderWidth: 0.4,
    borderColor: '#2B3499',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  btnLogin: {
    backgroundColor: '#176B87',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    elevation: 2,
    width: Dimensions.get('window').width - 48,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
