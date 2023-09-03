// SplashScreen.js
import {Image, Text, View, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash({navigation}) {
  useEffect(() => {
    checkLoginStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        navigation.navigate('Homepage');
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log('Error checking login status:', error);
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.imageRoot}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://sttindonesia.ac.id/wp-content/uploads/2021/01/Logo-STTI-Tanjungpinang.png',
            }}
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
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7895CB',
  },
  imageRoot: {},
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'whitesmoke',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 7,
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
