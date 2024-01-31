import {Image, Text, View, StyleSheet, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash({navigation}) {
  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        navigation.replace('Homepage');
      } else {
        navigation.replace('Login');
      }
    } catch (error) {
      console.log('Error checking login status:', error);
      navigation.replace('Login');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkLoginStatus();
    }, 3000);
    return () => clearInterval(interval);
  });

  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={'#176B87'} />
      <View style={styles.root}>
        <View>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/splash.png')}
              style={styles.imageStyling}
            />
          </View>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>SKKP Mobile</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#176B87',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 200,
    elevation: 5,
  },
  imageStyling: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  textWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 100,
  },
});
