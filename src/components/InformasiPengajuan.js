import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
const InformasiPengajuan = () => {
  return (
    <View>
      <Text style={styles.daftarTitle}>Informasi Pengajuan</Text>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Icon name="folder" size={30} color="#FF8080" />
          <View style={styles.rightContentContainer}>
            <Text style={styles.contentTitle}>Kerja Praktek</Text>
            <Text style={styles.contentText}>
              Pengajuan KP belum dapat dilakukan
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Icon name="thumbtack" size={30} color="#EEC759" />
          <View style={styles.rightContentContainer}>
            <Text style={styles.contentTitle}>Skripsi</Text>
            <Text style={styles.contentText}>
              Pengajuan Skripsi belum dapat dilakukan
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InformasiPengajuan;

const styles = StyleSheet.create({
  daftarTitle: {
    color: 'black',
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  container: {
    padding: 10,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    elevation: 2,
  },
  contentContainer: {display: 'flex', flexDirection: 'row', marginLeft: 20},
  contentTitle: {fontWeight: 'bold', color: 'black'},
  contentText: {fontWeight: '400', fontSize: 12},
  rightContentContainer: {marginLeft: 20},
});
