// SplashScreen.js
import {Image, Text, View, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';

export default function Splash() {
  return (
    <View style={styles.root}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://sttindonesia.ac.id/wp-content/uploads/2021/01/Logo-STTI-Tanjungpinang.png',
          }}
          style={{
            width: 250,
            height: 260,
          }}
        />
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
    backgroundColor: 'white',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    color: 'black',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 100,
  },
});
