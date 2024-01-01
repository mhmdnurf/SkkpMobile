import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

const images = {
  kerja_praktek: require('../assets/kerja_praktek.jpg'),
  sempro: require('../assets/seminar_proposal.jpg'),
  kompre: require('../assets/kompre.jpg'),
  skripsi: require('../assets/skripsi.jpg'),
};

const Pendaftar = ({title, jumlah, imageSource}) => {
  return (
    <>
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={imageSource ? images[imageSource] : null}
            style={styles.imageSize}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>{title}</Text>
          <Text style={styles.infoJumlah}>{jumlah} Mahasiswa</Text>
        </View>
      </View>
    </>
  );
};

export default Pendaftar;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 18,
    marginTop: 24,
    marginLeft: 10,
    height: 200,
    width: 300,
    elevation: 6,
  },
  infoContainer: {
    marginLeft: 16,
  },
  imageContainer: {
    margin: 14,
    height: '55%',
  },
  imageSize: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  infoTitle: {fontSize: 18, color: '#176B87', fontWeight: 'bold'},
  infoJumlah: {fontSize: 16, color: 'grey'},
});
