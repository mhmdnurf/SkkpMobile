import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import useJadwalPengajuan from '../hooks/useJadwalPengajuan';
const InformasiPengajuan = () => {
  const dates = useJadwalPengajuan();

  return (
    <View>
      <Text style={styles.daftarTitle}>Informasi Pengajuan</Text>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Icon name="folder" size={30} color="#FF8080" />
          <View style={styles.rightContentContainer}>
            <Text style={styles.contentTitle}>Kerja Praktek</Text>
            {dates.tanggalBukaKP && dates.tanggalTutupKP ? (
              <Text style={styles.contentText}>
                {new Intl.DateTimeFormat('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }).format(dates.tanggalBukaKP)}{' '}
                -{' '}
                {new Intl.DateTimeFormat('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }).format(dates.tanggalTutupKP)}
              </Text>
            ) : (
              <Text style={styles.closedText}>
                Pengajuan KP belum dapat dilakukan
              </Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Icon name="folder" size={30} color="#EEC759" />
          <View style={styles.rightContentContainer}>
            <Text style={styles.contentTitle}>Skripsi</Text>
            {dates.tanggalBukaSkripsi && dates.tanggalTutupSkripsi ? (
              <Text style={styles.contentText}>
                {new Intl.DateTimeFormat('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }).format(dates.tanggalBukaSkripsi)}{' '}
                -{' '}
                {new Intl.DateTimeFormat('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }).format(dates.tanggalTutupSkripsi)}
              </Text>
            ) : (
              <Text style={styles.closedText}>
                Pengajuan Skripsi belum dapat dilakukan
              </Text>
            )}
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
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 20,
  },
  contentTitle: {fontWeight: '600', color: '#176B87'},
  contentText: {fontWeight: '400', fontSize: 12, color: '#6F7789'},
  closedText: {fontWeight: '600', fontSize: 12, color: '#FF6868'},
  rightContentContainer: {marginLeft: 20},
});
